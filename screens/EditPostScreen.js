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
import { useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


let itemList =[]
const EditPostScreen = ({route}) => {
  const [caption, setCaption] = useState('')
  const [userData, setUserData] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
    
    
  const { postID } = route.params
  const auth = getAuth()
  const user = auth.currentUser

  const getUser = async() => {
    const userDoc = doc(db, 'users', user.uid)
    const userSnapShot = await getDoc(userDoc)
    setUserData(userSnapShot.data())
  }

  const getOriData = async() => {
    const postRef = doc(db, 'wholePosts', postID.toString())
    const postSnapShot = await getDoc(postRef)
    const oriCaption = postSnapShot.data().postCaption
    const oriItemList = postSnapShot.data().itemList
    setCaption(oriCaption)
    itemList = oriItemList
  }

  useEffect(() => {
    getUser();
    getOriData()
  });

  

  const handleEditPost = async() => {
    
      const itemColl = collection(db, 'posts', user.uid, 'ownPosts')
      const snapshot = await getCountFromServer(itemColl);
      const numItems = snapshot.data().count + 1
      const itemRef = doc(db, 'posts', user.uid, 'ownPosts', numItems.toString())
      //console.log(caption)
      await updateDoc(itemRef, {
        postCaption: caption,
        // postImgURL: imgUrl,
        // user: user.uid,
        itemList: itemList,
        // username: userData.username,
        // userImgURL: userData.userImgURL,
        // postNum: numItems,
        // likesNum: 0,
        // liked: false,
      })

      
      const postColl = collection(db, 'wholePosts')
      const postSnapShot = await getCountFromServer(postColl)
      const numPosts = snapshot.data().count + 1
      const postRef = doc(db, 'wholePosts', numPosts.toString())
      await updateDoc(postRef, {
        postCaption: caption,
        // postImgURL: imgUrl,
        // user: user.uid,
        itemList: itemList,
        // username: userData.username,
        // userImgURL: userData.userImgURL,
        // postNum: numItems,
        // likesNum: 0,
        // liked: false,
      })

      if (caption == '') {
        setErrorMessage("Caption cannot be empty!")
        return Alert.alert(errorMessage)
      }
      if (itemList.length == 0) {
          setErrorMessage("Password cannot be empty!")
          return Alert.alert(errorMessage)
      } 

      setCaption('')
      itemList.length = 0
      
      Alert.alert("Post uploaded!")
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
        <ScrollView>
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
          placeholder={caption}
          value={caption}
          onChangeText={text => setCaption(text)}
          style={styles.inputText}
        />
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
        {itemList.map((item, index) => (
                <View key={index}>
                  <Text style={styles.addedItemText}>
                      {item.itemType + " - " + item.itemLink}
                  </Text>
                </View>
          ))}
      </View>
      
      <View style={styles.indivContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.submitContainer}
          onPress={handleEditPost}>
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
    marginTop: 10, 
    marginBottom: 15,
  },
  uploadContainer: {
    width: '100%',
    backgroundColor: '#20b2aa',
    padding: 8,
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
    alignSelf: "center",
  },
  addedItemText: {
    fontWeight: '500',
    fontSize: 16,
    alignSelf: "center"
  }
});

export default EditPostScreen