import * as React from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, TextInput, Image } from 'react-native';
import Constants from 'expo-constants';
import { useState, useContext, useEffect } from 'react';
//import { AuthContext } from '../navigation/AuthProvider';
import { db } from '../firebaseConfig';

import * as ImagePicker from 'expo-image-picker'
import { updateDoc, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ProfileScreen from './ProfileScreen';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ScrollView } from 'react-native-gesture-handler';

import { Alert } from 'react-native';





const EditProfileScreen = ({navigation}) => {
  //const {user, logout} = useContext(AuthContext);
  const [imageURI, setImageURI] = useState(null);
  const [imageURL, setImageURL] = useState('')
  //const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  const[uploading, setUploading] = useState(false)

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
      const userRef = doc(db, 'users', user.uid.toString())
      const documentSnapshot = await getDoc(userRef)
        if (documentSnapshot.exists()) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
          setName(documentSnapshot.data().username)
          setAbout(documentSnapshot.data().aboutUser)
          setImageURI(documentSnapshot.data().userImgURL)
        } else {
          console.log("No such user!")
        }
  }

  const handleUpdate = async() => {
      //should i call get user..?
      
      let imgUrl = await uploadImage(imageURI, user.uid, true);
      //uploadImage()
    
        if( imgUrl == null && userData.userImgURL) {
          imgUrl = userData.userImgURL;
        }

        await setDoc(doc(db, 'users', user.uid), {
          username: name,
          aboutUser: about,
          userImgURI: imageURI,
          userImgURL: imgUrl,
        }).then(()=> {

       
        
        setName('')
        setAbout('')
        setImageURI(null)

        Alert.alert("Updated Profile!")
        navigation.goBack()
         })
    }

    // const getBlobFroUri = async (uri) => {
    //   const blob = await new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest();
    //     xhr.onload = function () {
    //       resolve(xhr.response);
    //     };
    //     xhr.onerror = function (e) {
    //       reject(new TypeError("Network request failed"));
    //     };
    //     xhr.responseType = "blob";
    //     xhr.open("GET", uri, true);
    //     xhr.send(null);
    //   });
    
    //   return blob;
    // };

    const uploadImage = async (uri, name, onProgress) => {
      const metadata = {
        contentType: 'image/jpeg'
      };
      
      // Upload file and metadata to the object 'images/mountains.jpg'
      const storage = getStorage()
      const storageRef = ref(storage, 'userImg');
      //const file = getBlobFroUri(imageURI)
      const fetchResponse = await fetch(uri)
      const theBlob = await fetchResponse.blob()
      const filename = uri.substring(uri.lastIndexOf('/') + 1)
      const imageRef = ref(storage, `userImg/${filename}`)
      const uploadTask = uploadBytesResumable(imageRef, theBlob, metadata);

      setUploading(true);
    setTransferred(0);
      
      // // Listen for state changes, errors, and completion of the upload.
      // uploadTask.on('state_changed',
      //   (snapshot) => {
      //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //     onProgress && onProgress
      //     console.log('Upload is ' + progress + '% done');
      //     switch (snapshot.state) {
      //       case 'paused':
      //         console.log('Upload is paused');
      //         break;
      //       case 'running':
      //         console.log('Upload is running');
      //         break;
      //     }
      //   }, 
      //   (error) => {
      //     // A full list of error codes is available at
      //     // https://firebase.google.com/docs/storage/web/handle-errors
      //     switch (error.code) {
      //       case 'storage/unauthorized':
      //         // User doesn't have permission to access the object
      //         break;
      //       case 'storage/canceled':
      //         // User canceled the upload
      //         break;
      
      //       // ...
      
      //       case 'storage/unknown':
      //         // Unknown error occurred, inspect error.serverResponse
      //         break;
      //     }
      //   }, 
      //   () => {
      //     // Upload completed successfully, now we can get the download URL
      //     // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      //     //   console.log('File available at', downloadURL);
      //     //   setImageURL(downloadURL)
      //     //   return downloadURL
      //     // });
      //     await uploadTask
      //     const downURL = await imageRef.getDownloadURL()
      //     setImageURL(downURL)
      //     return downURL
      //   }
      // );
      uploadTask.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    //try {
      await uploadTask;

      const url = await getDownloadURL(imageRef);

      setUploading(false);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    // } catch (e) {
    //   console.log('errornull');
    //   return null;
    // }

    }

    // const uploadImage = async (fileBlob) => {
    //   const imgName = "img-" + new Date().getTime();
    //   const userRef = doc(db, 'users', user.uid)
    //   //const storageRef = firebase.storage().ref(`images/${imgName}.jpg`);
    //   const metadata = {
    //     contentType: "image/jpeg",
    //   };
    //   const uploadTask = setDoc(userRef, {fileBlob, metadata})

    //   console.log("uploading file", imgName);
    // }

  // async function uploadImage(uri) {
  //     // Why are we using XMLHttpRequest? See:
  //     // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  //     const blob = await new Promise((resolve, reject) => {
  //       const xhr = new XMLHttpRequest();
  //       xhr.onload = function () {
  //         resolve(xhr.response);
  //       };
  //       xhr.onerror = function (e) {
  //         console.log(e);
  //         reject(new TypeError("Network request failed"));
  //       };
  //       xhr.responseType = "blob";
  //       xhr.open("GET", uri, true);
  //       xhr.send(null);
  //     });
    
  //     const fileRef = ref(db, uuid.v4());
  //     const result = await uploadBytes(fileRef, blob);
    
  //     // We're done with the blob, close and release it
  //     blob.close();
    
  //     return await getDownloadURL(fileRef);
  //   }

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
        setImageURI(result.assets[0].uri)
      } else {
        alert("Image not selected.")
      }
    }

    useEffect(() => {
    getUser();
  }, []);


    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
  
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
        {imageURI && <Image source={{ uri: imageURI }} style={{ width: 200, height: 200 }} />}
      </View>
      <View style={styles.indivContainer}>
        <Text style={styles.optionText}>
          Username
        </Text>
        <TextInput
          placeholder={name}
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
          placeholder={about}
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
    