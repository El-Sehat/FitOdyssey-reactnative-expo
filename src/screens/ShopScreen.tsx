import React from 'react';
import { View, Text, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import ShopItemCard from '~/components/ShopItemCard'; // Import ShopItemCard component

const dummyData = [
  {
    image: require('assets/bg-splashscreen.png'),
    price: 'Rp9,900',
    title: 'Stiker Pack #134',
  },

];

const ShopScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView className="flex-1">
        <View className="px-6 mt-6">
          {/* Search Bar */}
          <View className="bg-gray-200 rounded-full p-3 flex-row items-center">
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
              <ShopItemCard
                key={index}
                image={item.image}
                price={item.price}
                title={item.title}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShopScreen;