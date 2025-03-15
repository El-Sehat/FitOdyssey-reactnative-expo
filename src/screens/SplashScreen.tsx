import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your navigation types
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
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      
      {/* Logo */}
      <View className="flex px-6 justify-between pb-10 mt-[-6rem]">
        <View className="items-center mt-5">
          <View className="rounded-full justify-center items-center mb-4">
            <Image 
              source={require('assets/logo-fitodyssey.png')}
              className="w-32 h-32"
              resizeMode="contain"
            />
          </View>
          <Text className="text-2xl text-black font-bold text-center">
            Level Up Your Fitness
          </Text>
        </View>
        
        {/* Bagian Tombol */}
        <View className="w-full my-[4rem]">
          <TouchableOpacity
            className="w-full py-4 rounded-xl items-center mb-3 bg-purple-800"
            onPress={handleLoginPress}
          >
            <Text className="text-base font-bold text-white">Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full py-4 border border-gray-300 rounded-xl items-center bg-white"
            onPress={handleRegisterPress}
          >
            <Text className="text-base font-bold text-black">Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;