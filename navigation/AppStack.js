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
import ChatScreen from '../screens/ChatScreen';
import HomeScreen from '../screens/HomeScreen';
import OtherProfileScreen from '../screens/OtherProfileScreen';
import OtherShopScreen from '../screens/OtherShopScreen';
import RequestScreen from '../screens/RequestScreen';

import { getAuth } from 'firebase/auth';
import EditPostScreen from '../screens/EditPostScreen';
import ViewRequestScreen from '../screens/ViewRequestScreen';
import LikedPostScreen from '../screens/LikedPostScreen';
const auth = getAuth()
const user = auth.currentUser

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const FeedStack = ({navigation}) => (
  <Stack.Navigator
    //screenOptions={{headerShown: false}}
    >
    <Stack.Screen
      name="Main"
      component={HomeScreen}
      options={{
        headerShown: false,
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
    <Stack.Screen
      name="OtherProfile"
      component={OtherProfileScreen}
      options={{
        headerTitle: 'Profile',
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
      name="OtherShop"
      component={OtherShopScreen}
      options={{
        headerTitle: 'Shop',
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
      name="Request"
      component={RequestScreen}
      options={{
        headerTitle: 'Submit Request',
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
      name="Chat"
      component={ChatScreen}
      options={{
        headerTitle: 'Chat',
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

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      initialParams={{user: user}}
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
      name="ViewRequest"
      component={ViewRequestScreen}
      options={{
        headerTitle: 'View Request',
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
    <Stack.Screen
      name="EditPost"
      component={EditPostScreen}
      options={{
        headerTitle: 'Edit Post',
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
      name="OtherShop"
      component={OtherShopScreen}
      options={{
        headerTitle: 'Shop',
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
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={{
        headerTitle: 'Chat',
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

const LikedPostStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Liked Post"
      component={LikedPostScreen}
      options={{
        headerShown: false,
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
    <Stack.Screen
      name="OtherProfile"
      component={OtherProfileScreen}
      options={{
        headerTitle: 'Profile',
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
      name="OtherShop"
      component={OtherShopScreen}
      options={{
        headerTitle: 'Shop',
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
      name="Request"
      component={RequestScreen}
      options={{
        headerTitle: 'Submit Request',
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
      screenOptions={{
        tabBarActiveTintColor: '#20b2aa',
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
        name="Home"
        component={FeedStack}
        options={{
          // tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <View>
              <Ionicons name="home-outline" color={color} size={size} />
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
      <Tab.Screen
        name="Liked Posts"
        component={LikedPostStack}
        options={{
          // tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <View>
              <Ionicons name="heart-circle-outline" color={color} size={size} />
            </View>
            
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;