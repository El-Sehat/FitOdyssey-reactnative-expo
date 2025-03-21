
import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  SplashScreen: undefined;
};

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SplashScreen'>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar translucent backgroundColor="transparent" />

      {/* Gambar atas */}
      <View className="h-[60%] w-full overflow-hidden">
        <Image
          source={require('assets/bg-splashscreen.png')}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>

      {/* Logo */}
      <View className="mt-[-6rem] flex justify-between px-6 pb-10">
        <View className="mt-5 items-center">
          <View className="mb-4 items-center justify-center rounded-full">
            <Image
              source={require('assets/logo-fitodyssey.png')}
              className="h-32 w-32"
              resizeMode="contain"
            />
          </View>
          <Text className="text-center text-2xl font-bold text-black">Level Up Your Fitness</Text>
        </View>

        {/* Bagian Tombol */}
        <View className="my-[4rem] w-full">
          <TouchableOpacity
            className="mb-3 w-full items-center rounded-xl bg-purple-800 py-4"
            onPress={handleLoginPress}>
            <Text className="text-base font-bold text-white">Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full items-center rounded-xl border border-gray-300 bg-white py-4"
            onPress={handleRegisterPress}>
            <Text className="text-base font-bold text-black">Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
