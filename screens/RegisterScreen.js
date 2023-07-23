import React, {useContext, useState, useEffect} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View,  TouchableOpacity, SafeAreaView, Image, Platform, Alert } from 'react-native';
//import { Auth } from 'firebase/auth';
//import auth from "@app/firebaseConfig"
//import { AuthContext } from '/navigation/AuthProvider';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';

const logo = require('../assets/logo.png')
const RegisterScreen = ({handleSignUpFunc}) => {
    const [email, setEmail] = useState('')
    const [password, setPassWord] = useState('')
    const [name, setName] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState('')
    const auth = getAuth()
    const handleSignUp = async () => {
        // if (name == '') {
        //     setErrorMessage("Name cannot be empty!")
        //     return Alert.alert(errorMessage)
        // }
        if (email == '') {
            setErrorMessage("Email cannot be empty!")
            return Alert.alert("Email cannot be empty!");
        }
        if (password == '') {
            setErrorMessage("Password cannot be empty!")
            return Alert.alert("Password cannot be empty!")
        }
        //setLoading(true)
        const user = await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            Alert.alert("Registered!")
        })
        .catch((error) => {
            // setErrorMessage(error.message)
            // return Alert.alert(errorMessage)
            let errorMessageTemp;
            if (error.code == 'auth/email-already-in-use') {
                errorMessageTemp ='You already have an account!';
            } else {
                errorMessageTemp = error.message;
            }
            setErrorMessage(errorMessageTemp);
            return Alert.alert(errorMessageTemp)
        })
        
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            
            <ScrollView 
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}>
            <KeyboardAvoidingView
                style={{flex:1}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            >
            <Image 
                style={styles.image}
                source={logo}
            />
            <View style= {styles.inputContainer}>
                {/* <TextInput 
                    placeholder="Name"
                    value={name}
                    onChangeText={text => setName(text)}
                    style={styles.input}
                /> */}
                <TextInput 
                    testID="emailInput"
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput 
                    testID="passwordInput"
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassWord(text)}
                    style={styles.input}
                    secureTextEntry
                />   
            </View>
            </KeyboardAvoidingView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    testID="handleSignUpButton"
                    onPress={handleSignUp}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Register</Text> 
                </TouchableOpacity>
            </View>
            <View style={styles.emptyContainer} />
            </ScrollView>
            
        </SafeAreaView>
        
    )
}

const windowWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
    safeContainer: {
        flex:1,
        
    },
    container: {
        //flex: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
      flex: 1,
      marginTop: 50, 
      alignSelf: 'center',
      width: windowWidth*0.75,
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 15,
    },
    buttonContainer: {
        flex: 1,
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: `#20b2aa`,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginTop: 80,
    }, 
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: 'blue',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
        textAlign: "center",
    },
    buttonOutlineText: {
        color: `#20b2aa`,
        fontWeight: '700',
        fontSize: 16,
    },
    image: {
      marginTop: 100,
      width: 167,
      height: 167,
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    emptyContainer: {
        flex:1, 
    }
})

export default RegisterScreen