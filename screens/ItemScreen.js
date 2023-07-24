import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { Constants } from "expo-constants"
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth } from "firebase/auth";
import { Alert } from "react-native";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ItemScreen = ({route, navigation}) => {
    const auth = getAuth()
    const curUser = auth.currentUser
    const curUserID = curUser?.uid
    const { title, description, price, additionalNote, img, itemOwner, itemNum } = route.params;
    
    const deleteItem = () => {
        if (curUserID.toString() != itemOwner.toString()) {
            Alert.alert("You don't have permission to delete this post!")
            
        } else {
            const itemDoc = doc(db, 'users', itemOwner.toString(), 'items', itemNum.toString())
            
            deleteDoc(itemDoc)
            Alert.alert("Item successfully deleted!")
        }
        navigation.goBack()
        return null
    }

    const handleChat = () => {
        if (curUserID.toString() == itemOwner.toString()) {
            Alert.alert("Are you planning to chat with yourself?")
            
        } else {
            navigation.navigate('Chat')
        }
    }
    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.indivContainer}>
                <Image
                    style={styles.image}
                    source={{uri: img}}
                    resizeMode='cover'
                />
            </View>
            <View style={styles.indivContainer}>
                <Text
                    style={styles.titleText}>
                        {"<" + title + ">"}
                </Text>
            </View>
            <View style={styles.indivContainer}>
                <Text
                    style={styles.itemText}>
                        {'"' + description + '"'}
                </Text>
            </View>
            <View style={styles.indivContainer}>
                <Text
                    style={styles.itemText}>
                        {"Price: $" + price}
                </Text>
            </View>
            {additionalNote && 
                <View style={styles.indivContainer}>
                    <Text
                        style={styles.itemText}>
                        {"P.S: " + additionalNote}
                    </Text>
                </View>
                
            }
            <View style={styles.indivContainer}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.submitContainer}
                    onPress={handleChat}>
                    <Text style={styles.chatText}>
                        Chat & Buy!
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.indivContainer}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.deleteContainer}
                    onPress={deleteItem}>
                    <Text style={styles.uploadText}>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
            
            
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
        width: 200,
        height: 200,
        aspectRatio: 1/1,
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
        fontSize: 23,
    },
    submitContainer: {
        width: '35%',
        backgroundColor: '#b0e0e6',
        padding: 8,
        marginTop: 5,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteContainer: {
        width: '35%',
        backgroundColor: 'red',
        padding: 8,
        marginTop: 5,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        color: `white`,
        fontWeight: '700',
        fontSize: 16,
    },
    chatText: {
        color: `black`,
        fontWeight: '700',
        fontSize: 16,
    },
})

export default ItemScreen