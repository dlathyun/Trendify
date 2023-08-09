import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import {
  updateDoc,
  doc,
  getDoc,
  getCountFromServer,
  collection,
} from "firebase/firestore";
import { Alert } from "react-native";
import { useEffect } from "react";

let itemList = [];

const EditPostScreen = ({ route, navigation }) => {
  const [caption, setCaption] = useState("");
  const [userData, setUserData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [oriCaption, setOriCaption] = useState("");

  const { postID } = route.params;
  const auth = getAuth();
  const user = auth.currentUser;

  const getUser = async () => {
    const userDoc = doc(db, "users", user.uid);
    const userSnapShot = await getDoc(userDoc);
    setUserData(userSnapShot.data());
  };

  const getOriData = async () => {
    const postRef = doc(db, "wholePosts", postID.toString());
    const postSnapShot = await getDoc(postRef);
    const originalCaption = postSnapShot.data().postCaption;
    const oriItemList = postSnapShot.data().itemList;
    setOriCaption(originalCaption);
    itemList = oriItemList;
  };

  useEffect(() => {
    getUser();
    getOriData();
  });

  const handleEditPost = async () => {
    if (caption == "") {
      setCaption(oriCaption);
    }

    const ownRef = doc(db, "posts", user.uid, "ownPosts", postID.toString());
    await updateDoc(ownRef, {
      postCaption: caption,
      itemList: itemList,
    });

    const postRef = doc(db, "wholePosts", postID.toString());
    await updateDoc(postRef, {
      postCaption: caption,
      itemList: itemList,
    });

    if (caption == "") {
      setErrorMessage("Caption cannot be empty!");
      return Alert.alert(errorMessage);
    }
    if (itemList.length == 0) {
      setErrorMessage("Item list cannot be empty!");
      return Alert.alert(errorMessage);
    }

    setCaption("");
    itemList.length = 0;

    Alert.alert("Post edited!");
    navigation.goBack();
  };

  const [item, setItem] = useState("");
  const [link, setLink] = useState("");

  const handleAddItem = async () => {
    itemList.push({ itemType: item, itemLink: link });
    setItem("");
    setLink("");
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={styles.inputContainer}>
            <View style={styles.indivContainer}>
              <Text style={styles.optionText}>Caption</Text>
              <TextInput
                placeholder={oriCaption}
                value={caption}
                onChangeText={(text) => setCaption(text)}
                style={styles.inputText}
              />
            </View>
            <View style={styles.indivContainer}>
              <Text style={styles.optionText}>Links for items (if any)</Text>
              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>Item type:</Text>
                <TextInput
                  placeholder="Enter here"
                  value={item}
                  onChangeText={(text) => setItem(text)}
                  style={styles.inputLink}
                />
              </View>

              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>Item link:</Text>
                <TextInput
                  placeholder="Enter here"
                  value={link}
                  onChangeText={(text) => setLink(text)}
                  style={styles.inputLink}
                />
              </View>
            </View>
            <View style={styles.indivContainer}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.addContainer}
                onPress={handleAddItem}
              >
                <Text style={styles.addText}>Add Item</Text>
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
                onPress={handleEditPost}
              >
                <Text style={styles.uploadText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  inputContainer: {
    flex: 1,
    marginTop: 20,
    width: "80%",
    alignSelf: "center",
  },
  indivContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  uploadContainer: {
    width: "100%",
    backgroundColor: "#20b2aa",
    padding: 8,
    marginTop: 5,
    borderRadius: 10,
    marginBottom: 15,
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  linkText: {
    fontWeight: "500",
  },
  submitContainer: {
    width: "65%",
    backgroundColor: "#20b2aa",
    padding: 8,
    marginTop: 5,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  addContainer: {
    width: "35%",
    backgroundColor: "grey",
    padding: 8,
    marginTop: 5,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  addText: {
    color: `white`,
    fontWeight: "500",
    fontSize: 13,
  },
  inputText: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  inputLink: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    marginLeft: 15,
    width: "80%",
  },
  optionText: {
    color: "#20b2aa",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "left",
  },
  uploadText: {
    color: `white`,
    fontWeight: "700",
    fontSize: 16,
    alignSelf: "center",
  },
  addedItemText: {
    fontWeight: "500",
    fontSize: 16,
    alignSelf: "center",
  },
});

export default EditPostScreen;
