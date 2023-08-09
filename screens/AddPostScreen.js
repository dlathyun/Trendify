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
  Image,
} from "react-native";
import Constants from "expo-constants";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import {
  doc,
  getDoc,
  setDoc,
  getCountFromServer,
  collection,
} from "firebase/firestore";
import { Alert } from "react-native";
import { useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const itemList = [];

const AddPostScreen = ({ navigation }) => {
  const [caption, setCaption] = useState("");
  const [imageURI, setImageURI] = useState("");
  const [userData, setUserData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const auth = getAuth();
  const user = auth.currentUser;

  const getUser = async () => {
    const userDoc = doc(db, "users", user.uid);
    const userSnapShot = await getDoc(userDoc);
    setUserData(userSnapShot.data());
  };

  useEffect(() => {
    getUser();
  });

  const handleAddPost = async () => {
    let imgUrl = await uploadImage(imageURI, "random", true);

    const postColl = collection(db, "wholePosts");
    const postSnapShot = await getCountFromServer(postColl);
    const numPosts = postSnapShot.data().count + 1;
    const itemRef = doc(db, "posts", user.uid, "ownPosts", numPosts.toString());

    await setDoc(itemRef, {
      postCaption: caption,
      postImgURL: imgUrl,
      user: user.uid,
      itemList: itemList,
      username: userData.username,
      userImgURL: userData.userImgURL,
      postNum: numPosts,
      likesNum: 0,
    });

    const postRef = doc(db, "wholePosts", numPosts.toString());
    await setDoc(postRef, {
      postCaption: caption,
      postImgURL: imgUrl,
      user: user.uid,
      itemList: itemList,
      username: userData.username,
      userImgURL: userData.userImgURL,
      postNum: numPosts,
      likesNum: 0,
    });

    if (caption == "") {
      setErrorMessage("Caption cannot be empty!");
      return Alert.alert(errorMessage);
    }

    setCaption("");
    setImageURI("");
    itemList.length = 0;

    Alert.alert("Post uploaded!");
    navigation.goBack();
  };

  const uploadImage = async (uri, name, onProgress) => {
    const metadata = {
      contentType: "image/jpeg",
    };

    const storage = getStorage();
    const fetchResponse = await fetch(uri);
    const theBlob = await fetchResponse.blob();
    const imageRef = ref(storage, `postImg/${uri}`);
    const uploadTask = uploadBytesResumable(imageRef, theBlob, metadata);

    setUploading(true);
    setTransferred(0);

    uploadTask.on("state_changed", (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100
      );
    });

    await uploadTask;

    const url = await getDownloadURL(imageRef);

    setUploading(false);

    return url;
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      aspect: [3, 4],
    });

    if (!result.canceled) {
      //setImage(result.assets[0].uri)
      const source = { uri: result.assets[0].uri };
      setImageURI(result.assets[0].uri);
    } else {
      alert("Image not selected.");
    }
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
      <ScrollView style={{ backgroundColor: "#ecf0f1" }}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={styles.inputContainer}>
            <View style={styles.indivContainer}>
              <Text style={styles.optionText}>Caption</Text>
              <TextInput
                placeholder="Enter here"
                value={caption}
                onChangeText={(text) => setCaption(text)}
                style={styles.inputText}
              />
            </View>
            <View style={styles.indivContainer}>
              <Text style={styles.optionText}>Upload Photo</Text>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.uploadContainer}
                onPress={pickImageAsync}
              >
                <Text style={styles.uploadText}>Upload here!</Text>
              </TouchableOpacity>
              {imageURI && (
                <Image
                  source={{ uri: imageURI }}
                  style={{ width: 300, height: 400 }}
                />
              )}
            </View>
            <View style={styles.indivContainer}>
              <Text style={styles.optionText}>Links for items (if any)</Text>
              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>Item type:</Text>
                <TextInput
                  placeholder="Enter item type"
                  value={item}
                  onChangeText={(text) => setItem(text)}
                  style={styles.inputLink}
                />
              </View>

              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>Item link:</Text>
                <TextInput
                  placeholder="Enter item link"
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
                testID="AddItem"
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
                onPress={handleAddPost}
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
    backgroundColor: "white",
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

export default AddPostScreen;
