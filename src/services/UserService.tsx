import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from '../../.env';

interface User {
  id: number;
  name: string;
  email: string;
  level: number;
  exp: number;
}

interface AddExpResponse {
  status: boolean;
  message: string;
  data: User;
  levelUp: boolean;
}

class UserService {
  async addUserExp(userId: number, expPoints: number): Promise<AddExpResponse> {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(
        `Adding ${expPoints} EXP to user ${userId} at URL: ${API_URL}/users/${userId}/exp`,
      );

      // First, try to update via API
      try {
        const response = await fetch(`${API_URL}/users/${userId}/exp`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ exp: expPoints }),
        });

        if (response.ok) {
          const data = await response.json();

          // Update stored user data with new exp and level from API
          if (data.status && data.data) {
            await this.updateLocalUserData(data.data);
          }

          console.log('Experience added successfully via API:', data);
          return data;
        }

        // If API call fails, log the error but continue to local update
        const errorText = await response.text();
        console.warn(`API error (${response.status}): ${errorText}`);
      } catch (apiError) {
        console.warn('API call failed:', apiError);
      }

      // Fallback: If API call fails, update local data
      console.log('Falling back to local experience update');
      const updatedLocalData = await this.updateLocalUserDataManually(userId, expPoints);

      return {
        status: true,
        message: 'Experience added successfully (local only)',
        data: updatedLocalData,
        levelUp: updatedLocalData.levelUp,
      } as any;
    } catch (error) {
      console.error('Complete failure in addUserExp:', error);

      try {
        const finalResult = await this.emergencyExpUpdate(userId, expPoints);
        return finalResult;
      } catch (finalError) {
        console.error('Even emergency exp update failed:', finalError);
        throw new Error('Failed to update experience points');
      }
    }
  }

  // Update the stored user data in AsyncStorage
  private async updateLocalUserData(updatedUser: User): Promise<void> {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.exp = updatedUser.exp;
        userData.level = updatedUser.level;
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        console.log('Updated local user data with new exp/level from API');
      }
    } catch (err) {
      console.error('Failed to update local user data:', err);
    }
  }

  private async updateLocalUserDataManually(userId: number, expPoints: number): Promise<any> {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.id === userId) {
          // Calculate new exp and level
          const currentExp = userData.exp || 0;
          const newExp = currentExp + expPoints;

          const oldLevel = Math.floor(currentExp / 100);
          const newLevel = Math.floor(newExp / 100);
          const leveledUp = newLevel > oldLevel;

          // Update stored data
          userData.exp = newExp;
          userData.level = newLevel;
          await AsyncStorage.setItem('user', JSON.stringify(userData));

          console.log(
            `Manually updated local user data: EXP ${currentExp} -> ${newExp}, Level ${oldLevel} -> ${newLevel}`,
          );

          return {
            ...userData,
            levelUp: leveledUp,
          };
        }
      }
      throw new Error('User data not found in local storage');
    } catch (err) {
      console.error('Failed to manually update local user data:', err);
      throw err;
    }
  }

  private async emergencyExpUpdate(userId: number, expPoints: number): Promise<AddExpResponse> {
    let userData = { id: userId, exp: expPoints, level: 0, name: 'User', email: '' };
    let levelUp = false;

    try {
      const storedUserStr = await AsyncStorage.getItem('user');
      if (storedUserStr) {
        const storedUser = JSON.parse(storedUserStr);
        const oldExp = storedUser.exp || 0;
        const newExp = oldExp + expPoints;

        const oldLevel = Math.floor(oldExp / 100);
        const newLevel = Math.floor(newExp / 100);
        levelUp = newLevel > oldLevel;

        userData = {
          ...storedUser,
          exp: newExp,
          level: newLevel,
        };

        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (e) {
      console.error('Emergency exp update error:', e);
    }

    return {
      status: true,
      message: 'Emergency experience update',
      data: userData,
      levelUp,
    };
  }
}

export const userService = new UserService();
