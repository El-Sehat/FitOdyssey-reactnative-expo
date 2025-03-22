import { FontAwesome5 } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import StartButton from '~/components/StartButton';
import { useAuth } from '~/context/AuthContext';
import { RootStackParamList } from '~/navigation';
import { questService, QuestWorkout } from '~/services/QuestService';

type QuestDetailScreenRouteProp = RouteProp<RootStackParamList, 'QuestDetail'>;
type QuestDetailScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const QuestDetailScreen = () => {
  const route = useRoute<QuestDetailScreenRouteProp>();
  const navigation = useNavigation<QuestDetailScreenNavigationProp>();
  const { quest } = route.params;
  const { user } = useAuth();

  const [workouts, setWorkouts] = useState<QuestWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const workoutsData = await questService.getQuestWorkouts(quest.id);
        setWorkouts(workoutsData);
      } catch (err: any) {
        console.error('Failed to load workouts:', err);
        setError(err.message || 'Failed to load workouts');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [quest.id, user]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleStartWorkout = () => {
    Alert.alert(
      'Start Workout',
      'Are you ready to begin your workout?',
      [
        {
          text: 'Not yet',
          style: 'cancel',
        },
        {
          text: "Let's Go!",
          onPress: () => console.log('User started workout for quest:', quest.id),
        },
      ],
      { cancelable: true },
    );
  };

  // Format dates for display
  const startDate = new Date(quest.start_date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const endDate = new Date(quest.end_date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="bg-white px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleGoBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <FontAwesome5 name="chevron-left" size={20} color="#6B21A8" />
          </TouchableOpacity>
          <View className="ml-4 flex-1">
            <Text className="text-xl font-bold text-purple-900">Quest Aktif!</Text>
            <Text className="text-sm text-purple-700">Anda telah Bergabung, Semangat!</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Quest Header Card with updated gradient colors */}
        <LinearGradient
          colors={['#391484', '#4A1687', '#591E89']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mx-4 mt-4 overflow-hidden rounded-[24px] p-5 shadow-md">
          {/* Upper section with title and button side by side */}
          <View className="flex-row justify-between">
            {/* Left side: date, title, description */}
            <View className="flex-1 pr-3">
              <Text className="text-gray-200">
                {startDate} - {endDate}
              </Text>
              <Text className="mt-1 text-2xl font-bold text-white" numberOfLines={2}>
                {quest.name}
              </Text>
              <Text className="text-white" numberOfLines={2}>
                {workouts.length || quest.workout_count || 0} Workout,{' '}
                {quest.workout_type || quest.description.substring(0, 20)}
              </Text>
            </View>

            {/* Right side: start button */}
            <View className="justify-center">
              <StartButton
                size={70}
                onPress={handleStartWorkout}
                colors={['#EF4444', '#DC2626', '#B91C1C']}
                shadowColor="#DC2626"
              />
            </View>
          </View>

          {/* Stats Row */}
          <View className="mt-6 flex-row overflow-hidden rounded-[20px] bg-white shadow-sm">
            <View className="flex-1 items-center border-r border-gray-200 py-3">
              <FontAwesome5 name="star" size={20} color="#6B21A8" />
              <Text className="mt-1 text-xs text-gray-500">QUEST</Text>
              <Text className="text-base font-bold">{quest.id}</Text>
            </View>
            <View className="flex-1 items-center border-r border-gray-200 py-3">
              <FontAwesome5 name="users" size={20} color="#6B21A8" />
              <Text className="mt-1 text-xs text-gray-500">PESERTA</Text>
              <Text className="text-base font-bold">-</Text>
            </View>
            <View className="flex-1 items-center py-3">
              <Text className="text-xl font-bold text-purple-800">XP</Text>
              <Text className="text-xs text-gray-500">TERSEDIA</Text>
              <Text className="text-base font-bold">+{quest.exp}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Deksripsi */}
        <View className="mx-4 mt-6">
          <Text className="text-lg font-bold text-gray-800">Deskripsi</Text>
          <Text className="mt-2 text-gray-600">{quest.description}</Text>
        </View>

        {/* List Olahraga */}
        <LinearGradient
          colors={['#391484', '#4A1687', '#591E89']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mx-4 mt-6 overflow-hidden rounded-[24px] p-4 shadow-md">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-white">List Olahraga</Text>
            <Text className="text-white">Intermediate</Text>
          </View>

          {/* Workout List */}
          {loading ? (
            <View className="items-center py-4">
              <ActivityIndicator size="large" color="white" />
              <Text className="mt-2 text-white">Loading workouts...</Text>
            </View>
          ) : error ? (
            <View className="items-center py-4">
              <Text className="text-red-200">{error}</Text>
            </View>
          ) : workouts.length > 0 ? (
            <>
              {workouts.slice(0, 2).map((workout) => (
                <View
                  key={workout.id}
                  className="mt-2 flex-row items-center overflow-hidden rounded-[16px] bg-white p-4 shadow-sm">
                  <View className="h-16 w-16 items-center justify-center rounded-[12px] bg-gray-100">
                    <FontAwesome5
                      name={workout.is_finished ? 'check-circle' : 'dumbbell'}
                      size={24}
                      color={workout.is_finished ? '#10B981' : '#6B21A8'}
                    />
                  </View>
                  <View className="ml-4">
                    <Text className="text-lg font-bold">{workout.name}</Text>
                    <Text className="text-gray-500">
                      {workout.repetition} x {Math.ceil(workout.repetition / 10)} Set
                    </Text>
                  </View>
                </View>
              ))}

              {workouts.length > 2 && (
                <TouchableOpacity className="mt-4 items-center">
                  <Text className="font-medium text-white">Lihat Lainnya</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View className="items-center overflow-hidden rounded-[16px] bg-white py-4">
              <Text className="text-gray-500">Tidak ada detail workout tersedia</Text>
            </View>
          )}
        </LinearGradient>

        {/* Leaderboard - Updated gradient colors */}
        <View className="mx-4 mb-10 mt-6">
          <Text className="mb-2 text-lg font-bold text-gray-800">LeaderBoard</Text>

          <LinearGradient
            colors={['#391484', '#4A1687', '#591E89']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="overflow-hidden rounded-[24px] p-4 shadow-md">
            {/* Leaderboard Item 1 */}
            <View className="mb-3 flex-row items-center overflow-hidden rounded-[16px] bg-white p-3 shadow-sm">
              <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-yellow-400">
                <FontAwesome5 name="medal" size={14} color="#FFF" />
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <FontAwesome5 name="user-alt" size={16} color="#555" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-bold">Kowalski</Text>
                <Text className="text-xs text-gray-500">5 menit yang lalu</Text>
              </View>
              <View className="items-end">
                <Text className="text-xs text-gray-500">XP DIRAIH</Text>
                <Text className="font-bold text-gray-800">+17700</Text>
              </View>
            </View>

            {/* Leaderboard Item 2 */}
            <View className="mb-3 flex-row items-center overflow-hidden rounded-[16px] bg-white p-3 shadow-sm">
              <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-gray-400">
                <FontAwesome5 name="medal" size={14} color="#FFF" />
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <FontAwesome5 name="user-alt" size={16} color="#555" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-bold">Shrek</Text>
                <Text className="text-xs text-gray-500">28 menit yang lalu</Text>
              </View>
              <View className="items-end">
                <Text className="text-xs text-gray-500">XP DIRAIH</Text>
                <Text className="font-bold text-gray-800">+16400</Text>
              </View>
            </View>

            {/* Leaderboard Item 3 */}
            <View className="mb-3 flex-row items-center overflow-hidden rounded-[16px] bg-white p-3 shadow-sm">
              <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-amber-600">
                <FontAwesome5 name="medal" size={14} color="#FFF" />
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <FontAwesome5 name="user-alt" size={16} color="#555" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-bold">Po</Text>
                <Text className="text-xs text-gray-500">35 menit yang lalu</Text>
              </View>
              <View className="items-end">
                <Text className="text-xs text-gray-500">XP DIRAIH</Text>
                <Text className="font-bold text-gray-800">+12400</Text>
              </View>
            </View>

            <TouchableOpacity className="mt-3 items-center">
              <Text className="font-medium text-white">Lihat Lainnya</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestDetailScreen;
