import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ActivityCardProps {
  username: string;
  timeAgo: string;
  location: string;
  content: string;
  questCount: number;
  setsCount: number;
  xpGained: number;
  likes: number;
  comments: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

const ActivityCard = ({
  username,
  timeAgo,
  location,
  content,
  questCount,
  setsCount,
  xpGained,
  likes,
  comments,
  onLike,
  onComment,
  onShare,
}: ActivityCardProps) => {
  return (
    <View className="-mx-6 w-screen overflow-hidden rounded-t-[3rem] bg-white">
      <View className="mx-6 flex flex-col justify-center">
        <View className="mt-4 flex-row items-center">
          <FontAwesome5 name="user-circle" size={40} color="black" />
          <View className="ml-4 flex flex-col">
            <Text className="text-xl font-bold">{username}</Text>
            <Text className="text-xs text-gray-500">
              {timeAgo} - {location}
            </Text>
          </View>
        </View>
        <Text className="mt-4">{content}</Text>
      </View>

      {/* Statistik */}
      <LinearGradient
        colors={['#391484', '#4A1687', '#591E89']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="mx-6 mt-6 overflow-hidden rounded-[24px] p-4 shadow-md">
        <View className="flex-row items-center justify-between">
          <View className="items-center pl-4">
            <FontAwesome5 name="star" size={22} color="white" />
            <Text className="pt-1 text-sm font-bold tracking-wider text-gray-100 opacity-50">
              QUEST
            </Text>
            <Text className="text-xl font-bold text-white">{questCount}</Text>
          </View>

          <View className="h-12 w-px bg-gray-400 opacity-30" />

          <View className="items-center">
            <Fontisto name="world-o" size={22} color="white" />
            <Text className="pt-1 text-sm font-bold tracking-wider text-gray-100 opacity-50">
              SETS
            </Text>
            <Text className="text-xl font-bold text-white">{setsCount}</Text>
          </View>

          <View className="h-12 w-px bg-gray-400 opacity-30" />

          <View className="items-center pr-4">
            <Text className="text-2xl font-black tracking-widest text-white">XP</Text>
            <Text className="text-sm font-bold tracking-wider text-gray-100 opacity-50">
              DIDAPAT
            </Text>
            <Text className="text-xl font-bold text-white">+{xpGained}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Medals */}
      <View className="mx-10 mt-6 flex-row justify-between gap-4">
        <View className="items-center">
          <FontAwesome5 name="medal" size={24} color="black" />
          <Text className="mt-2 text-sm">Jumlah Kalori </Text>
          <Text className="-mt-1 text-sm">Dibakar</Text>
        </View>
        <View className="items-center">
          <FontAwesome5 name="medal" size={24} color="black" />
          <Text className="mt-2 text-sm">Jumlah Set </Text>
          <Text className="-mt-1 text-sm">Terbanyak</Text>
        </View>
        <View className="items-center">
          <FontAwesome5 name="medal" size={24} color="black" />
          <Text className="mt-2 text-sm">Quest selesai</Text>
        </View>
      </View>

      <View className="mb-4 flex flex-row items-center justify-between pt-8">
        <View className="mx-6 flex flex-row gap-8">
          <TouchableOpacity className="flex flex-row items-center gap-2" onPress={onLike}>
            <AntDesign name="hearto" size={16} color="black" />
            <Text>{likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-row items-center gap-2" onPress={onComment}>
            <FontAwesome name="comment-o" size={16} color="black" />
            <Text>{comments}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="mx-6 flex flex-row items-center gap-2" onPress={onShare}>
          <Feather name="share" size={16} color="black" />
          <Text>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ActivityCard;
