import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import TabNavigator from './TabNavigator';

import ExerciseScreen from '~/screens/ExerciseScreen';
import FeedCreationScreen from '~/screens/FeedCreationScreen';
import LoginScreen from '~/screens/LoginScreen';
import MapQuestScreen from '~/screens/MapQuestScreen';
import ProfileScreen from '~/screens/ProfileScreen';
import QuestDetailScreen from '~/screens/QuestDetailScreen';
import RegisterScreen from '~/screens/RegisterScreen';
import SplashScreen from '~/screens/SplashScreen';
import { Quest } from '~/services/QuestService';

export type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
  MapQuest: undefined;
  Profile: undefined;
  QuestDetail: {
    quest: Quest;
  };
  Exercise: {
    quest: Quest;
  };
  FeedCreation: {
    questName?: string;
    questExp?: number;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainApp" component={TabNavigator} />
        <Stack.Screen name="MapQuest" component={MapQuestScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="QuestDetail" component={QuestDetailScreen} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} />
        <Stack.Screen name="FeedCreation" component={FeedCreationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
