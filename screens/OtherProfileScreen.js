import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Constants from "expo-constants";
import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const OtherProfileScreen = ({ navigation, route }) => {
  const renderPost = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Post", {
          caption: item.postCaption,
          image: item.postImgURL,
          user: item.user,
          itemList: item.itemList,
          username: item.username,
          userImgURL: item.userImgURL,
          postNum: item.postNum,
          likesNum: item.likesNum,
          liked: item.liked,
        });
      }}
    >
      <Image style={styles.postImage} source={{ uri: item.postImgURL }} />
    </TouchableOpacity>
  );

  const [deleted, setDeleted] = useState(false);
  const [userData, setUserData] = useState(null);

  const auth = getAuth();
  const { user } = route.params;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    const userDoc = doc(db, "users", user);
    const userSnapShot = await getDoc(userDoc);
    setUserData(userSnapShot.data());
  };

  const fetchPosts = async () => {
    const itemColl = collection(db, "posts", user, "ownPosts");
    const snapshot = await getCountFromServer(itemColl);
    const numItems = snapshot.data().count + 1;

    try {
      const list = [];
      const querySnapshot = await getDocs(itemColl);
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });

      setPosts(list);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUser();
    fetchPosts();
    navigation.addListener("focus", () => setLoading(!loading));
  }, [navigation, loading]);

  return (
    <View style={styles.safeContainer}>
      <View style={styles.contentContainer}>
        <Image
          style={styles.userImage}
          source={{
            uri: userData
              ? userData.userImgURL ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              : "https://img.freepik.com/free-icon/user_318-150866.jpg",
          }}
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
              navigation.navigate("OtherShop", {
                user: user,
              });
            }}
          >
            <Text style={styles.userButtonText}>View My Shop!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userButton}
            onPress={() => {
              {
                navigation.navigate("Chat");
              }
            }}
          >
            <Text style={styles.userButtonText}>Chat with me!</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.postWrapper}>
          <FlatList
            numColumns={2}
            horizontal={false}
            data={posts}
            renderItem={renderPost}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
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
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: "600",
    colour: "black",
    textAlign: "center",
    marginBottom: 10,
  },
  userButtonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  userButton: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    backgroundColor: "#b0c4de",
  },
  userButtonText: {
    color: "black",
  },
  postWrapper: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  postImage: {
    flex: 1,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 9,
    aspectRatio: 1 / 1,
    width: "70%",
  },
});

export default OtherProfileScreen;
