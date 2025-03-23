import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, TouchableOpacity } from 'react-native';

import { RootStackParamList } from '~/navigation';
import { Quest } from '~/services/QuestService';

interface TodayQuestCardProps {
  date: string;
  title: string;
  description: string;
  nextWorkout: string;
  questData?: Quest;
}

type QuestNavigationProp = StackNavigationProp<RootStackParamList>;

const TodayQuestCard: React.FC<TodayQuestCardProps> = ({
  date,
  title,
  description,
  nextWorkout,
  questData,
}) => {
  const navigation = useNavigation<QuestNavigationProp>();

  const handlePress = () => {
    if (questData) {
      navigation.navigate('QuestDetail', {
        quest: questData,
      });
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress} disabled={!questData}>
      <LinearGradient
        colors={['#391484', '#4A1687', '#591E89']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="mt-6 overflow-hidden rounded-[24px] px-8 py-6 shadow-md">
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
        <View className="mt-4 flex flex-row items-center gap-6 overflow-hidden rounded-[20px] bg-white p-6 pl-6 shadow-sm">
          <FontAwesome5 name="angle-double-right" size={24} color="black" />
          <View className="flex flex-col">
            <Text className="text-sm tracking-wider opacity-40">Selanjutnya</Text>
            <Text className="font-extrabold">{nextWorkout}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default TodayQuestCard;
