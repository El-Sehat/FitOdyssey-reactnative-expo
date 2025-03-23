import { FontAwesome5, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, TouchableOpacity } from 'react-native';

import { RootStackParamList } from '~/navigation';
import { Quest } from '~/services/QuestService';

interface QuestCardProps {
  date: string;
  title: string;
  description: string;
  quest: string;
  sets: string;
  xp: string;
  questData?: Quest;
  isCompleted?: boolean;
}

type QuestNavigationProp = StackNavigationProp<RootStackParamList>;

const QuestCard: React.FC<QuestCardProps> = ({
  date,
  title,
  description,
  quest,
  sets,
  xp,
  questData,
  isCompleted = false,
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
        <View className="flex-row justify-between pb-4">
          <View className="flex-1 pr-4">
            <Text className="text-gray-200 opacity-80">{date}</Text>
            <Text className="text-2xl font-bold text-white" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-gray-200 opacity-80" numberOfLines={2}>
              {description}
            </Text>
            {isCompleted && (
              <View className="mt-2 self-start overflow-hidden rounded-full bg-white px-3 py-1">
                <Text className="font-bold text-green-700">Selesai</Text>
              </View>
            )}
          </View>
          <View className="h-16 w-16 items-center justify-center rounded-full border-white bg-red-400">
            <MaterialCommunityIcons
              name={isCompleted ? 'check' : 'lightning-bolt-outline'}
              size={28}
              color="white"
            />
          </View>
        </View>
        <View className="mt-6 flex-row items-center justify-between overflow-hidden rounded-[20px] border bg-white p-4 py-4 text-black shadow-sm">
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
            <Text className="text-sm font-bold tracking-wider text-gray-800 opacity-50">
              DIDAPAT
            </Text>
            <Text className="text-xl font-bold text-black">{xp}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default QuestCard;
