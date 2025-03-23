import AsyncStorage from '@react-native-async-storage/async-storage';

import { userService } from './UserService';
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

  async completeQuest(questId: number): Promise<any> {
    try {
      const user = await AsyncStorage.getItem('user');

      if (!user) {
        throw new Error('User not authenticated');
      }
      const workouts = await this.getQuestWorkouts(questId);

      for (const workout of workouts) {
        if (!workout.is_finished) {
          await this.markWorkoutComplete(questId, workout.id);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error completing quest:', error);
      throw error;
    }
  }

  async markWorkoutComplete(questId: number, workoutId: number): Promise<any> {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');

      if (!user) {
        throw new Error('User not authenticated');
      }

      const userId = JSON.parse(user).id;
      const url = `${API_URL}/quests/workouts/${questId}/${workoutId}/${userId}`;

      console.log('Marking workout complete at URL:', url);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to mark workout as complete: ${response.status}`);
      }

      const allWorkoutsCompleted = await this.areAllWorkoutsCompleted(questId);

      if (allWorkoutsCompleted) {
        console.log(`All workouts for quest ${questId} completed!`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking workout as complete:', error);
      throw error;
    }
  }

  async areAllWorkoutsCompleted(questId: number): Promise<boolean> {
    try {
      const workouts = await this.getQuestWorkouts(questId);
      return workouts.every((workout) => workout.is_finished);
    } catch (error) {
      console.error('Error checking if all workouts are completed:', error);
      return false;
    }
  }

  // Add or update this method in the QuestService class
  async awardQuestExpIfCompleted(quest: Quest, userId: number): Promise<boolean> {
    try {
      // Check if quest is actually completed
      if (!this.hasCompletedQuest(quest, userId)) {
        console.log(`Cannot award EXP: Quest ${quest.id} is not completed by user ${userId}`);
        return false;
      }

      // Check if we've already awarded experience for this quest
      const awardedExpKey = `quest_exp_awarded_${quest.id}_${userId}`;
      const alreadyAwarded = await AsyncStorage.getItem(awardedExpKey);

      if (alreadyAwarded) {
        console.log(`EXP already awarded for quest ${quest.id} to user ${userId}`);
        return false;
      }

      console.log(`Awarding ${quest.exp} EXP for quest ${quest.id} to user ${userId}`);

      // Try to award experience
      const response = await userService.addUserExp(userId, quest.exp);

      // Mark this quest as having awarded exp regardless of the result
      // This prevents repeated award attempts
      await AsyncStorage.setItem(
        awardedExpKey,
        JSON.stringify({
          awarded: true,
          timestamp: new Date().toISOString(),
          expAmount: quest.exp,
        }),
      );

      console.log(`Quest ${quest.id} marked as having awarded EXP to user ${userId}`);

      // Return whether a level up occurred
      return (response && response.levelUp) || false;
    } catch (error) {
      console.error('Error in awardQuestExpIfCompleted:', error);

      // Even on error, mark as awarded to prevent repeated failures
      const awardedExpKey = `quest_exp_awarded_${quest.id}_${userId}`;
      await AsyncStorage.setItem(
        awardedExpKey,
        JSON.stringify({
          awarded: true,
          timestamp: new Date().toISOString(),
          expAmount: quest.exp,
          error: true,
        }),
      );

      return false;
    }
  }
}

export const questService = new QuestService();
