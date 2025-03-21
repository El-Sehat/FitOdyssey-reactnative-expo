import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import TabNavigator from './TabNavigator';

import LoginScreen from '~/screens/LoginScreen';
import MapQuestScreen from '~/screens/MapQuestScreen';
import RegisterScreen from '~/screens/RegisterScreen';
import SplashScreen from '~/screens/SplashScreen';

export type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
  MapQuest: undefined; // Add MapQuest to root stack
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainApp" component={TabNavigator} />
        <Stack.Screen name="MapQuest" component={MapQuestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
