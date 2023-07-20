import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native"
import { Constants } from "expo-constants"
// import { SafeAreaView } from "react-native-safe-area-context";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useEffect, useState } from "react";
// import { ScrollView } from "react-native-gesture-handler";
import { getAuth } from "firebase/auth";
import { Alert } from "react-native";
import { SafeAreaView, ScrollView } from "react-native";

const PostScreen = ({navigation, route}) => {
    const { caption, image, user, itemList, username, userImgURL, postNum, likesNum, liked } = route.params;
    const [userData, setUserData] = useState('')
    
    const getUser = async() => {
        const userDoc = doc(db, 'users', user)
        const userSnapShot = await getDoc(userDoc)
        setUserData(userSnapShot.data())
    }

    useEffect(() => {
        getUser();
      });

    const auth = getAuth()
    const currentUser = auth.currentUser

    const deletePost = () => {
        if (currentUser.uid.toString() != user.toString()) {
            Alert.alert("You don't have permission to delete this post!")
            
        } else {
            const postDoc = doc(db, 'posts', user.toString(), 'ownPosts', postNum.toString())
            deleteDoc(postDoc)
            Alert.alert("Post successfully deleted!")
        }
        return null
    }

    const editPost = () => {
        if (currentUser.uid.toString() != user.toString()) {
            Alert.alert("You don't have permission to edit this post!")
            
        } else {
            navigation.navigate('EditPost', {
                postID: postNum,
            })
        }
        return null
    }

    const requestPost = () => {
        if (currentUser.uid.toString() == user.toString()) {
            Alert.alert("It is your own post!")
            
        } else {
            navigation.navigate('Request', {
                postOwnerUID: user,
                currentUserUID: currentUser.uid,
                postNum: postNum,
            })
        }
        return null
    }
    
    

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView>
            <View style={styles.indivContainer}>
                <Image
                    style={styles.image}
                    source={{uri: image}}
                    resizeMode='cover'
                />
            </View>
            <View style={styles.indivContainer}>
                <Text
                    style={styles.itemText}>
                        {username + ": " + '"' + caption + '"'}
                </Text>
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
                    style={styles.requestContainer}
                    onPress={requestPost}>
                    <Text style={styles.uploadText}>
                        Request to add your link!
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.indivContainer}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.editContainer}
                    onPress={editPost}>
                    <Text style={styles.uploadText}>
                        Edit
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.indivContainer}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.deleteContainer}
                    onPress={deletePost}>
                    <Text style={styles.deleteText}>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
            
            </ScrollView>
        </SafeAreaView>
    
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
      padding: 8,
    },
    safeContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    indivContainer: {
        marginTop: 15, 
        marginBottom: 15,
        alignItems: "center"
    },
    image: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        width: 300,
        height: 400,
        aspectRatio: 3/4,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        alignSelf: "center",
      },
    titleText: {
        color: `black`,
        fontWeight: '800',
        fontSize: 35,
    },
    itemText: {
        color: `black`,
        fontWeight: '600',
        fontSize: 25,
    },
    requestContainer: {
        width: '53%',
        backgroundColor: `#b0e0e6`,
        padding: 8,
        marginTop: 5,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        color: `black`,
        fontWeight: '500',
        fontSize: 16,
        alignSelf: "center"
    },
    deleteText: {
        color: `white`,
        fontWeight: '700',
        fontSize: 16,
        alignSelf: "center"
    },
    addedItemText: {
        fontWeight: '400',
        fontSize: 22,
        alignSelf: "center"
    },
    deleteContainer: {
        width: '53%',
        backgroundColor: 'red',
        padding: 8,
        marginTop: 5,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editContainer: {
        width: '53%',
        backgroundColor: `#d3d3d3`,
        padding: 8,
        marginTop: 5,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default PostScreen