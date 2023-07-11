import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native"
import { Constants } from "expo-constants"
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

const PostScreen = ({route}) => {
    const { caption, image, user, itemList } = route.params;
    const [userData, setUserData] = useState('')
    
    const getUser = async() => {
        const userDoc = doc(db, 'users', user)
        const userSnapShot = await getDoc(userDoc)
        setUserData(userSnapShot.data())
    }
    useEffect(() => {
        getUser();
      });
    
    

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
                        {userData.username + ": " + '"' + caption + '"'}
                </Text>
            </View>
            <View style={styles.indivContainer}>
                <FlatList
                    data={itemList}
                    renderItem={({item}) => 
                    <Text style={styles.addedItemText}>
                        {item.itemType + " - " + item.itemLink}
                    </Text>}
                />
            </View>
            <View style={styles.indivContainer}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.submitContainer}
                    onPress={()=>{}}>
                    <Text style={styles.uploadText}>
                        Request to add your link!
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
    submitContainer: {
        width: '53%',
        backgroundColor: 'grey',
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
        alignSelf: "center"
    },
    addedItemText: {
        fontWeight: '400',
        fontSize: 22,
        alignSelf: "center"
    },
})

export default PostScreen