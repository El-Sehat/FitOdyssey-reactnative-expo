import AsyncStorage from '@react-native-async-storage/async-storage';

import { FEED_API_URL } from '../../.env';

export interface FeedPost {
  created_at: string;
  id: number;
  title: string;
  caption: string;
  picUrl?: string;
  user_id: number;
  timestamp: string;
  likes_count: number;
  comments_count: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface FeedResponse {
  feeds: FeedPost[];
  nextCursor?: string;
}

class FeedService {
  async getFeedPosts(cursor?: string): Promise<FeedPost[]> {
    try {
      const token = await AsyncStorage.getItem('token');
      const url = cursor
        ? `${FEED_API_URL}/feed/feeds-load?cursor=${cursor}`
        : `${FEED_API_URL}/feed/feeds-load`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feed posts');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching feed posts:', error);
      throw error;
    }
  }

  async toggleLike(feedId: number, userId: number): Promise<any> {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${FEED_API_URL}/feed/like/${feedId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  // Comment on a post
  async addComment(feedId: number, userId: number, comment: string): Promise<any> {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${FEED_API_URL}/feed/comment/${feedId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, comment }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Create a new feed post
  async createPost(formData: FormData): Promise<any> {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${FEED_API_URL}/feed`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }
}

export const feedService = new FeedService();
