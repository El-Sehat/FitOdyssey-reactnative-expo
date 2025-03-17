import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TodayQuestCardProps {
  date: string;
  title: string;
  description: string;
  nextWorkout: string;
}

const TodayQuestCard: React.FC<TodayQuestCardProps> = ({ date, title, description, nextWorkout }) => {
  return (
    <LinearGradient
      colors={['#391484', '#591E89']}
      className="mt-6 rounded-[5rem] p-4"
    >
      <Text className="text-white text-lg font-bold">Quest Hari Ini!</Text>
      <Text className="text-white mt-1">Maret, 2025</Text>
      <View className="mt-4 bg-white rounded-xl p-4">
        <Text className="text-purple-900 text-lg font-bold">{date}</Text>
        <Text className="text-purple-900 mt-1">{title}</Text>
        <Text className="text-gray-500 mt-1">{description}</Text>
        <Text className="text-purple-900 mt-4">Selanjutnya</Text>
        <Text className="text-gray-500">{nextWorkout}</Text>
      </View>
    </LinearGradient>
  );
};

export default TodayQuestCard;
