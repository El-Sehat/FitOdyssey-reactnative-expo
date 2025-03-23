import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ShopItemCard from '~/components/ShopItemCard';
import { useAuth } from '~/context/AuthContext';

const dummyData = [
  {
    id: 1,
    image: require('assets/bg-splashscreen.png'),
    price: 'Rp9,900',
    title: 'Stiker Pack #134',
    category: 'sticker',
  },
  {
    id: 2,
    image: require('assets/bg-splashscreen.png'),
    price: 'Rp14,900',
    title: 'Avatar Premium',
    category: 'avatar',
  },
  {
    id: 3,
    image: require('assets/bg-splashscreen.png'),
    price: 'Rp4,900',
    title: 'Badge Collection',
    category: 'badge',
  },
  {
    id: 4,
    image: require('assets/bg-splashscreen.png'),
    price: 'Rp7,900',
    title: 'Theme Purple',
    category: 'theme',
  },
];

type Category = 'all' | 'popular' | 'cheap' | 'sticker' | 'avatar' | 'badge' | 'theme';

const ShopScreen = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchText, setSearchText] = useState('');

  // Filter items based on active category and search text
  const filteredItems = dummyData.filter((item) => {
    // First filter by category
    if (activeCategory === 'all') {
      // When "all" is selected, no category filtering
    } else if (activeCategory === 'popular') {
      // For demo, we'll consider first 2 items as popular
      if (item.id > 2) return false;
    } else if (activeCategory === 'cheap') {
      // For demo, consider items under Rp10,000 as cheap
      if (!item.price.includes('9,900') && !item.price.includes('4,900')) return false;
    } else if (item.category !== activeCategory) {
      return false;
    }

    // filter by search text
    if (searchText && !item.title.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header with balance info */}
      <View className="bg-white px-5 pb-4 pt-3 shadow-sm">
        <Text className="mb-1 text-2xl font-bold text-purple-900">FitOdyssey Shop</Text>
        {user && (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <FontAwesome name="diamond" size={16} color="#9333EA" />
              <Text className="ml-2 font-medium text-purple-700">{user.exp || 0} XP Available</Text>
            </View>
            <TouchableOpacity className="rounded-full bg-purple-100 px-3 py-1">
              <Text className="font-medium text-purple-700">Top Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="px-5 pt-4">
          {/* Search Bar */}
          <View className="mb-5 flex-row items-center overflow-hidden rounded-xl bg-white px-3 py-2 shadow-sm">
            <AntDesign name="search1" size={20} color="#9333EA" />
            <TextInput
              className="ml-2 flex-1 py-1"
              placeholder="Cari item..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#A0A0A0"
            />
            {searchText ? (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Feather name="x" size={20} color="#9333EA" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Category tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1 mb-6">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'popular', label: 'Populer' },
              { id: 'cheap', label: 'Murah' },
              { id: 'sticker', label: 'Stiker' },
              { id: 'avatar', label: 'Avatar' },
              { id: 'badge', label: 'Badge' },
              { id: 'theme', label: 'Theme' },
            ].map((category) => (
              <TouchableOpacity
                key={category.id}
                className={`mx-1 rounded-full px-4 py-2 ${
                  activeCategory === category.id ? 'bg-purple-800' : 'bg-gray-200'
                }`}
                onPress={() => setActiveCategory(category.id as Category)}>
                <Text
                  className={
                    activeCategory === category.id ? 'font-medium text-white' : 'text-gray-700'
                  }>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Shop items grid */}
          {filteredItems.length > 0 ? (
            <View className="flex-row flex-wrap">
              {filteredItems.map((item) => (
                <View key={item.id} className="w-1/2 p-1">
                  <ShopItemCard image={item.image} price={item.price} title={item.title} />
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center justify-center py-10">
              <AntDesign name="shoppingcart" size={48} color="#D1D5DB" />
              <Text className="mt-3 text-center text-gray-400">
                {searchText ? 'No items match your search' : 'No items in this category'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShopScreen;
