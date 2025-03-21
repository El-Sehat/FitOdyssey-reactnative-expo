import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface ShopItemCardProps {
  image: any;
  price: string;
  title: string;
}

const ShopItemCard: React.FC<ShopItemCardProps> = ({ image, price, title }) => {
  return (
    <View className="m-2 rounded-xl bg-white p-4 shadow-md">
      <Image source={image} className="h-40 w-full rounded-xl" resizeMode="contain" />
      <Text className="mt-2 text-lg font-bold">{price}</Text>
      <Text className="text-gray-500">{title}</Text>
      <TouchableOpacity className="mt-2 items-center rounded-full bg-blue-500 p-2">
        <Text className="text-white">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShopItemCard;
