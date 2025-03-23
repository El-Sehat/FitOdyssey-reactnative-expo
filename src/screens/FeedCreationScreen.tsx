import { FontAwesome5 } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '~/context/AuthContext';
import { RootStackParamList } from '~/navigation';
import { feedService } from '~/services/FeedService';

type FeedCreationScreenRouteProp = RouteProp<RootStackParamList, 'FeedCreation'>;
type FeedCreationScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const FeedCreationScreen = () => {
  const route = useRoute<FeedCreationScreenRouteProp>();
  const navigation = useNavigation<FeedCreationScreenNavigationProp>();
  const { user } = useAuth();
  const { questName, questExp } = route.params || {};

  // State for form data
  const [title, setTitle] = useState(questName ? `Completed ${questName}` : 'My Fitness Update');
  const [caption, setCaption] = useState(
    questName ? `I just completed the "${questName}" quest and earned ${questExp} XP!` : '',
  );
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to handle post submission
  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to post');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please add a title for your post');
      return;
    }

    if (!caption.trim()) {
      Alert.alert('Missing Information', 'Please add a caption for your post');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('user_id', String(user.id));
      formData.append('title', title);
      formData.append('caption', caption);

      // Add image if selected
      if (image) {
        const localUri = image;
        const filename = localUri.split('/').pop();

        // Infer the type of the image
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('file', {
          uri: localUri,
          name: filename,
          type,
        } as any);
      }

      // Make API request
      await feedService.createPost(formData);
      Alert.alert('Success', 'Your activity has been shared!', [
        { text: 'OK', onPress: () => navigation.navigate('MainApp') },
      ]);
    } catch (error) {
      console.error('Error posting activity:', error);
      Alert.alert('Error', 'Failed to share your activity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Post',
      'Are you sure you want to discard this post?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => navigation.navigate('MainApp') },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        {/* Header */}
        <View className="border-b border-gray-200 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={handleCancel}>
              <Text className="text-purple-800">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold">Share Activity</Text>
            <TouchableOpacity
              className={`rounded-full px-3 py-1 ${isLoading ? 'bg-purple-400' : 'bg-purple-800'}`}
              onPress={handleSubmit}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white">Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* User info */}
          <View className="mb-4 flex-row items-center">
            <FontAwesome5 name="user-circle" size={40} color="#9333EA" />
            <Text className="ml-3 text-lg font-bold">{user?.name || 'User'}</Text>
          </View>

          {/* Title input */}
          <View className="mb-4">
            <Text className="mb-1 font-medium text-gray-700">Title</Text>
            <TextInput
              className="rounded-xl border border-gray-300 p-3"
              value={title}
              onChangeText={setTitle}
              placeholder="Add a title for your post"
              placeholderTextColor="#A0A0A0"
            />
          </View>

          {/* Caption input */}
          <View className="mb-4">
            <Text className="mb-1 font-medium text-gray-700">Caption</Text>
            <TextInput
              className="min-h-[120px] rounded-xl border border-gray-300 p-3"
              value={caption}
              onChangeText={setCaption}
              placeholder="Share your fitness achievement..."
              placeholderTextColor="#A0A0A0"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Image picker */}
          <View className="mb-4">
            <Text className="mb-1 font-medium text-gray-700">Add Photo (Required)</Text>
            {image ? (
              <View className="mb-2">
                <Image source={{ uri: image }} className="h-48 w-full rounded-xl" />
                <TouchableOpacity
                  className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-black bg-opacity-50"
                  onPress={() => setImage(null)}>
                  <FontAwesome5 name="times" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ) : null}

            <TouchableOpacity
              className="flex-row items-center justify-center rounded-xl border border-dashed border-gray-300 p-4"
              onPress={pickImage}
              disabled={isLoading}>
              <FontAwesome5 name="camera" size={20} color="#9333EA" />
              <Text className="ml-2 text-purple-800">{image ? 'Change Photo' : 'Add Photo'}</Text>
            </TouchableOpacity>
          </View>

          {/* Activity Stats (Optional, for visual enhancement) */}
          {questName && questExp && (
            <View className="mt-4 rounded-xl bg-purple-50 p-4">
              <Text className="font-bold text-purple-800">Achievement Highlights</Text>
              <View className="mt-2 flex-row justify-between">
                <View>
                  <Text className="text-gray-600">Quest Completed</Text>
                  <Text className="font-bold">{questName}</Text>
                </View>
                <View>
                  <Text className="text-gray-600">XP Earned</Text>
                  <Text className="font-bold">+{questExp}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FeedCreationScreen;
