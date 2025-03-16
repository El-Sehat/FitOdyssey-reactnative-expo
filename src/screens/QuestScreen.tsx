import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import QuestCard from '~/components/QuestCard'; // Import QuestCard component
import TodayQuestCard from '~/components/TodayQuestCard'; // Import TodayQuestCard component

const QuestScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="px-6 mt-6">
          {/* Quest Hari Ini */}
          <TodayQuestCard 
            date="14 Maret 2025"
            title="Pull up x20"
            description="Workout 1 dari 5"
            nextWorkout="Push Up"
          />

          <Text className="mt-6 text-lg font-bold">Quest Lainnya</Text>
          <QuestCard 
            date="1 Maret 2025 - 14 Maret 2025"
            title="Pagi Sehat, Pagi Kuat"
            description="5 Workout, Dada dan Punggung"
            nextWorkout="XP Tersedia: +1000"
          />
          <QuestCard 
            date="1 Maret 2025 - 14 Maret 2025"
            title="Push Pull Legs"
            description="12 Workout, Full Body Workout"
            nextWorkout="XP Tersedia: +5000"
          />
            <QuestCard 
            date="1 Maret 2025 - 14 Maret 2025"
            title="Push Pull Legs"
            description="12 Workout, Full Body Workout"
            nextWorkout="XP Tersedia: +5000"
          />
          <QuestCard 
            date="1 Maret 2025 - 14 Maret 2025"
            title="Push Pull Legs"
            description="12 Workout, Full Body Workout"
            nextWorkout="XP Tersedia: +5000"
          />
          <QuestCard 
            date="1 Maret 2025 - 14 Maret 2025"
            title="Push Pull Legs"
            description="12 Workout, Full Body Workout"
            nextWorkout="XP Tersedia: +5000"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestScreen;