import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityCard from '~/components/ActivityCard';
import TodayQuestCard from '~/components/TodayQuestCard';
import { useAuth } from '~/context/AuthContext';
import { feedService, FeedPost } from '~/services/FeedService';
import { questService, Quest } from '~/services/QuestService';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  SplashScreen: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();

  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add states for quests
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questLoading, setQuestLoading] = useState(true);
  const [questError, setQuestError] = useState<string | null>(null);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Function to fetch quests from backend
  const fetchQuests = useCallback(async () => {
    if (!user) return;

    try {
      setQuestLoading(true);
      setQuestError(null);

      const questsData = await questService.getActiveQuests();
      setQuests(questsData);
    } catch (err) {
      console.error('Failed to load quests:', err);
      setQuestError('Gagal memuat quest. Silakan coba lagi.');
    } finally {
      setQuestLoading(false);
    }
  }, [user]);

  const fetchFeedPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await feedService.getFeedPosts();

      if (Array.isArray(response)) {
        const processedPosts = response.map((post) => ({
          ...post,
          user: post.user || {
            id: post.user_id,
            name: 'Unknown User',
            email: '',
          },
          likes_count: post.likes_count || 0,
          comments_count: post.comments_count || 0,
        }));

        setFeedPosts(processedPosts);
      } else {
        console.error('Unexpected response format:', response);
        setError('Received unexpected data format from server');
        setFeedPosts([]);
      }
    } catch (err) {
      console.error('Failed to load feed posts:', err);
      setError('Failed to load activities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchFeedPosts(), fetchQuests()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFeedPosts();
    fetchQuests();
  }, [fetchQuests]);

  const handleLike = async (postId: number) => {
    if (!user) return;

    try {
      await feedService.toggleLike(postId, user.id);

      setFeedPosts(
        feedPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              likes_count: post.likes_count + 1,
            };
          }
          return post;
        }),
      );
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const getRelativeTime = (dateString: string) => {
    if (!dateString) return 'Unknown time';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'Hari' : 'Hari'} Lalu`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? 'Jam' : 'Jam'} Lalu`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'Menit' : 'Menit'} Lalu`;
    } else {
      return 'Baru saja';
    }
  };

  const todayQuest = questService.getTodayQuest(quests);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="mt-6 px-6">
          {/* Header */}
          <View className="flex-row items-center justify-between pl-2">
            <View className="flex-row items-center gap-4">
              <TouchableOpacity className="p-2" onPress={() => navigation.navigate('Profile')}>
                <FontAwesome5 name="user-circle" size={40} color="black" />
              </TouchableOpacity>
              <View>
                <Text className="text-lg text-gray-500">Hello {user?.name || 'User'}!</Text>
                <Text className="text-xl font-bold">{formattedDate}</Text>
              </View>
            </View>

            <TouchableOpacity>
              <View className="h-14 w-14 items-center justify-center rounded-full border border-gray-300">
                <AntDesign name="calendar" size={24} color="black" />
              </View>
            </TouchableOpacity>
          </View>
          {/* Quest Hari Ini */}
          <View className="flex flex-row justify-between pt-4">
            <Text className="text-2xl font-extrabold text-violet-900">
              Quest Hari Ini{user ? ` (Level ${user.level})` : '!'}
            </Text>
            <Entypo name="dots-two-vertical" size={24} color="black" />
          </View>
          {/* Quest Loading State */}
          {questLoading && !refreshing && (
            <View className="items-center justify-center py-4">
              <ActivityIndicator size="large" color="#9333EA" />
              <Text className="mt-2 text-purple-800">Loading quests...</Text>
            </View>
          )}
          {/* Quest Error State */}
          {questError && (
            <View className="items-center justify-center py-4">
              <Text className="text-red-500">{questError}</Text>
              <TouchableOpacity
                className="mt-2 rounded-xl bg-purple-800 px-6 py-2"
                onPress={fetchQuests}>
                <Text className="text-white">Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Today's Quest Card */}
          {!questLoading && !questError && todayQuest ? (
            <TodayQuestCard
              date={formattedDate}
              title={todayQuest.name}
              description={`${todayQuest.workout_count || '?'} Workout, ${todayQuest.workout_type || todayQuest.description}`}
              nextWorkout={todayQuest.workout_type || 'Push up'}
              questData={todayQuest}
            />
          ) : !questLoading && !questError ? (
            <View className="mt-6 rounded-xl bg-gray-100 p-6">
              <Text className="text-center text-gray-500">Tidak ada quest aktif hari ini</Text>
            </View>
          ) : null}
          {/* Aktivitas Terkini */}
          <Text className="mb-4 mt-6 text-xl font-bold">Aktivitas Terkini</Text>
          {/* Loading state */}
          {isLoading && !refreshing && (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#9333EA" />
              <Text className="mt-2 text-purple-800">Loading activities...</Text>
            </View>
          )}
          {/* Error state */}
          {error && (
            <View className="items-center justify-center py-8">
              <Text className="text-red-500">{error}</Text>
              <TouchableOpacity
                className="mt-4 rounded-xl bg-purple-800 px-6 py-2"
                onPress={fetchFeedPosts}>
                <Text className="text-white">Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Feed posts */}
          {!isLoading && feedPosts.length === 0 && !error && (
            <View className="items-center justify-center py-8">
              <Text className="text-gray-500">No activities found</Text>
            </View>
          )}
          {feedPosts.map((post) => (
            <View key={post.id} className="mb-4 mt-2 overflow-hidden rounded-2xl shadow-sm">
              <ActivityCard
                username={post.user?.name || 'Unknown User'}
                timeAgo={getRelativeTime(post.created_at || post.timestamp)}
                location={post.title || 'Unknown Location'}
                content={post.caption || ''}
                questCount={user?.level || 0}
                setsCount={Math.floor((post.likes_count || 0) * 5)}
                xpGained={Math.floor((post.likes_count || 0) * 100)}
                likes={post.likes_count || 0}
                comments={post.comments_count || 0}
                onLike={() => handleLike(post.id)}
                onComment={() => console.log('Comment pressed')}
                onShare={() => console.log('Share pressed')}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
