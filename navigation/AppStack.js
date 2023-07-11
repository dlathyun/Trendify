import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Button } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';



import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AddItemScreen from '../screens/AddItemScreen';
import ShopScreen from '../screens/ShopScreen';
import ItemScreen from '../screens/ItemScreen';
import AddPostScreen from '../screens/AddPostScreen';
import PostScreen from '../screens/PostScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// const FeedStack = ({navigation}) => (
//   <Stack.Navigator>
//     <Stack.Screen
//       name="Trendify"
//       component={HomeScreen}
//       options={{
//         headerTitleAlign: 'center',
//         headerTitleStyle: {
//           color: '#2e64e5',
//           fontFamily: 'Kufam-SemiBoldItalic',
//           fontSize: 18,
//         },
//         headerStyle: {
//           shadowColor: '#fff',
//           elevation: 0,
//         },
//         headerRight: () => (
//           <View style={{marginRight: 10}}>
//             <Button
//               name="plus"
//               size={22}
//               backgroundColor="#fff"
//               color="#2e64e5"
//               onPress={() => navigation.navigate('AddPost')}
//             />
//           </View>
//         ),
//       }}
//     />
//     <Stack.Screen
//       name="Add Post"
//       component={AddPostScreen}
//       options={{
//         title: '',
//         headerTitleAlign: 'center',
//         headerStyle: {
//           backgroundColor: '#2e64e515',
//           shadowColor: '#2e64e515',
//           elevation: 0,
//         },
        
//       }}
//     />
//     <Stack.Screen
//       name="Home Profile"
//       component={ProfileScreen}
//       options={{
//         title: '',
//         headerTitleAlign: 'center',
//         headerStyle: {
//           backgroundColor: '#fff',
//           shadowColor: '#fff',
//           elevation: 0,
//         },
  
//       }}
//     />
//   </Stack.Navigator>
// );

const ProfileStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Edit Profile"
      component={EditProfileScreen}
      options={{
        headerTitle: 'Edit Profile',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
    <Stack.Screen
      name="Post"
      component={PostScreen}
      options={{
        headerTitle: 'Post',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
    {/* <Stack.Screen
      name="Shop Page"
      component={ShopScreen}
      options={{
        headerTitle: 'View My Shop',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    /> */}
  </Stack.Navigator>
);

const ShopStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Shop"
      component={ShopScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Add Item"
      component={AddItemScreen}
      options={{
        headerTitle: 'Add Item',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
    <Stack.Screen
      name="Item"
      component={ItemScreen}
      options={{
        headerTitle: 'Item',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
  </Stack.Navigator>
);

const AppStack = () => {
  const getTabBarVisibility = (route) => {
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : '';
  };

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#20b2aa',
      }}>
      {/* <Tab.Screen
        name="Home"
        component={FeedStack}
        options={({route}) => ({
          tabBarLabel: 'Home',
          // tabBarVisible: route.state && route.state.index === 0,
          tabBarIcon: ({color, size}) => (
            <Icon
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        })}
      /> */}

      <Tab.Screen
        name="Add Post"
        component={AddPostScreen}
        options={{
          // tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <View>
              <Ionicons name="add-circle-outline" color={color} size={size} />
            </View>
            
          ),
        }}
      />
      
      <Tab.Screen
        name="My Profile"
        component={ProfileStack}
        options={{
          // tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <View>
              <Ionicons name="person-outline" color={color} size={size} />
            </View>
            
          ),
        }}
      />
      <Tab.Screen
        name="My Shop"
        component={ShopStack}
        options={{
          // tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <View>
              <Ionicons name="pricetag-outline" color={color} size={size} />
            </View>
            
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;