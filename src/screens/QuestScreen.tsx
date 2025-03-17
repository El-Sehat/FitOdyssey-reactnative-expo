import { Entypo } from '@expo/vector-icons';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuestCard from '~/components/QuestCard'; // Import QuestCard component
import TodayQuestCard from '~/components/TodayQuestCard'; // Import TodayQuestCard component

const QuestScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="mt-6 px-6">
          {/* Quest Hari Ini */}
          <View className="flex flex-row justify-between pt-4">
            <Text className="text-2xl font-extrabold text-black">Quest Hari Ini!</Text>
            <Entypo name="dots-two-vertical" size={24} color="gray" />
          </View>
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
            quest="12"
            sets="20"
            xp="+1000"
          />
          <QuestCard
            date="1 Maret 2025 - 14 Maret 2025"
            title="Push Pull Legs"
            description="12 Workout, Full Body Workout"
            quest="12"
            sets="20"
            xp="+5000"
          />
          <QuestCard
            date="1 Maret 2025 - 14 Maret 2025"
            title="Push Pull Legs"
            description="12 Workout, Full Body Workout"
            quest="2"
            sets="1"
            xp="+5000"
          />
          <QuestCard
            date="1 Maret 2025 - 14 Maret 2025"
            title="Push Pull Legs"
            description="12 Workout, Full Body Workout"
            quest="5"
            sets="8"
            xp="+5000"
          />
          <QuestCard
            date="1 Maret 2025 - 14 Maret 2025"
            title="Push Pull Legs"
            description="12 Workout, Full Body Workout"
            quest="2"
            sets="10"
            xp="+5000"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestScreen;
