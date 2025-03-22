import { FontAwesome5, Fontisto, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '~/context/AuthContext';

type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
  MapQuest: undefined;
  Profile: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const { user, logout, isLoading } = useAuth();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const screenWidth = Dimensions.get('window').width;
  const iconProfileSize = screenWidth * 0.25;

  const [localLoading, setLocalLoading] = useState(false);

  const handleLogout = async () => {
    console.log('Logout button pressed');

    try {
      setLocalLoading(true);
      console.log('Logging out...');
      await logout();
      console.log('Logout successful, resetting navigation');

      navigation.reset({
        index: 0,
        routes: [{ name: 'SplashScreen' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Failed', 'There was an error logging out. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  if (isLoading || !user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#9333EA" />
        <Text className="mt-4 text-purple-800">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 rounded-3xl bg-purple-900 p-4 pt-20">
        {/* Avatar */}
        <View className="absolute inset-0 z-10 items-center pt-[3.5em]">
          <View className="border-3 h-32 w-32 items-center justify-center rounded-full border border-purple-900 bg-purple-900">
            <FontAwesome5 name="user-circle" size={iconProfileSize} color="white" />
          </View>
        </View>

        {/* Main content container */}
        <View className="mx-4 flex-1 flex-col rounded-3xl bg-white">
          {/* Profile info */}
          <View className="flex h-[25%] w-full items-center justify-end">
            <View className="relative flex flex-row justify-center gap-2">
              <Text className="items-center justify-center text-2xl font-extrabold text-black">
                {user.name}
              </Text>
              <FontAwesome5
                name="pen"
                size={iconProfileSize * 0.15}
                color="purple"
                className="absolute -right-6"
              />
            </View>

            <Text className="whitespace-normal px-10 text-center font-medium leading-relaxed text-gray-400">
              {user.email}
            </Text>
          </View>

          {/* Stats section */}
          <View className="mx-6 mt-6 flex-row items-center justify-between rounded-[3rem] border bg-purple-800 p-4 py-2 text-white">
            <View className="items-center pl-4">
              <FontAwesome5 name="star" size={22} color="white" />
              <Text className="text-sm font-bold tracking-wider text-gray-100 opacity-50">
                QUEST
              </Text>
              <Text className="text-xl font-bold text-white">0</Text>
            </View>

            <View className="h-12 w-px bg-gray-400 opacity-30" />

            <View className="items-center">
              <Fontisto name="world-o" size={22} color="white" />
              <Text className="text-sm font-bold tracking-wider text-gray-100 opacity-50">
                TEMAN
              </Text>
              <Text className="text-whited text-xl font-bold text-white">0</Text>
            </View>

            <View className="h-12 w-px bg-gray-400 opacity-30" />
            <View className="-mb-3 items-center pr-4">
              <Text className="text-xl font-black tracking-widest text-white">LEVEL</Text>
              <Text className="pt-1 text-xl font-bold text-white">{user.level || 0}</Text>
            </View>
          </View>

          {/* User stats */}
          <View className="mx-6 mt-6">
            <Text className="mb-2 text-lg font-bold">Statistics</Text>
            <View className="rounded-xl bg-gray-100 p-4">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Experience Points</Text>
                <Text className="font-bold">{user.exp || 0} XP</Text>
              </View>
            </View>
          </View>

          {/* Logout */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
              disabled={localLoading}>
              {localLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={styles.logoutContent}>
                  <AntDesign name="logout" size={20} color="white" />
                  <Text style={styles.logoutText}>Logout</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logoutContainer: {
    marginHorizontal: 24,
    marginBottom: 32,
    marginTop: 'auto',
    zIndex: 20,
  },
  logoutButton: {
    backgroundColor: '#9333EA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ProfileScreen;
