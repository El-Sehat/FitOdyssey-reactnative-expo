import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';

import { View, Text, SafeAreaView } from 'react-native';

const ActivityScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl font-bold">Activity Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default ActivityScreen;