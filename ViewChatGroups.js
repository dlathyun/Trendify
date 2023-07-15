import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ChatGroupsScreen = () => {
  const navigation = useNavigation();
  const [chatGroups, setChatGroups] = useState([]);

  useEffect(() => {
    const firestore = getFirestore();
    const chatGroupsRef = collection(firestore, 'chatGroups');

    const handleChatGroupPress = (chatGroupId) => {
        navigation.navigate('ChatScreen', { chatGroupId });
    };

    const fetchChatGroups = async () => {
      try {
        const snapshot = await getDocs(chatGroupsRef);
        const groups = snapshot.docs.map((doc) => doc.data());
        setChatGroups(groups);
      } catch (error) {
        console.error('Error fetching chat groups:', error);
      }
    };

    fetchChatGroups();
  }, []);

  return (
    <View>
    {chatGroups.map((group) => (
      <TouchableOpacity
        key={group.id}
        onPress={() => handleChatGroupPress(group.id)}
      >
        <Text>{group.name}</Text>
      </TouchableOpacity>
    ))}
  </View>
  );
};

export default ChatGroupsScreen;
