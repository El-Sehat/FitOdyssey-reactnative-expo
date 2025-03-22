import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from '../../.env';

export interface Quest {
  id: number;
  name: string;
  description: string;
  exp: number;
  start_date: string;
  end_date: string;
  is_finished?: boolean;
  workout_count?: number;
  workout_type?: string;
  user_id?: number[];
}

export interface QuestWorkout {
  id: number;
  name: string;
  repetition: number;
  is_finished: boolean;
}

class QuestService {
  async getActiveQuests(): Promise<Quest[]> {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');

      if (!user) {
        throw new Error('User not authenticated');
      }

      const userId = JSON.parse(user).id;
      const url = `${API_URL}/quests/${userId}`;

      console.log('Fetching quests from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch quests: ${response.status}`);
      }

      const quests = await response.json();

      return quests.map((quest: Quest) => ({
        ...quest,
        user_id: quest.is_finished ? [userId] : [],
      }));
    } catch (error) {
      console.error('Error fetching quests:', error);
      throw error;
    }
  }

  async getQuestWorkouts(questId: number): Promise<QuestWorkout[]> {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');

      if (!user) {
        throw new Error('User not authenticated');
      }

      const userId = JSON.parse(user).id;
      const url = `${API_URL}/quests/workouts/${questId}/${userId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch quest workouts: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching quest workouts:', error);
      throw error;
    }
  }

  hasCompletedQuest(quest: Quest, userId: number): boolean {
    if (typeof quest.is_finished !== 'undefined') {
      return quest.is_finished;
    }

    return Array.isArray(quest.user_id) && quest.user_id.includes(userId);
  }

  getQuestProgress(quest: Quest, userId: number): number {
    if (this.hasCompletedQuest(quest, userId)) {
      return 100;
    }

    return 50;
  }

  getTodayQuest(quests: Quest[]): Quest | null {
    if (!quests || quests.length === 0) return null;

    const sortedQuests = [...quests].sort(
      (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
    );

    const now = new Date();
    const activeQuests = sortedQuests.filter((quest) => {
      const endDate = new Date(quest.end_date);
      return endDate >= now;
    });

    return activeQuests.length > 0 ? activeQuests[0] : null;
  }
}

export const questService = new QuestService();
