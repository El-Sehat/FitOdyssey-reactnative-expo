import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface ShopItemCardProps {
  image: any;
  price: string;
  title: string;
}

const ShopItemCard: React.FC<ShopItemCardProps> = ({ image, price, title }) => {
  return (
    <View className="overflow-hidden rounded-xl bg-white shadow-sm">
      <Image source={image} className="h-32 w-full" resizeMode="cover" />

      <View className="p-3">
        <Text className="font-medium text-purple-900" numberOfLines={1}>
          {title}
        </Text>

        <View className="mt-1 flex-row items-center justify-between">
          <Text className="font-bold text-gray-800">{price}</Text>

          <TouchableOpacity className="h-8 w-8 items-center justify-center rounded-full bg-purple-800">
            <Feather name="shopping-cart" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ShopItemCard;
