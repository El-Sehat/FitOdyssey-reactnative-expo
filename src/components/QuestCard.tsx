import { FontAwesome5, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text } from 'react-native';

interface QuestCardProps {
  date: string;
  title: string;
  description: string;
  quest: string;
  sets: string;
  xp: string;
}

const QuestCard: React.FC<QuestCardProps> = ({ date, title, description, quest, sets, xp }) => {
  return (
    <View className="mt-6 rounded-xl bg-purple-800 px-8 py-6">
      <View className="flex-row justify-between gap-6 pb-4">
        <View className="flex flex-col">
          <Text className="text-gray-200 opacity-80">{date}</Text>
          <Text className="text-2xl font-bold text-white">{title}</Text>
          <Text className="text-gray-200 opacity-80">{description}</Text>
        </View>
        <View className="h-16 w-16 items-center justify-center rounded-full border-white bg-red-400">
          <MaterialCommunityIcons name="lightning-bolt-outline" size={28} color="white" />
        </View>
      </View>
      <View className="mt-6 flex-row items-center justify-between rounded-3xl border  bg-white p-4 py-4 text-black">
        <View className="items-center pl-4">
          <FontAwesome5 name="star" size={22} color="black" />
          <Text className="pt-1 text-sm font-bold tracking-wider text-gray-800 opacity-50">
            QUEST
          </Text>
          <Text className="text-xl font-bold text-black">{quest}</Text>
        </View>

        <View className="h-12 w-px bg-gray-400 opacity-30" />

        <View className="items-center">
          <Fontisto name="world-o" size={22} color="black" />
          <Text className="pt-1 text-sm font-bold tracking-wider text-gray-800 opacity-50">
            SETS
          </Text>
          <Text className="text-whited text-xl font-bold text-black">{sets}</Text>
        </View>

        <View className="h-12 w-px bg-gray-400 opacity-30" />

        <View className="items-center pr-4">
          <Text className="text-2xl font-black tracking-widest text-black">XP</Text>
          <Text className="text-sm font-bold tracking-wider text-gray-800 opacity-50">DIDAPAT</Text>
          <Text className="text-xl font-bold text-black">{xp}</Text>
        </View>
      </View>
    </View>
  );
};

export default QuestCard;
