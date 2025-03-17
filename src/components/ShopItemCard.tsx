import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface ShopItemCardProps {
  image: any;
  price: string;
  title: string;
}

const ShopItemCard: React.FC<ShopItemCardProps> = ({ image, price, title }) => {
  return (
    <View className="bg-white rounded-xl p-4 shadow-md m-2">
      <Image 
        source={image} 
        className="w-full h-40 rounded-xl"
        resizeMode="contain"
      />
      <Text className="mt-2 text-lg font-bold">{price}</Text>
      <Text className="text-gray-500">{title}</Text>
      <TouchableOpacity className="mt-2 bg-blue-500 rounded-full p-2 items-center">
        <Text className="text-white">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShopItemCard;
