import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

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
  imageUrl?: string;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  username,
  timeAgo,
  location,
  content,
  questCount,
  setsCount,
  xpGained,
  likes,
  comments,
  imageUrl,
  onLike,
  onComment,
  onShare,
}) => {
  return (
    <View className="overflow-hidden rounded-2xl bg-white shadow-md">
      {/* User info header */}
      <View className="border-b border-gray-100 p-4">
        <View className="flex-row items-center">
          <FontAwesome5 name="user-circle" size={40} color="#9333EA" />
          <View className="ml-3 flex-1">
            <Text className="text-lg font-bold">{username}</Text>
            <View className="flex-row items-center">
              <Text className="text-sm text-gray-500">{timeAgo}</Text>
              <Text className="mx-1 text-sm text-gray-400">•</Text>
              <Text className="text-sm text-gray-500">{location}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Post content */}
      <View className="p-4">
        <Text className="mb-4 text-gray-700">{content}</Text>

        {/* Image if available */}
        {imageUrl && (
          <View className="mb-4 overflow-hidden rounded-xl">
            <Image source={{ uri: imageUrl }} className="h-48 w-full" resizeMode="cover" />
          </View>
        )}

        {/* Stats */}
        <View className="mb-4 flex-row justify-between rounded-xl bg-gray-50 p-3">
          <View className="items-center">
            <Text className="text-xs text-gray-500">Quest</Text>
            <Text className="text-lg font-bold text-purple-900">{questCount}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-500">Sets</Text>
            <Text className="text-lg font-bold text-purple-900">{setsCount}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-500">XP Gained</Text>
            <Text className="text-lg font-bold text-purple-900">{xpGained}</Text>
          </View>
        </View>

        {/* Interaction buttons */}
        <View className="flex-row justify-between border-t border-gray-100 pt-3">
          <TouchableOpacity className="flex-row items-center" onPress={onLike}>
            <FontAwesome5 name="heart" size={16} color="#9333EA" solid />
            <Text className="ml-2 text-gray-600">{likes} Likes</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center" onPress={onComment}>
            <FontAwesome5 name="comment" size={16} color="#9333EA" />
            <Text className="ml-2 text-gray-600">{comments} Comments</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center" onPress={onShare}>
            <FontAwesome5 name="share" size={16} color="#9333EA" />
            <Text className="ml-2 text-gray-600">Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ActivityCard;
