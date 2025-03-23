import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityCard from '~/components/ActivityCard';
import { useAuth } from '~/context/AuthContext';
import { feedService, FeedPost } from '~/services/FeedService';

const ActivityScreen = () => {
  const { user } = useAuth();

  // State variables
  const [userActivities, setUserActivities] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch user's activities
  const fetchUserActivities = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await feedService.getFeedPosts();

      if (Array.isArray(response)) {
        // Filter for user's posts and ensure each post has required properties
        const userPosts = response
          .filter((post) => post.user_id === user.id)
          .map((post) => ({
            ...post,
            // Ensure user object exists with a name property
            user: post.user || {
              id: post.user_id || user.id,
              name: user.name || 'Unknown User',
              email: user.email || '',
            },
            // Ensure other required properties exist
            likes_count: post.likes_count || 0,
            comments_count: post.comments_count || 0,
            created_at: post.created_at || new Date().toISOString(),
            title: post.title || 'Activity',
            caption: post.caption || '',
          }));

        setUserActivities(userPosts);
      } else {
        console.error('Unexpected response format:', response);
        setError('Received unexpected data format from server');
        setUserActivities([]);
      }
    } catch (err) {
      console.error('Failed to load user activities:', err);
      setError('Failed to load your activities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserActivities();
    setRefreshing(false);
  }, [fetchUserActivities]);

  // Load data when component mounts
  useEffect(() => {
    fetchUserActivities();
  }, [fetchUserActivities]);

  // Format date to a readable time ago format
  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Unknown time';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      let timeAgo = '';
      if (diffDays > 0) {
        timeAgo = `${diffDays} Hari Lalu`;
      } else if (diffHours > 0) {
        timeAgo = `${diffHours} Jam Lalu`;
      } else if (diffMinutes > 0) {
        timeAgo = `${diffMinutes} Menit Lalu`;
      } else {
        timeAgo = 'Baru saja';
      }
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${timeAgo}, ${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown time';
    }
  };

  const handleLike = async (postId: number) => {
    if (!user) return;

    try {
      await feedService.toggleLike(postId, user.id);

      setUserActivities((prevActivities) =>
        prevActivities.map((activity) => {
          if (activity.id === postId) {
            return {
              ...activity,
              likes_count: (activity.likes_count || 0) + 1,
            };
          }
          return activity;
        }),
      );
    } catch (error) {
      console.error('Failed to like activity:', error);
      Alert.alert('Error', 'Failed to like the activity. Please try again.');
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-100">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header with proper spacing */}
      <View className="mb-2 border-b border-gray-200 bg-white px-6 py-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1" />
          <Text className="flex-1 text-center text-xl font-bold">Aktivitasku</Text>
          <View className="flex-1 items-end">
            <AntDesign name="filter" size={24} color="black" />
          </View>
        </View>
      </View>

      {/* Content with RefreshControl */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="px-4 pb-6">
          {/* Loading state */}
          {isLoading && !refreshing && (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#9333EA" />
              <Text className="mt-2 text-purple-800">Loading your activities...</Text>
            </View>
          )}

          {/* Error state */}
          {error && (
            <View className="items-center justify-center py-8">
              <Text className="text-red-500">{error}</Text>
              <TouchableOpacity
                className="mt-4 rounded-xl bg-purple-800 px-6 py-2"
                onPress={fetchUserActivities}>
                <Text className="text-white">Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* No activities state */}
          {!isLoading && userActivities.length === 0 && !error && (
            <View className="flex-1 items-center justify-center p-8">
              <Text className="text-center text-lg text-gray-500">
                Kamu belum memiliki aktivitas. Mulai workout sekarang!
              </Text>
            </View>
          )}

          {userActivities.map((activity) => (
            <View key={activity.id} className="mb-4 mt-3 overflow-hidden rounded-2xl shadow">
              <ActivityCard
                username={activity.user?.name || user?.name || 'Unknown User'}
                timeAgo={getRelativeTime(activity.created_at)}
                location={activity.title || 'Activity'} // Using title as location
                content={activity.caption || ''}
                questCount={user?.level || 0}
                setsCount={Math.floor((activity.likes_count || 0) * 2)}
                xpGained={Math.floor((activity.likes_count || 0) * 100)}
                likes={activity.likes_count || 0}
                comments={activity.comments_count || 0}
                onLike={() => handleLike(activity.id)}
                onComment={() => console.log(`Comment pressed for activity ${activity.id}`)}
                onShare={() => console.log(`Share pressed for activity ${activity.id}`)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivityScreen;
