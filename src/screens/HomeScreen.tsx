import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityCard from '~/components/ActivityCard';
import TodayQuestCard from '~/components/TodayQuestCard';

const HomeScreen = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView className="flex-1">
        <View className="mt-6 px-6">
          {/* Header */}
          <View className="flex-row items-center justify-between pl-2">
            <View className="flex-row items-center gap-4">
              <TouchableOpacity className="p-2" onPress={() => navigation.navigate('Profile')}>
                <FontAwesome5 name="user-circle" size={40} color="black" />
              </TouchableOpacity>
              <View>
                <Text className="text-lg text-gray-500">Hello Vincent!</Text>
                <Text className="text-xl font-bold">{formattedDate}</Text>
              </View>
            </View>

            <TouchableOpacity>
              {/* <Image
                source={require('assets/back_arrow.png')}
                className="h-8 w-8"
                resizeMode="contain"
              /> */}
              <View className="h-14 w-14 items-center justify-center rounded-full border border-gray-300">
                <AntDesign name="calendar" size={24} color="black" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Quest Hari Ini */}

          <View className="flex flex-row justify-between pt-4">
            <Text className="text-2xl font-extrabold text-violet-900">Quest Hari Ini!</Text>
            <Entypo name="dots-two-vertical" size={24} color="black" />
          </View>
          <TodayQuestCard
            date={formattedDate}
            title="Pull up 20x"
            description="Workout 1 dari 5"
            nextWorkout="Push up"
          />

          {/* Aktivitas Terkini */}
          <Text className="mb-4 mt-6 text-xl font-bold">Aktivitas Terkini</Text>

          <ActivityCard
            username="Deddy Cahyadi"
            timeAgo="2 Hari Lalu, 15.00 PM"
            location="Srengseng Sawah, Jakarta Selatan"
            content="Morning WO!!! Proud of myself!!"
            questCount={5}
            setsCount={25}
            xpGained={2500}
            likes={121}
            comments={34}
            onLike={() => console.log('Like pressed')}
            onComment={() => console.log('Comment pressed')}
            onShare={() => console.log('Share pressed')}
          />
          <ActivityCard
            username="Deddy Cahyadi"
            timeAgo="2 Hari Lalu, 15.00 PM"
            location="Srengseng Sawah, Jakarta Selatan"
            content="Morning WO!!! Proud of myself!!"
            questCount={5}
            setsCount={25}
            xpGained={2500}
            likes={121}
            comments={34}
            onLike={() => console.log('Like pressed')}
            onComment={() => console.log('Comment pressed')}
            onShare={() => console.log('Share pressed')}
          />
        </View>
      </ScrollView>
      {/* Bottom Navigation */}
      <View className="flex-row items-center justify-around border-t border-gray-200 bg-white py-4">
        <TouchableOpacity>
          <Text className="font-bold text-purple-800">Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-gray-500">Quest</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="font-bold text-gray-500">Aktivitas</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-gray-500">Shop</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
