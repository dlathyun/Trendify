import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useEffect, useState } from 'react';
//import { Button } from 'react-native-web';
import { db } from './firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

const addTodo = async () => {
  const doc = addDoc(collection(db, 'todos'), {title: 'haha', done: false})
}
import { getAuth, onAuthStateChanged } from "firebase/auth";
import EditProfileScreen from './screens/EditProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack';
import ChatScreen from './screens/ChatScreen';
import LikedPostsScreen from './screens/LikedPostScreen';

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});

const Stack = createStackNavigator()

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Profile"
//           component={ProfileScreen}
//         />
//         <Stack.Screen
//           name="Edit Profile"
//           component={EditProfileScreen}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   )
// }
export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Liked Posts" component={LikedPostsScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};
  // if (user) {
  //   return (
  //     <NavigationContainer>
  //      {/* <AppStack /> */}
  //      <Stack.Navigator>
  //       <Stack.Screen name="chat" component={ChatScreen} />
  //       </Stack.Navigator>
  //     </NavigationContainer>
  //   )
  // } else {
  //   return (
  //     <NavigationContainer>
  //       {/* <AuthStack /> */}
  //     </NavigationContainer>
  //   )
  // }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
