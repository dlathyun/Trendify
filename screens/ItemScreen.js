import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { Constants } from "expo-constants"
import { SafeAreaView } from "react-native-safe-area-context";

const ItemScreen = ({route}) => {
    const { title, description, price, additionalNote, img, user } = route.params;
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
                    onPress={()=>{}}>
                    <Text style={styles.uploadText}>
                        Chat & Buy!
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
    },
})

export default ItemScreen