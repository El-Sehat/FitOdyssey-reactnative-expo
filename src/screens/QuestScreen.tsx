import { Entypo } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import QuestCard from '~/components/QuestCard';
import TodayQuestCard from '~/components/TodayQuestCard';
import { useAuth } from '~/context/AuthContext';
import { questService, Quest } from '~/services/QuestService';

const QuestScreen = () => {
  const { user } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Helper for formatting quest dates
  const formatQuestDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatDay = (date: Date) => {
      return date.getDate().toString();
    };

    const formatMonth = (date: Date) => {
      return date.toLocaleDateString('id-ID', { month: 'long' });
    };

    const formatYear = (date: Date) => {
      return date.getFullYear().toString();
    };

    // If same year
    if (formatYear(start) === formatYear(end)) {
      // If same month
      if (formatMonth(start) === formatMonth(end)) {
        return `${formatDay(start)} - ${formatDay(end)} ${formatMonth(end)} ${formatYear(end)}`;
      }
      // Different months
      return `${formatDay(start)} ${formatMonth(start)} - ${formatDay(end)} ${formatMonth(end)} ${formatYear(end)}`;
    }

    // Different years
    return `${formatDay(start)} ${formatMonth(start)} ${formatYear(start)} - ${formatDay(end)} ${formatMonth(end)} ${formatYear(end)}`;
  };

  const fetchQuests = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const questsData = await questService.getActiveQuests();
      setQuests(questsData);
    } catch (err: any) {
      console.error('Failed to load quests:', err);
      setError('Gagal memuat quest. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchQuests();
    setRefreshing(false);
  }, [fetchQuests]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const todayQuest = questService.getTodayQuest(quests);

  // Get incomplete quests excluding today's quest
  const incompleteQuests = quests.filter(
    (q) => !questService.hasCompletedQuest(q, user?.id || 0) && q.id !== todayQuest?.id,
  );

  // Get completed quests
  const completedQuests = quests.filter((q) => questService.hasCompletedQuest(q, user?.id || 0));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="mt-6 px-6">
          {/* Quest Hari Ini with user level */}
          <View className="flex flex-row justify-between pt-4">
            <Text className="text-2xl font-extrabold text-black">
              Quest Hari Ini{user ? ` (Level ${user.level})` : '!'}
            </Text>
            <Entypo name="dots-two-vertical" size={24} color="gray" />
          </View>

          {/* Loading State */}
          {isLoading && !refreshing && (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#9333EA" />
              <Text className="mt-2 text-purple-800">Loading quests...</Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View className="items-center justify-center py-8">
              <Text className="text-red-500">{error}</Text>
              <TouchableOpacity
                className="mt-4 rounded-xl bg-purple-800 px-6 py-2"
                onPress={fetchQuests}>
                <Text className="text-white">Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Today's Quest Card */}
          {!isLoading && !error && todayQuest ? (
            <TodayQuestCard
              date={formattedDate}
              title={todayQuest.name}
              description={todayQuest.description}
              nextWorkout={todayQuest.workout_type || 'Workout Selanjutnya'}
              questData={todayQuest}
            />
          ) : !isLoading && !error ? (
            <View className="mt-6 rounded-xl bg-gray-100 p-6">
              <Text className="text-center text-gray-500">Tidak ada quest aktif hari ini</Text>
            </View>
          ) : null}

          {/* Incomplete Quests Section */}
          {!isLoading && incompleteQuests.length > 0 && (
            <>
              <Text className="mt-6 text-lg font-bold">Quest Lainnya</Text>
              {incompleteQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  date={formatQuestDate(quest.start_date, quest.end_date)}
                  title={quest.name}
                  description={quest.description}
                  quest={quest.id.toString()}
                  sets={quest.workout_count?.toString() || '0'}
                  xp={`+${quest.exp}`}
                  questData={quest}
                  isCompleted={false}
                />
              ))}
            </>
          )}

          {/* Completed Quests Section */}
          {!isLoading && completedQuests.length > 0 && (
            <>
              <Text className="mt-8 text-lg font-bold">Quest Selesai</Text>
              {completedQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  date={formatQuestDate(quest.start_date, quest.end_date)}
                  title={quest.name}
                  description={quest.description}
                  quest="✓"
                  sets={quest.workout_count?.toString() || '0'}
                  xp={`+${quest.exp}`}
                  questData={quest}
                  isCompleted
                />
              ))}
            </>
          )}

          {/* No Quests State */}
          {!isLoading && !error && quests.length === 0 && (
            <View className="mt-6 items-center justify-center rounded-xl bg-gray-100 p-6">
              <Text className="text-center text-gray-500">
                Tidak ada quest yang tersedia saat ini
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestScreen;
