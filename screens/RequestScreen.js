import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, TextInput, ScrollView, Image } from 'react-native';
import Constants from 'expo-constants';
import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker'
import { updateDoc, doc, getDoc, setDoc, getCountFromServer, collection } from 'firebase/firestore';
import { Alert } from 'react-native';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const RequestScreen = ({route}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [additionalNote, setAdditionalNote] = useState('')
  const [imgURI, setImgURI] = useState('')
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  // const auth = getAuth()
  // const user = auth.currentUser
  const { postOwnerUID, currentUserUID, postNum,} = route.params

  
  const uploadImage = async (uri, name, onProgress) => {
    const metadata = {
      contentType: 'image/jpeg'
    };
    
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storage = getStorage()
    const storageRef = ref(storage, 'requestImg');
    //const file = getBlobFroUri(imageURI)
    const fetchResponse = await fetch(uri)
    const theBlob = await fetchResponse.blob()
    const imageRef = ref(storage, `requestImg/${currentUserUID}`)
    const uploadTask = uploadBytesResumable(imageRef, theBlob, metadata);

    setUploading(true);
    setTransferred(0);
    uploadTask.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

      await uploadTask;

      const url = await getDownloadURL(imageRef);

      setUploading(false);

      return url;
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    })

    if (!result.canceled) {
      setImgURI(result.assets[0].uri)
      const source = {uri: result.assets[0].uri}
      console.log(source)
    } else {
      alert("Image not selected.")
    }
  }

  const handleAddRequest = async() => {
    //should i call get user..?
    
    let imgUrl = await uploadImage(imgURI, 'na', true);
    console.log(postNum)
    const itemRef = doc(db, 'users', postOwnerUID.toString(), 'requests', postNum.toString())
      console.log(title)
      await setDoc(itemRef, {
        itemTitle: title,
        itemDescription: description,
        itemPrice: price,
        itemAdditionalNote: additionalNote,
        itemImg: imgUrl,
        itemOwner: currentUserUID,
        itemPost: postNum.toString(),
      })

      setTitle('')
      setDescription('')
      setPrice('')
      setAdditionalNote('')
      setImgURI('')

      Alert.alert("Item successfully requested!")

  }


  return (
    <SafeAreaView style={styles.safeContainer}>
    <ScrollView>
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
    <View style={styles.inputContainer}>
      <View style={styles.indivContainer}>
        <Text style={styles.optionText}>
          Item Title
        </Text>
        <TextInput
          placeholder="Enter here"
          value={title}
          onChangeText={text => setTitle(text)}
          style={styles.inputText}
        />
      </View>
      <View style={styles.indivContainer}>
        <Text style={styles.optionText}>
          Item Description
        </Text>
        <TextInput
          placeholder="Enter here"
          value={description}
          onChangeText={text => setDescription(text)}
          style={styles.inputText}
        />
      </View>
      <View style={styles.indivContainer}>
        <Text style={styles.optionText}>
          Item Price (S$)
        </Text>
        <TextInput
          placeholder="Enter here"
          value={price}
          onChangeText={text => setPrice(text)}
          style={styles.inputText}
        />
      </View>
      <View style={styles.indivContainer}>
        <Text style={styles.optionText}>
          Additional Notes
        </Text>
        <TextInput
          placeholder="Enter here"
          value={additionalNote}
          onChangeText={text => setAdditionalNote(text)}
          style={styles.inputText}
        />
      </View>
      <View style={styles.indivContainer}>
        <Text style={styles.optionText}>
          Upload Photo
        </Text>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.uploadContainer}
          onPress={pickImageAsync}>
          <Text style={styles.uploadText}>
            Click here to upload!
          </Text>
        </TouchableOpacity>
        {imgURI && <Image source={{ uri: imgURI }} style={{ width: 200, height: 200 }} />}
      </View>
      <View style={styles.indivContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.submitContainer}
          onPress={handleAddRequest}>
          <Text style={styles.uploadText}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </KeyboardAvoidingView>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  inputContainer: {
    flex: 1,
    marginTop: 20,  
    width: '80%',
    alignSelf: 'center',   
  },
  indivContainer: {
    marginTop: 15, 
    marginBottom: 15,
  },
  uploadContainer: {
    width: '65%',
    backgroundColor: '#20b2aa',
    padding: 3,
    marginTop: 5,
    borderRadius: 10,
    marginBottom: 15,
  },
  backContainer: {
    width: '20%',
    backgroundColor: 'grey',
    padding: 3,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'left',
  },
  submitContainer: {
    width: '35%',
    backgroundColor: 'grey',
    padding: 8,
    marginTop: 5,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  optionText: {
    color: '#20b2aa',
    fontWeight: '600',
    fontSize: 16,
    textAlign: "left",
  },
  uploadText: {
    color: `white`,
    fontWeight: '700',
    fontSize: 16,
  }
});

export default RequestScreen
