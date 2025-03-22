import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import StartButton from '~/components/StartButton';
import ActivityScreen from '~/screens/ActivityScreen';
import HomeScreen from '~/screens/HomeScreen';
import MapQuestScreen from '~/screens/MapQuestScreen';
import QuestScreen from '~/screens/QuestScreen';
import ShopScreen from '~/screens/ShopScreen';

type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
  MapQuest: undefined;
  Profile: undefined;
};

export type TabParamList = {
  Beranda: undefined;
  Quest: undefined;
  StartButton: undefined;
  Aktivitas: undefined;
  Shop: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const BottomNavBar = ({ state, descriptors, navigation }: any) => {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#161643',
        borderRadius: 30,
        height: 70,
        marginHorizontal: 10,
        marginBottom: 10,
        alignItems: 'center',
        paddingHorizontal: 15,
        position: 'relative',
      }}>
      {state.routes.map((route: any, index: number) => {
        const label = route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            if (route.name === 'StartButton') {
              rootNavigation.navigate('MapQuest');
            } else {
              navigation.navigate(route.name);
            }
          }
        };

        if (route.name === 'StartButton') {
          return (
            <View key={index} style={{ marginHorizontal: 12 }}>
              <StartButton size={70} onPress={onPress} />
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={index}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={onPress}>
            <Text
              style={{
                color: isFocused ? '#FFFFFF' : '#6B7280',
                fontSize: 14,
                fontWeight: isFocused ? 'bold' : 'normal',
              }}>
              {label}
            </Text>
            {isFocused && (
              <View
                style={{
                  position: 'absolute',
                  bottom: -15,
                  backgroundColor: '#FF3B5F',
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <BottomNavBar {...props} />}>
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Quest" component={QuestScreen} />
      <Tab.Screen name="StartButton" component={MapQuestScreen} />
      <Tab.Screen name="Aktivitas" component={ActivityScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
