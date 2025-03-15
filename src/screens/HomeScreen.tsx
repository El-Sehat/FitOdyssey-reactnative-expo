import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  // ...existing code...
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView className="flex-1">
        <View className="px-6 mt-6">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-lg text-gray-500">Hello Vincent!</Text>
              <Text className="text-2xl font-bold">7, Maret 2025</Text>
            </View>
            <TouchableOpacity>
              <Image 
                source={require('assets/back_arrow.png')} 
                className="w-8 h-8"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Quest Hari Ini */}
          <View className="mt-6 bg-purple-800 rounded-xl p-4">
            <Text className="text-white text-lg font-bold">Quest Hari Ini!</Text>
            <Text className="text-white mt-1">Maret, 2025</Text>
            <View className="mt-4 bg-white rounded-xl p-4">
              <Text className="text-purple-800 text-lg font-bold">14 Maret 2025</Text>
              <Text className="text-purple-800 mt-1">Pull up x20</Text>
              <Text className="text-gray-500 mt-1">Workout 1 dari 5</Text>
              <Text className="text-purple-800 mt-4">Selanjutnya</Text>
              <Text className="text-gray-500">Push Up</Text>
            </View>
          </View>

          {/* Aktivitas Terkini */}
          <View className="mt-6">
            <Text className="text-lg font-bold">Aktivitas Terkini</Text>
            <View className="mt-4 flex-row items-center">
              {/* <Image 
                source={require('assets/user_avatar.png')} 
                className="w-10 h-10 rounded-full"
                resizeMode="contain"
              /> */}
              <View className="ml-4">
                <Text className="font-bold">Deddy Cahyadi</Text>
                <Text className="text-gray-500">2 Hari Lalu, 15.00 PM - Srengseng Sawah, Jakarta Selatan</Text>
                <Text className="mt-2">Morning WO!!! Proud of myself!!</Text>
              </View>
            </View>
          </View>

          {/* Statistik */}
          <View className="mt-6 flex-row justify-between">
            <View className="items-center">
              <Text className="text-lg font-bold">QUEST</Text>
              <Text className="text-2xl font-bold">5</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold">SETS</Text>
              <Text className="text-2xl font-bold">25</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold">XP DIDAPAT</Text>
              <Text className="text-2xl font-bold">+2500</Text>
            </View>
          </View>

          {/* Medals */}
          <View className="mt-6 flex-row justify-between">
            <View className="items-center">
              {/* <Image 
                source={require('assets/medal_icon.png')} 
                className="w-10 h-10"
                resizeMode="contain"
              /> */}
              <Text className="mt-2">Jumlah Kalori Dibakar</Text>
            </View>
            <View className="items-center">
              {/* <Image 
                source={require('assets/medal_icon.png')} 
                className="w-10 h-10"
                resizeMode="contain"
              /> */}
              <Text className="mt-2">Jumlah Set Terbanyak</Text>
            </View>
            <View className="items-center">
              {/* <Image 
                source={require('assets/medal_icon.png')} 
                className="w-10 h-10"
                resizeMode="contain"
              /> */}
              <Text className="mt-2">Quest selesai</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-around items-center py-4 bg-white border-t border-gray-200">
        <TouchableOpacity>
          <Text className="text-purple-800 font-bold">Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-gray-500">Quest</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-gray-500">Aktivitas</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-gray-500">Shop</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
