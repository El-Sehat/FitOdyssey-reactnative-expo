import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

interface TodayQuestCardProps {
  date: string;
  title: string;
  description: string;
  nextWorkout: string;
}

const TodayQuestCard: React.FC<TodayQuestCardProps> = ({
  date,
  title,
  description,
  nextWorkout,
}) => {
  return (
    <View className="mt-6 rounded-xl bg-purple-800 px-8 py-6">
      <View className="flex-row gap-6 pb-4">
        <View className="h-16 w-16 items-center justify-center rounded-full border-white bg-red-400">
          <MaterialCommunityIcons name="lightning-bolt-outline" size={28} color="white" />
        </View>
        <View className="flex flex-col">
          <Text className="text-gray-200 opacity-80">{date}</Text>
          <Text className="text-2xl font-bold text-white">{title}</Text>
          <Text className="text-gray-200 opacity-80">{description}</Text>
        </View>
      </View>
      <View className="mt-4 flex flex-row items-center gap-6 rounded-xl bg-white p-6 pl-6">
        <FontAwesome5 name="angle-double-right" size={24} color="black" />
        <View className="flex flex-col">
          <Text className="text-sm tracking-wider opacity-40">Selanjutnya</Text>
          <Text className="font-extrabold">{nextWorkout}</Text>
        </View>
      </View>
    </View>
  );
};

export default TodayQuestCard;
