import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, TextInput, Image } from 'react-native';
import Constants from 'expo-constants';
import { useState, useContext } from 'react';
//import { AuthContext } from '../navigation/AuthProvider';
import { db } from '../firebaseConfig';

import * as ImagePicker from 'expo-image-picker'
import { updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import ProfileScreen from './ProfileScreen';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ScrollView } from 'react-native-gesture-handler';

import { Alert } from 'react-native';





const EditProfileScreen = () => {
  //const {user, logout} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  // const [uploading, setUploading] = useState(false);
  // const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  const[uploading, setUploading] = useState(null)

  const auth = getAuth()
  const user = auth.currentUser
  
  const getUser = async() => {
      //const users = await getDocs(collection(db, 'users'))
        
      // const currentUser = users.doc(user.uid).get()
      // .then((documentSnapshot) => {
      //   if( documentSnapshot.exists ) {
      //     console.log('User Data', documentSnapshot.data());
      //     setUserData(documentSnapshot.data());
      //   }
      const userRef = doc(db, 'users', user.uid)
      const documentSnapshot = await getDoc(userRef)
        if (documentSnapshot.exists()) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        } else {
          console.log("No such user!")
        }
  }

  const handleUpdate = async() => {
      //should i call get user..?
      
      let imgUrl = await uploadImage();
    
        // if( imgUrl == null && userData.userImg ) {
        //   imgUrl = userData.userImg;
        // }

        console.log(name)
        await setDoc(doc(db, 'users', user.uid), {
          username: name,
          aboutUser: about,
          userImg: imgUrl,
        })

        setName('')
        setAbout('')

        Alert.alert("Updated Profile!")
    }

    const uploadImage = async () => {
      // setUploading(true)
      // const response = await fetch(image.uri.lastIndexOf('/')+1)
      // const blob = response.blob()
      // const url = URL.createObjectURL(blob)
      // setUploading(false)
      // setImage(null)
      // return url
      return image
    }

    const pickImageAsync = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
        aspect: [1, 1],
      })

      if (!result.canceled) {
        //setImage(result.assets[0].uri)
        const source = {uri: result.assets[0].uri}
        console.log(source)
        setImage(result.assets[0].uri)
      } else {
        alert("Image not selected.")
      }
    }

    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
  
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
          Upload Profile Photo
        </Text>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.uploadContainer}
          onPress={pickImageAsync}>
          <Text style={styles.uploadText}>
            Click here to upload!
          </Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
      <View style={styles.indivContainer}>
        <Text style={styles.optionText}>
          Username
        </Text>
        <TextInput
          placeholder="Enter here"
          value={name}
          onChangeText={text => setName(text)}
          style={styles.inputText}
        />
      </View>
      <View style={styles.indivContainer}>
        <Text style={styles.optionText}>
          About
        </Text>
        <TextInput
          placeholder="Enter here"
          value={about}
          onChangeText={text => setAbout(text)}
          style={styles.inputText}
        />
      </View>
      
      
      <View style={styles.indivContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.submitContainer}
          onPress={handleUpdate}>
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
    marginBottom: 10,
  },
  backContainer: {
    width: '20%',
    backgroundColor: 'grey',
    padding: 3,
    marginBottom: 15,
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

export default EditProfileScreen
    