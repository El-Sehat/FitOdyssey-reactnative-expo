import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';
import HomeScreen from '~/screens/HomeScreen';
import QuestScreen from '~/screens/QuestScreen';
import ActivityScreen from '~/screens/ActivityScreen';
import ShopScreen from '~/screens/ShopScreen';

const PlayButtonComponent = () => {
  return <View />;
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
        const { options } = descriptors[route.key];
        const label = route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (route.name === 'StartButton') {
          return (
            <TouchableOpacity
              key={index}
              style={{
                width: 70,
                height: 70,
                backgroundColor: '#FF3B5F',
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 12,
                shadowColor: '#FF3B5F',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 8,
              }}
              onPress={onPress}>
              {/* Ini play button ditengah */}
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderTopWidth: 12,
                  borderBottomWidth: 12,
                  borderLeftWidth: 20,
                  borderStyle: 'solid',
                  borderTopColor: 'transparent',
                  borderBottomColor: 'transparent',
                  borderLeftColor: 'white',
                  marginLeft: 5,
                }}
              />
            </TouchableOpacity>
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
      <Tab.Screen name="StartButton" component={PlayButtonComponent} />
      <Tab.Screen name="Aktivitas" component={ActivityScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
