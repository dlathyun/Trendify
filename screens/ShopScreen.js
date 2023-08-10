import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  getCountFromServer,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";

const ShopScreen = ({ navigation }) => {
  const renderPost = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Item", {
          title: item.itemTitle,
          description: item.itemDescription,
          price: item.itemPrice,
          additionalNote: item.itemAdditionalNote,
          img: item.itemImg,
          itemOwner: item.itemOwner,
          itemNum: item.itemNum,
        });
      }}
    >
      <Image
        style={styles.postImage}
        source={{ uri: item.itemImg }}
        resizeMode="cover"
      />
      <Text adjustsFontSizeToFit numberOfLines={2} style={styles.postText}>
        {item.itemTitle}
      </Text>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.postText}>
        {"$" + item.itemPrice}
      </Text>
    </TouchableOpacity>
  );

  const auth = getAuth();
  const user = auth.currentUser;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const itemColl = collection(db, "users", user.uid, "items");
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
    fetchPosts();
    navigation.addListener("focus", () => setLoading(!loading));
  }, [navigation, loading]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Text style={styles.head}>My Shop</Text>
      <View style={styles.optionButtonWrapper}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => {
            navigation.navigate("Add Item");
          }}
        >
          <Text style={styles.optionText}>Add Item</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  safeContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
  },
  head: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  postWrapper: {
    justifyContent: "center",
    flex: 1,
    marginBottom: 10,
    alignSelf: "center",
    alignContent: "center",
  },
  postImage: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    flex: 1,
    width: 125,
    height: 125,
    aspectRatio: 1 / 1,
    marginLeft: 17,
    marginRight: 17,
    marginTop: 5,
  },
  postText: {
    color: "black",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 3,
    fontWeight: 600,
  },
  optionButton: {
    borderColor: "#20b2aa",
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  optionText: {
    textAlign: "center",
    color: "white",
  },
  optionButtonWrapper: {
    marginRight: 10,
    padding: 2,
    alignSelf: "flex-end",
    width: "35%",
    backgroundColor: "#20b2aa",
    marginTop: 5,
    borderRadius: 10,
    marginBottom: 30,
  },
});

export default ShopScreen;
