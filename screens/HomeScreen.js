import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, VirtualizedList } from 'react-native';
import { Firestore, doc, getDoc, setDoc, collection, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";


const HomeScreen = ({navigation}) => {
  const [posts, setPosts] = useState([]);

  const [userData, setUserData] = useState(null);

    const auth = getAuth()
    const user = auth.currentUser
    const [loading, setLoading] = useState(true);

    // const getUser = async() => {
    //   const userDoc = doc(db, 'users', user.uid)
    //   const userSnapShot = await getDoc(userDoc)
    //   setUserData(userSnapShot.data())
    // }
    
  
    

    const fetchPosts = async () => {
        const itemColl = collection(db, 'posts', user.uid, 'ownPosts')
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
        //getUser();
        fetchPosts();
        navigation.addListener("focus", () => setLoading(!loading));
      }, [navigation, loading]);
    

      const handleDelete = () => {};
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image style={styles.userImg} source={{ uri: item.userImg }} />
        <Text style={styles.username}>{item.username}</Text>
      </View>

      
      <TouchableOpacity onPress={() => {
      navigation.navigate('Post', {
        caption: item.postCaption,
        image: item.postImg,
        user: item.user,
        itemList: item.itemList
      })}
    }>
      <Image source={{ uri: item.postImg }} style={styles.postImage} />
      </TouchableOpacity>
      <View style={styles.postFooter}>
        <Text style={styles.likes}>{item.likes} likes</Text>
        <Text style={styles.caption}>{'"' + item.postCaption + '"'}</Text>
      </View>
    </View>
  );


  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  userImg: {
    resizeMode: "contain",
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  postContainer: {
    marginBottom: 20,
  },
  postHeader: {
    paddingHorizontal: 10,
    marginBottom: 10,
    flexDirection: "row"
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
  },
  postImage: {
    width: 400,
    height: 400,
    alignSelf: "center",
    borderRadius: 30,
    borderColor: "black",
    borderWidth: 3,

  },
  postFooter: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  likes: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 18,
  },
  caption: {
    fontSize: 18,
    fontWeight: "400",
  },
});

export default HomeScreen;