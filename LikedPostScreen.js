// LikedPostsScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getFirestore, collection, query, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const LikedPostsScreen = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        const firestore = getFirestore();
        const likedPostsRef = collection(firestore, 'users', userId, 'likedPosts');
        const likedPostsQuery = query(likedPostsRef);
  
        const snapshotUnsubscribe = onSnapshot(likedPostsQuery, (snapshot) => {
          const posts = snapshot.docs.map((doc) => doc.data());
          setLikedPosts(posts);
        });
  
        return () => {
          snapshotUnsubscribe();
          unsubscribe();
        };
      }
    });
  }, []);

  return (
    <View>
      {likedPosts.map((post) => (
        <Text key={post.id}>{post.title}</Text>
      ))}
    </View>
  );
};

export default LikedPostsScreen;