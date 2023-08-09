import * as React from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";

const EditProfileScreen = ({ navigation }) => {
  const [imageURI, setImageURI] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const getUser = async () => {
    const userRef = doc(db, "users", user.uid.toString());
    const documentSnapshot = await getDoc(userRef);
    if (documentSnapshot.exists()) {
      console.log("User Data", documentSnapshot.data());
      setUserData(documentSnapshot.data());
      setName(documentSnapshot.data().username);
      setAbout(documentSnapshot.data().aboutUser);
      setImageURI(documentSnapshot.data().userImgURL);
    } else {
      console.log("No such user!");
    }
  };

  const handleUpdate = async () => {
    let imgUrl = await uploadImage(imageURI, user.uid, true);

    if (imgUrl == null && userData.userImgURL) {
      imgUrl = userData.userImgURL;
    }

    await setDoc(doc(db, "users", user.uid), {
      username: name,
      aboutUser: about,
      userImgURI: imageURI,
      userImgURL: imgUrl,
    }).then(() => {
      setName("");
      setAbout("");
      setImageURI(null);

      Alert.alert("Updated Profile!");
      navigation.goBack();
    });
  };

  const uploadImage = async (uri, name, onProgress) => {
    const metadata = {
      contentType: "image/jpeg",
    };
    const storage = getStorage();
    const storageRef = ref(storage, "userImg");
    const fetchResponse = await fetch(uri);
    const theBlob = await fetchResponse.blob();
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const imageRef = ref(storage, `userImg/${filename}`);
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
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const source = { uri: result.assets[0].uri };
      setImageURI(result.assets[0].uri);
    } else {
      alert("Image not selected.");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={styles.inputContainer}>
            <View style={styles.indivContainer}>
              <Text style={styles.optionText}>Upload Profile Photo</Text>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.uploadContainer}
                onPress={pickImageAsync}
              >
                <Text style={styles.uploadText}>Click here to upload!</Text>
              </TouchableOpacity>
              {imageURI && (
                <Image
                  source={{ uri: imageURI }}
                  style={{ width: 200, height: 200 }}
                />
              )}
            </View>
            <View style={styles.indivContainer}>
              <Text style={styles.optionText}>Username</Text>
              <TextInput
                placeholder={name}
                value={name}
                onChangeText={(text) => setName(text)}
                style={styles.inputText}
              />
            </View>
            <View style={styles.indivContainer}>
              <Text style={styles.optionText}>About</Text>
              <TextInput
                placeholder={about}
                value={about}
                onChangeText={(text) => setAbout(text)}
                style={styles.inputText}
              />
            </View>
            <View style={styles.indivContainer}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.submitContainer}
                onPress={handleUpdate}
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
    marginTop: 15,
    marginBottom: 15,
  },
  uploadContainer: {
    width: "65%",
    backgroundColor: "#20b2aa",
    padding: 3,
    marginTop: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  backContainer: {
    width: "20%",
    backgroundColor: "grey",
    padding: 3,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitContainer: {
    width: "35%",
    backgroundColor: "grey",
    padding: 8,
    marginTop: 5,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  inputText: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
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
  },
});

export default EditProfileScreen;
