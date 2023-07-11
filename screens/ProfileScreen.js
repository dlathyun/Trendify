import React, { useState, useEffect, useContext} from 'react';
import { Text, View, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import Constants from 'expo-constants';
//import { AuthContext } from "@navigation/AuthProvider";
import { Firestore, doc, getDoc, setDoc, collection, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";



// const auth = getAuth();
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/auth.user
//     const uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });


  
const ProfileScreen = ({navigation, route}) => {

  const renderPost = ({ item }) => (
    <TouchableOpacity onPress={() => {
      navigation.navigate('Post', {
        caption: item.postCaption,
        image: item.postImg,
        user: item.user,
        itemList: item.itemList
      })}
    }>
        <Image 
          style={styles.postImage}
          source={{uri: item.postImg}}
        />
      </TouchableOpacity>        
  );
    
    //const {user, logout} = useContext(AuthContext);
    const [deleted, setDeleted] = useState(false);
    const [userData, setUserData] = useState(null);

    const auth = getAuth()
    const user = auth.currentUser

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true);

    const getUser = async() => {
      const userDoc = doc(db, 'users', user.uid)
      const userSnapShot = await getDoc(userDoc)
      setUserData(userSnapShot.data())
    }
  
    

    const fetchPosts = async () => {
        const itemColl = collection(db, 'users', user.uid, 'posts')
        const snapshot = await getCountFromServer(itemColl);
        const numItems = snapshot.data().count + 1
        //const itemRef = doc(db, 'users', user.uid, 'items') it shld be collection instead
        
        try {
          const list = [];
          const querySnapshot = await getDocs(itemColl)
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data())
            list.push(doc.data())
        });

        
          //need to get post from firebase
          setPosts(list);
    
        //   if (loading) {
        //     setLoading(false);
        //   }
    
          console.log('Posts: ', posts);
        } catch (e) {
          console.log(e);
        }
    };

    useEffect(() => {
        getUser();
        fetchPosts();
        navigation.addListener("focus", () => setLoading(!loading));
      }, [navigation, loading]);
    
    const handleDelete = () => {};

    
    
    return (
      <View style={styles.safeContainer}>
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            <Image
                style={styles.userImage}
                source={{uri: userData ? userData.userImg || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' : 'https://img.freepik.com/free-icon/user_318-150866.jpg'}}
            />
            <Text style={styles.username}>
                {userData ? userData.username || "user" : "user"}
            </Text>
            <Text style={styles.aboutUser}>
                {userData ? userData.aboutUser || "no details" : ""} 
            </Text>
            <View style={styles.userButtonWrapper}>
                <TouchableOpacity 
                    style={styles.userButton} 
                    onPress={() => {
                        navigation.navigate('Edit Profile')
                    }}>
                    <Text style={styles.userButtonText}>
                        Edit 
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.userButton} 
                    onPress={() => signOut(auth)}>
                    <Text style={styles.userButtonText}>
                    Logout 
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.postWrapper}>
              <FlatList
                numColumns={2}
                horizontal={false}
                data={posts}
                renderItem={
                  renderPost
                }
              />
      </View>
        </ScrollView>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: 'white',
    },
    container: {
      flex: 1,
      paddingTop: Constants.statusBarHeight,
      backgroundColor: '#ecf0f1',
      padding: 8,
    },
    contentContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    userImage: {
      height: 150,
      width: 150,
      borderRadius: 75,
      marginTop: 15,
    },
    username: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 10,
    },
    aboutUser: {
      fontSize: 12,
      fontWeight: '600',
      colour: 'black',
      textAlign: 'center',
      marginBottom: 10,
    },
    userButtonWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 10,
    },
    userButton: {
      //borderColor: '#20b2aa',
      borderWidth: 2,
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginHorizontal: 5,
      backgroundColor: 'grey',
    },
    userButtonText: {
      color: 'white',
    },
    postWrapper: {
      flex: 1,
      alignItems: 'center',
      marginTop: 20,
    },
    postImage: {
      flex: 1,
      borderWidth: 3,
      borderColor: 'white',
      borderRadius: 9,
      aspectRatio: 1/1,
      width: '70%'
    },
    
  });

export default ProfileScreen