import React, { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Alert } from "react-native";
import { Dimensions } from "react-native";

const LoginScreen = ({ navigation }) => {
  const logo = require("../assets/logo1.jpg");
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState("");
  const auth = getAuth();

  const handleSignIn = async () => {
    if (email == "") {
      setErrorMessage("Email cannot be empty!");
      return Alert.alert(errorMessage);
    }
    if (password == "") {
      setErrorMessage("Password cannot be empty!");
      return Alert.alert(errorMessage);
    }
    const user = await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        if (error.code == "auth/user-not-found") {
          Alert.alert("Create an account first!");
        } else if (error.code == "auth/wrong-password") {
          Alert.alert("Wrong password!");
        } else if (error.code == "auth/invalid-email") {
          Alert.alert("Invalid email!");
        } else {
          Alert.alert(error.code);
        }
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Image style={styles.image} source={logo} />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassWord(text)}
              style={styles.input}
              secureTextEntry
            />
          </View>
        </KeyboardAvoidingView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSignIn} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={styles.button}
            testID="LoginButton"
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    //flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    marginTop: 50,
    width: windowWidth * 0.75,
    justifyContent: "center",
    alignSelf: "center",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonContainer: {
    flex: 1,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  button: {
    backgroundColor: `#20b2aa`,
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "blue",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  buttonOutlineText: {
    color: `#20b2aa`,
    fontWeight: "700",
    fontSize: 16,
  },
  image: {
    marginTop: 100,
    width: 167,
    height: 167,
    resizeMode: "contain",
    alignSelf: "center",
  },
  emptyContainer: {
    flex: 1,
  },
});

export default LoginScreen;
