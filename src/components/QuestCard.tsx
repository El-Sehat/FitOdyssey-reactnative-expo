import { LinearGradient } from 'expo-linear-gradient';
import { View, Text } from 'react-native';

interface QuestCardProps {
  date: string;
  title: string;
  description: string;
  nextWorkout: string;
}

const QuestCard: React.FC<QuestCardProps> = ({ date, title, description, nextWorkout }) => {
  return (
    <LinearGradient colors={['#391484', '#591E89']} className="mt-6 rounded-[5rem] p-4">
      <Text className="text-lg font-bold text-white">Quest Hari Ini!</Text>
      <Text className="mt-1 text-white">Maret, 2025</Text>
      <View className="mt-4 rounded-xl bg-white p-4">
        <Text className="text-lg font-bold text-purple-800">{date}</Text>
        <Text className="mt-1 text-purple-800">{title}</Text>
        <Text className="mt-1 text-gray-500">{description}</Text>
        <Text className="mt-4 text-purple-800">Selanjutnya</Text>
        <Text className="text-gray-500">{nextWorkout}</Text>
      </View>
    </LinearGradient>
  );
};

export default QuestCard;
