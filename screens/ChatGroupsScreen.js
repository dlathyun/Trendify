import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const ChatGroupsScreen = () => {
  const [chatGroups, setChatGroups] = useState([]);

  useEffect(() => {
    const firestore = getFirestore();
    const chatGroupsRef = collection(firestore, "chatGroups");
    const fetchChatGroups = async () => {
      try {
        const snapshot = await getDocs(chatGroupsRef);
        const groups = snapshot.docs.map((doc) => doc.data());
        setChatGroups(groups);
      } catch (error) {
        console.error("Error fetching chat groups:", error);
      }
    };

    fetchChatGroups();
  }, []);

  return (
    <View>
      {chatGroups.map((group) => (
        <Text key={group.id}>{group.name}</Text>
      ))}
    </View>
  );
};

export default ChatGroupsScreen;
