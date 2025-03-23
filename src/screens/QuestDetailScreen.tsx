import { FontAwesome5 } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import StartButton from '~/components/StartButton';
import { useAuth } from '~/context/AuthContext';
import { RootStackParamList } from '~/navigation';
import { feedService } from '~/services/FeedService';
import { questService, QuestWorkout } from '~/services/QuestService';

type QuestDetailScreenRouteProp = RouteProp<RootStackParamList, 'QuestDetail'>;
type QuestDetailScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const QuestDetailScreen = () => {
  const route = useRoute<QuestDetailScreenRouteProp>();
  const navigation = useNavigation<QuestDetailScreenNavigationProp>();
  const { quest } = route.params;
  const { user, refreshUser } = useAuth();

  const [workouts, setWorkouts] = useState<QuestWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedExists, setFeedExists] = useState(false);
  const [checkingFeed, setCheckingFeed] = useState(false);
  const [existingFeedImage, setExistingFeedImage] = useState<string | null>(null);
  const [awardedExp, setAwardedExp] = useState(false);
  const [isAwardingExp, setIsAwardingExp] = useState(false);

  const [isQuestCompleted, setIsQuestCompleted] = useState(
    questService.hasCompletedQuest(quest, user?.id || 0),
  );

  const [completedWorkoutsCount, setCompletedWorkoutsCount] = useState(0);
  const [totalWorkoutsCount, setTotalWorkoutsCount] = useState(0);

  // Check if a feed post for this quest already exists
  const checkExistingFeed = useCallback(async () => {
    if (!user || !isQuestCompleted) return;

    try {
      setCheckingFeed(true);
      const feeds = await feedService.getFeedPosts();

      // Look for a feed that mentions this quest
      const questFeed = feeds.find(
        (feed) =>
          feed.user_id === user.id &&
          (feed.title.includes(quest.name) || feed.caption.includes(quest.name)),
      );

      setFeedExists(!!questFeed);
      if (questFeed && questFeed.picUrl) {
        setExistingFeedImage(questFeed.picUrl);
      }
    } catch (error) {
      console.error('Error checking for existing feed:', error);
    } finally {
      setCheckingFeed(false);
    }
  }, [user, quest.name, isQuestCompleted]);

  // Function to award experience for completed quests
  const awardExpForCompletedQuest = useCallback(async () => {
    if (!user || !isQuestCompleted || awardedExp || isAwardingExp) return;

    try {
      setIsAwardingExp(true);
      console.log(`Attempting to award EXP for quest ${quest.id} to user ${user.id}`);

      const leveledUp = await questService.awardQuestExpIfCompleted(quest, user.id);

      if (leveledUp) {
        Alert.alert('🎉 Level Up! 🎉', `You've gained ${quest.exp} XP and leveled up!`, [
          { text: 'Awesome!' },
        ]);
      } else {
        // Optional: Show a more subtle notification for just gaining EXP
        console.log(`User gained ${quest.exp} XP but didn't level up`);
      }

      setAwardedExp(true);

      // Force refresh of user data in AuthContext to update the exp/level
      if (refreshUser && typeof refreshUser === 'function') {
        await refreshUser();
      }
    } catch (error) {
      console.error('Error awarding experience:', error);
    } finally {
      setIsAwardingExp(false);
    }
  }, [user, quest, isQuestCompleted, awardedExp, isAwardingExp, refreshUser]);

  // Check if the quest is newly completed and award exp
  useEffect(() => {
    if (isQuestCompleted && user) {
      awardExpForCompletedQuest();
    }
  }, [isQuestCompleted, user, awardExpForCompletedQuest]);

  useFocusEffect(
    useCallback(() => {
      const fetchWorkouts = async () => {
        if (!user) return;

        try {
          setLoading(true);

          // Refresh the quest data to get the latest completion status
          const questsData = await questService.getActiveQuests();
          const updatedQuest = questsData.find((q) => q.id === quest.id);

          if (updatedQuest) {
            const wasCompleted = isQuestCompleted;
            const isNowCompleted = questService.hasCompletedQuest(updatedQuest, user.id);

            setIsQuestCompleted(isNowCompleted);

            // If the quest was just completed, show a congratulations message
            if (!wasCompleted && isNowCompleted) {
              Alert.alert(
                'Quest Completed!',
                `Congratulations! You've completed "${quest.name}" and earned ${quest.exp} XP.`,
                [{ text: 'Great!' }],
              );
            }
          }

          const workoutsData = await questService.getQuestWorkouts(quest.id);
          setWorkouts(workoutsData);

          const completed = workoutsData.filter((w) => w.is_finished).length;
          setCompletedWorkoutsCount(completed);
          setTotalWorkoutsCount(workoutsData.length);
        } catch (err: any) {
          console.error('Failed to load workouts:', err);
          setError(err.message || 'Failed to load workouts');
        } finally {
          setLoading(false);
        }
      };

      fetchWorkouts();
      checkExistingFeed();
    }, [quest.id, user, checkExistingFeed, isQuestCompleted]),
  );

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
          onPress: () => {
            navigation.navigate('Exercise', {
              quest,
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleCreateFeed = () => {
    navigation.navigate('FeedCreation', {
      questName: quest.name,
      questExp: quest.exp,
    });
  };

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
              {isQuestCompleted ? (
                <View className="items-center">
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-green-600">
                    <FontAwesome5 name="check" size={24} color="white" />
                  </View>
                  <Text className="mt-2 text-center text-white">Completed</Text>
                </View>
              ) : (
                <StartButton
                  size={70}
                  onPress={handleStartWorkout}
                  colors={['#EF4444', '#DC2626', '#B91C1C']}
                  shadowColor="#DC2626"
                />
              )}
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

        <View className="mx-auto mt-2 w-[90%]">
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-600">Progress</Text>
            <Text className="text-sm font-bold text-purple-800">
              {completedWorkoutsCount}/{totalWorkoutsCount} workouts completed
            </Text>
          </View>
          <View className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <View
              className="h-full bg-purple-800"
              style={{
                width: `${totalWorkoutsCount > 0 ? (completedWorkoutsCount / totalWorkoutsCount) * 100 : 0}%`,
              }}
            />
          </View>
        </View>

        {/* Experience info for completed quests */}
        {isQuestCompleted && (
          <View className="mx-4 mt-4 rounded-xl border border-purple-200 bg-purple-50 p-3">
            <View className="flex-row items-center">
              <FontAwesome5 name="medal" size={16} color="#6B21A8" />
              <Text className="ml-2 font-medium text-purple-900">Experience Gained</Text>
            </View>
            <Text className="mt-1 text-purple-800">
              You earned <Text className="font-bold">+{quest.exp} XP</Text> from this quest!
            </Text>
          </View>
        )}

        {/* Share to Activity button - only show for completed quests */}
        {isQuestCompleted && (
          <View className="mx-4 mt-4">
            {/* Show existing feed image if available */}
            {feedExists && existingFeedImage && (
              <View className="mb-2 overflow-hidden rounded-xl">
                <Image
                  source={{ uri: existingFeedImage }}
                  className="h-40 w-full"
                  resizeMode="cover"
                />
              </View>
            )}

            <TouchableOpacity
              className={`flex-row items-center justify-center rounded-xl p-3 ${
                feedExists ? 'bg-gray-300' : 'bg-purple-800'
              }`}
              onPress={handleCreateFeed}
              disabled={feedExists || checkingFeed}>
              {checkingFeed ? (
                <ActivityIndicator size="small" color={feedExists ? '#666' : 'white'} />
              ) : (
                <>
                  <FontAwesome5 name="share-alt" size={16} color={feedExists ? '#666' : 'white'} />
                  <Text
                    className={`ml-2 font-medium ${feedExists ? 'text-gray-600' : 'text-white'}`}>
                    {feedExists ? 'Already Shared to Activity' : 'Share to Activity Feed'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

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
