import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  doc,
  getDoc,
  collection,
  getCountFromServer,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useState } from "react";
import { useEffect } from "react";

const ViewRequestScreen = ({ route, navigation }) => {
  const { userUID } = route.params;
  const [requestList, setRequestList] = useState([]);

  const fetchRequests = async () => {
    const itemColl = collection(db, "users", userUID, "requests");
    const snapshot = await getCountFromServer(itemColl);

    try {
      const list = [];
      const querySnapshot = await getDocs(itemColl);
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setRequestList(list);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchRequests();
  });

  const renderPost = ({ item }) => (
    <SafeAreaView style={styles.safeContainer}>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.indivContainer}>
          <Image
            style={styles.image}
            source={{ uri: item.itemImg }}
            resizeMode="cover"
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.indivContainer}>
            <Text style={styles.titleText}>{"<" + item.itemTitle + ">"}</Text>
          </View>
          <View style={styles.indivContainer}>
            <Text style={styles.itemText}>
              {'"' + item.itemDescription + '"'}
            </Text>
          </View>
          <View style={styles.indivContainer}>
            <Text style={styles.itemText}>{"Price: $" + item.itemPrice}</Text>
          </View>
          {item.itemAdditionalNote && (
            <View style={styles.indivContainer}>
              <Text style={styles.itemText}>
                {"P.S: " + item.itemAdditionalNote}
              </Text>
            </View>
          )}
          <View style={styles.indivContainer}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.addContainer}
              onPress={() => {
                navigation.navigate("EditPost", {
                  postID: item.itemPost,
                });
              }}
            >
              <Text style={styles.uploadText}>Add this item</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.indivContainer}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.shopContainer}
              onPress={() => {
                navigation.navigate("OtherShop", {
                  user: item.itemOwner,
                });
              }}
            >
              <Text style={styles.uploadText}>Owner's shop page</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={requestList}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  indivContainer: {
    marginTop: 5,
    marginBottom: 5,
    alignItems: "center",
  },
  image: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    width: 200,
    height: 200,
    aspectRatio: 1 / 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 2,
    marginBottom: 5,
    alignSelf: "center",
  },
  titleText: {
    color: `black`,
    fontWeight: "500",
    fontSize: 32,
  },
  itemText: {
    color: `black`,
    fontWeight: "400",
    fontSize: 20,
  },
  addContainer: {
    width: "74%",
    backgroundColor: "#b0e0e6",
    padding: 8,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  shopContainer: {
    width: "74%",
    backgroundColor: "#d3d3d3",
    padding: 8,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    color: `black`,
    fontWeight: "700",
    fontSize: 11,
    alignSelf: "center",
  },
});

export default ViewRequestScreen;
