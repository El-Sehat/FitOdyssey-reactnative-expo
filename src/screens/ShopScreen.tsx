import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { View, Text, SafeAreaView, ScrollView, StatusBar } from 'react-native';

import ShopItemCard from '~/components/ShopItemCard';
import { useAuth } from '~/context/AuthContext';

const dummyData = [
  {
    image: require('assets/bg-splashscreen.png'),
    price: 'Rp9,900',
    title: 'Stiker Pack #134',
  },
];

const ShopScreen = () => {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView className="flex-1">
        <View className="mt-6 px-6">
          {/* User Info */}
          {user && (
            <View className="mb-4 rounded-lg bg-purple-100 p-3">
              <Text className="text-center text-purple-800">
                {user.name} • {user.exp} XP Available
              </Text>
            </View>
          )}

          {/* Search Bar */}
          <View className="flex-row items-center rounded-full bg-gray-200 p-3">
            <AntDesign name="search1" size={24} color="black" />
            <Text className="ml-2 text-gray-500">Ingin Sesuatu?</Text>
          </View>

          {/* Kategori */}
          <View className="mt-6 flex-row justify-between">
            <Text className="text-lg font-bold">Populer</Text>
            <Text className="text-lg font-bold">Murah Meriah</Text>
            <Text className="text-lg font-bold">Stiker</Text>
            <Text className="text-lg font-bold">Avatar</Text>
          </View>

          {/* Barang */}
          <View className="mt-6 flex-row flex-wrap justify-between">
            {dummyData.map((item, index) => (
              <ShopItemCard key={index} image={item.image} price={item.price} title={item.title} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShopScreen;
