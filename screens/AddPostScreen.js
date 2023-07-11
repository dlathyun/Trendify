import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, TextInput, ScrollView, Image, FlatList } from 'react-native';
import Constants from 'expo-constants';
import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker'
import { updateDoc, doc, getDoc, setDoc, getCountFromServer, collection } from 'firebase/firestore';
import { Alert } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown'

const itemOptions = [
    // name key is must. It is to show the text in front
    {id: 1, name: 'Shirt'},
    {id: 2, name: 'Pants'},
    {id: 3, name: 'Skirts'},
    {id: 4, name: 'Shoes'},
    {id: 5, name: 'Accessories'},
    {id: 6, name: 'Hat/Cap'},
    {id: 7, name: 'Socks'},
    {id: 8, name: 'Mask'},
    {id: 9, name: 'Bag'},
    {id: 10, name: 'Jacket'},
];
const itemList =[]
const AddPostScreen = () => {
  const [caption, setCaption] = useState('')
  const [img, setImg] = useState('')

  const auth = getAuth()
  const user = auth.currentUser

  const handleAddPost = async() => {
    //should i call get user..?
    
    let imgUrl = await uploadImage();
  
      // if( imgUrl == null && userData.userImg ) {
      //   imgUrl = userData.userImg;
      // }
      
      const itemColl = collection(db, 'users', user.uid, 'posts')
      const snapshot = await getCountFromServer(itemColl);
      const numItems = snapshot.data().count + 1
      const itemRef = doc(db, 'users', user.uid, 'posts', numItems.toString())
      console.log(caption)
      await setDoc(itemRef, {
        postCaption: caption,
        postImg: img,
        user: user.uid,
        itemList: itemList
      })

      setCaption('')
      setImg('')
      

  }
  const uploadImage = async () => {
    // setUploading(true)
    // const response = await fetch(image.uri.lastIndexOf('/')+1)
    // const blob = response.blob()
    // const url = URL.createObjectURL(blob)
    // setUploading(false)
    // setImage(null)
    // return url
    return img
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      aspect: [3, 4],
    })

    if (!result.canceled) {
      //setImage(result.assets[0].uri)
      const source = {uri: result.assets[0].uri}
      console.log(source)
      setImg(result.assets[0].uri)
    } else {
      alert("Image not selected.")
    }
  }

  


  const [item, setItem] = useState('')
  const [link, setLink] = useState('')
  
  
  const handleAddItem = async() => {
    itemList.push({itemType: item, itemLink: link})
    setItem('')
    setLink('')
    console.log(itemList)
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
        <ScrollView style={{backgroundColor: '#ecf0f1'}}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
            >
    <View style={styles.inputContainer}>
      <View style={styles.indivContainer}>
        <Text style={styles.optionText}>
          Caption
        </Text>
        <TextInput
          placeholder="Enter here"
          value={caption}
          onChangeText={text => setCaption(text)}
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
        {img && <Image source={{ uri: img }} style={{ width: 300, height: 400 }} />}
      </View>
      <View style={styles.indivContainer}>
        <Text style={styles.optionText}>
          Links for items (if any)
        </Text>
        <View style={styles.linkContainer}>
            <Text style={styles.linkText}>
                Item type:
            </Text>
            <TextInput
            placeholder="Enter here"
            value={item}
            onChangeText={text => setItem(text)}
            style={styles.inputLink}
            />
        </View>
        
        <View style={styles.linkContainer}>
            <Text style={styles.linkText}>
                Item link:
            </Text>
            <TextInput
            placeholder="Enter here"
            value={link}
            onChangeText={text => setLink(text)}
            style={styles.inputLink}
            />
        </View>
      </View>
      <View style={styles.indivContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.addContainer}
          onPress={handleAddItem}>
          <Text style={styles.addText}>
            Add Item
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.indivContainer}>
        <FlatList
            data={itemList}
            renderItem={({item}) => 
              <Text style={styles.addedItemText}>
                {item.itemType + " - " + item.itemLink}
              </Text>}
        />
      </View>
      
      <View style={styles.indivContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.submitContainer}
          onPress={handleAddPost}>
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
    backgroundColor: 'white',
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
  linkContainer: {
    flexDirection: 'row',
    marginTop: 15,

  },
  linkText: {
    fontWeight: '500',
  },
  submitContainer: {
    width: '65%',
    backgroundColor: '#20b2aa',
    padding: 8,
    marginTop: 5,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addContainer: {
    width: '35%',
    backgroundColor: 'grey',
    padding: 8,
    marginTop: 5,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: `white`,
    fontWeight: '500',
    fontSize: 13,
  },
  inputText: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  inputLink: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    marginLeft: 15,
    width: '80%'
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
  },
  addedItemText: {
    fontWeight: '500',
    fontSize: 16,
    alignSelf: "center"
  }
});

export default AddPostScreen
