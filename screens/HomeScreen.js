import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Firestore, doc, getDoc, setDoc, collection, getDocs, getCountFromServer, query, where, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback } from 'react';




const HomeScreen = ({navigation}) => {
  const [posts, setPosts] = useState([]);

  const [userData, setUserData] = useState(null);

  const [likedOr, setLikedOr] = useState(false)

  const [likedList, setLikedList] = useState([])

  //let numLikes = 0

    const auth = getAuth()
    const user = auth.currentUser
    const userUID = user?.uid.toString()
    const [loading, setLoading] = useState(true);
    

    // const getUser = async() => {
    //   const userDoc = doc(db, 'users', user.uid)
    //   const userSnapShot = await getDoc(userDoc)
    //   setUserData(userSnapShot.data())
    // }
    
  
    

    const fetchPosts = async () => {
        try {

          // const wholePosts = query(collectionGroup(db, 'ownPosts'), where('user', '!=', user?.uid.toString()));
          // const querySnapshot = await getDocs(wholePosts);
          const q = query(collection(db, "wholePosts"), where("user", "!=", user?.uid.toString()));
          const querySnapshot = await getDocs(q)
          const list = [];
          querySnapshot.forEach((doc) => {
            //console.log(doc.id, " => ", doc.data())
            list.push(doc.data())
          })

          setPosts(list);
    
          const likedColl = collection(db, 'posts', userUID, 'likedPosts')
          const likedSnapShot = await getDocs(likedColl)
          const lList = []
          likedSnapShot.forEach((doc) => {
            lList.push(doc.data().postNum)
          })

        } catch (e) {
          console.log(e);
        }
    };

    useEffect(() => {
        //getUser();
        fetchPosts();
        navigation.addListener("focus", () => setLoading(!loading));
      }, [navigation, loading]);
  
    // const checkLiked = async({postID, userID}) => {
    //   const querySnapshot = await getDocs(collection(db, 'wholePosts', postID.toString(), 'likes'));
    //   querySnapshot.forEach((doc) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     if (doc.id.toString() == userID) {
    //       return true
    //     }
    //   });
    //   return false
    // }

    const onPressLike = async ({postID, userID}) => {
      const likeRef = doc(db, 'wholePosts', postID.toString(), 'likes', userID)
      setDoc(likeRef, {
      })
      setLikedOr(true)
      const postRef = doc(db, 'wholePosts', postID.toString())
      const postSnapShot = await getDoc(postRef)
      const itemColl = collection(db, 'wholePosts', postID.toString(), 'likes')
      const snapshot = await getCountFromServer(itemColl);
      const numItems = snapshot.data().count
      const ori = postSnapShot.data().likesNum
      //console.log(numItems)
      updateDoc(postRef, {
        likesNum: numItems,
        liked: true
      })
      //numLikes++

      
      const itemRef = doc(db, 'posts', userID, 'likedPosts', postID.toString())
      //console.log(caption)
      await setDoc(itemRef, {
        postNum: postID.toString(),
      })
      likedList.push(postID.toString())
      fetchPosts()
    }
    
    const onPressDislike = async ({postID, userID}) => {
      const likeRef = doc(db, 'wholePosts', postID.toString(), 'likes', userID)
      deleteDoc(likeRef)
      setLikedOr(false)
      const postRef = doc(db, 'wholePosts', postID.toString())
      const postSnapShot = await getDoc(postRef)
      const itemColl = collection(db, 'wholePosts', postID.toString(), 'likes')
      const snapshot = await getCountFromServer(itemColl);
      const numItems = snapshot.data().count
      const ori = postSnapShot.data().likesNum
      updateDoc(postRef, {
        likesNum: numItems,
        liked: false
      })
      //numLikes--

      const postDoc = doc(db, 'posts', userID, 'likedPosts', postID.toString())
      deleteDoc(postDoc)
      fetchPosts()

      let likedListV2 = likedList.filter(x => x != postID.toString())
      setLikedList(likedListV2)
    }

    const checkLiked = ({postID}) => {
      console.log(likedList)
      if (likedList.includes(postID.toString())) {
        return true
      } else {
        return false
      }
    }
    
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      
      <TouchableOpacity onPress={() => {
        navigation.navigate('OtherProfile', {
          user: item.user
        })
      }}>
        <View style={styles.postHeader}>
          <Image style={styles.userImg} source={{ uri: item.userImgURL }} />
          <Text style={styles.username}>{item.username}</Text>
        </View>
      </TouchableOpacity>

      
      <TouchableOpacity onPress={() => {
      navigation.navigate('Post', {
        caption: item.postCaption,
        image: item.postImgURL,
        user: item.user,
        itemList: item.itemList,
        username: item.username,
        userImgURL: item.userImgURL,
        postNum: item.postNum,
        likesNum: item.likesNum,
        liked: item.liked,
      })}
    }>
      <Image source={{ uri: item.postImgURL }} style={styles.postImage} />
      </TouchableOpacity>
      <View style={styles.postFooter}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.likes}>{item.likesNum} like(s)</Text>
          {
            checkLiked({postID: item.postNum})
              ? (<TouchableOpacity onPress={() => onPressDislike({postID: item.postNum, userID: userUID})} style={{marginRight: 10}}>
                  <Ionicons name="heart" color={'red'} size={30} />
                </TouchableOpacity>)
              : (<TouchableOpacity onPress={() => onPressLike({postID: item.postNum, userID: userUID})} style={{marginRight: 10}}>
                  <Ionicons name="heart-outline" color={'black'} size={30} />
                </TouchableOpacity>)
          }
        </View>
        
        <Text style={styles.caption}>{'"' + item.postCaption + '"'}</Text>
      </View>
    </View>
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1285);
  }, []);



  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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