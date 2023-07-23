import React, {useState, useEffect} from 'react';
import {View, Button} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from "../screens/LoginScreen";

import AsyncStorage from 'react-native';


const Stack = createStackNavigator();

const AuthStack = () => {
 

  return (
    <Stack.Navigator initialRouteName={LoginScreen}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        id="registerScreen"
        name="Register"
        component={RegisterScreen}
        options={({navigation}) => ({
          title: '',
          headerStyle: {
            backgroundColor: '#f9fafd',
            shadowColor: '#f9fafd',
            elevation: 0,
          },
          headerLeft: () => (
            <View style={{marginLeft: 10}}>
              <Button 
                id="loginButton"
                title="Back"
                color="#20b2aa"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;