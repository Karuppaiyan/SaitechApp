// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen'
import SearchData from './src/screens/SearchData'
import EditScreen from './src/screens/EditScreens'
import AdditionalHoursScreen from './src/screens/AdditionalHoursScreen'

const Stack = createNativeStackNavigator();
enableScreens(false);

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="Search" component={SearchData}/>
      <Stack.Screen name="EditScreen" component={EditScreen}/>
      <Stack.Screen name="AdditionalHoursScreen" component={AdditionalHoursScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}