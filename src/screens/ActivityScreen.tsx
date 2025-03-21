import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { View, Text, SafeAreaView, ScrollView, StatusBar } from 'react-native';

import ActivityCard from '~/components/ActivityCard';

const activities = [
  {
    id: '1',
    username: 'Vincent',
    timeAgo: '1 Hari Lalu, 08.30 AM',
    location: 'Kemang, Jakarta Selatan',
    content: 'Early morning workout completed! 💪 Starting the day with energy.',
    questCount: 3,
    setsCount: 15,
    xpGained: 1500,
    likes: 87,
    comments: 12,
  },
  {
    id: '2',
    username: 'Vincent',
    timeAgo: '3 Hari Lalu, 16:45 PM',
    location: 'Fitness Center Jakarta',
    content: 'Hit a new personal best on deadlifts today. So proud of my progress!',
    questCount: 4,
    setsCount: 20,
    xpGained: 2000,
    likes: 134,
    comments: 28,
  },
  {
    id: '3',
    username: 'Vincent',
    timeAgo: '1 Minggu Lalu, 10.15 AM',
    location: 'Taman Menteng',
    content: 'Weekend run with friends. Great way to stay active and social!',
    questCount: 2,
    setsCount: 12,
    xpGained: 1200,
    likes: 76,
    comments: 8,
  },
];

const ActivityScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar translucent backgroundColor="transparent" />

      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <View className="flex-1" />
        <Text className="flex-1 text-center text-xl font-bold">Aktivitasku</Text>
        <View className="flex-1 items-end">
          <AntDesign name="filter" size={24} color="black" />
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 pb-6">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <View key={activity.id} className="mt-4">
                <ActivityCard
                  username={activity.username}
                  timeAgo={activity.timeAgo}
                  location={activity.location}
                  content={activity.content}
                  questCount={activity.questCount}
                  setsCount={activity.setsCount}
                  xpGained={activity.xpGained}
                  likes={activity.likes}
                  comments={activity.comments}
                  onLike={() => console.log(`Like pressed for activity ${activity.id}`)}
                  onComment={() => console.log(`Comment pressed for activity ${activity.id}`)}
                  onShare={() => console.log(`Share pressed for activity ${activity.id}`)}
                />
              </View>
            ))
          ) : (
            <View className="flex-1 items-center justify-center p-8">
              <Text className="text-center text-lg text-gray-500">
                Kamu belum memiliki aktivitas. Mulai workout sekarang!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivityScreen;
