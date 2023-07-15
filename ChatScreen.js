// import React, {
//     useState,
//     useEffect,
//     useLayoutEffect,
//     useCallback
//   } from 'react';
//   import { TouchableOpacity, Text } from 'react-native';
//   import { GiftedChat } from 'react-native-gifted-chat';
//   import {
//     collection,
//     addDoc,
//     orderBy,
//     query,
//     onSnapshot
//   } from 'firebase/firestore';
//   import { auth, db } from '../firebaseConfig';
//   import { useNavigation } from '@react-navigation/native';



//   export default function Chat() {

//     const [messages, setMessages] = useState([]);
//     const navigation = useNavigation();
    
//     useLayoutEffect(() => {

//         const collectionRef = collection(db, 'chats');
//         const q = query(collectionRef, orderBy('createdAt', 'desc'));

//     const unsubscribe = onSnapshot(q, querySnapshot => {
//         console.log('querySnapshot unsusbscribe');
//           setMessages(
//             querySnapshot.docs.map(doc => ({
//               _id: doc.data()._id,
//               createdAt: doc.data().createdAt.toDate(),
//               text: doc.data().text,
//               user: doc.data().user
//             }))
//           );
//         });
//     return unsubscribe;
//       }, []);

//     const onSend = useCallback((messages = []) => {
//         setMessages(previousMessages =>
//           GiftedChat.append(previousMessages, messages)
//         );
//         const { _id, createdAt, text, user } = messages[0];    
//         addDoc(collection(db, 'chats'), {
//           _id,
//           createdAt,
//           text,
//           user
//         });
//       }, []);

//       return (
//         <GiftedChat
//           messages={messages}
//           showAvatarForEveryMessage={false}
//           showUserAvatar={false}
//           onSend={messages => onSend(messages)}
//           messagesContainerStyle={{
//             backgroundColor: '#fff',
//           }}
//           textInputStyle={{
//             backgroundColor: '#fff',
//             borderRadius: 20,
//             fontSize: 17
//           }}
//           user={{
//             _id: auth?.currentUser?.email,
//             avatar: 'https://i.pravatar.cc/300'
//           }}
//         />
//       );
// }

import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback
  } from 'react';
  import { TouchableOpacity, Text } from 'react-native';
  import { GiftedChat } from 'react-native-gifted-chat';
  import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot
  } from 'firebase/firestore';
  import { auth, db } from '../firebaseConfig';
  import { useNavigation } from '@react-navigation/native';

  const Chat = ({ route }) => {
    const { chatGroupId } = route.params;
    const [messages, setMessages] = useState([]);
  
    useEffect(() => {
      const firestore = getFirestore();
      const chatGroupRef = collection(firestore, 'chatGroups', chatGroupId, 'messages');
      const messagesQuery = query(chatGroupRef, orderBy('createdAt', 'desc'));
  
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const updatedMessages = snapshot.docs.map((doc) => doc.data());
        setMessages(updatedMessages);
      });
  
      return unsubscribe;
    }, [chatGroupId]);
  
    const onSend = async (newMessages) => {
      const [message] = newMessages;
      const { _id, createdAt, text, user } = message;
  
      try {
        const auth = getAuth();
        const firestore = getFirestore();
        await addDoc(collection(firestore, 'chatGroups', chatGroupId, 'messages'), {
          _id,
          createdAt,
          text,
          user,
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };
  
    return (
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: getAuth().currentUser.uid,
        }}
      />
    );
  };
  
  export default Chat;