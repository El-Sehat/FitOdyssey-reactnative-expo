import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, Image, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './LoginScreen';
import TodayQuestCard from '~/components/TodayQuestCard';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  SplashScreen: undefined;
};

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Login" component={Login} />
    </Tab.Navigator>
  );
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

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
            <View className="flex-row items-center gap-6">
              <FontAwesome5 name="user-circle" size={40} color="black" />
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

          <View className="-mx-6 w-screen rounded-t-[3rem] bg-white">
            <View className="mx-6 flex flex-col justify-center">
              <View className="mt-4 flex-row items-center">
                {/* <Image 
                source={require('assets/user_avatar.png')} 
                className="w-10 h-10 rounded-full"
                resizeMode="contain"
              /> */}
                <FontAwesome5 name="user-circle" size={40} color="black" />
                <View className="ml-4 flex flex-col">
                  <Text className="text-xl font-bold">Deddy Cahyadi</Text>
                  <Text className="text-xs text-gray-500">
                    2 Hari Lalu, 15.00 PM - Srengseng Sawah, Jakarta Selatan
                  </Text>
                </View>
              </View>
              <Text className="mt-4 ">Morning WO!!! Proud of myself!!</Text>
            </View>

            {/* Statistik */}
            <View className="mx-6 mt-6 flex-row items-center justify-between rounded-3xl border  bg-purple-800 p-4 py-4 text-white">
              <View className="items-center pl-4">
                <FontAwesome5 name="star" size={22} color="white" />
                <Text className="pt-1 text-sm font-bold tracking-wider text-gray-100 opacity-50">
                  QUEST
                </Text>
                <Text className="text-xl font-bold text-white">5</Text>
              </View>

              <View className="h-12 w-px bg-gray-400 opacity-30" />

              <View className="items-center">
                <Fontisto name="world-o" size={22} color="white" />
                <Text className="pt-1 text-sm font-bold tracking-wider text-gray-100 opacity-50">
                  SETS
                </Text>
                <Text className="text-whited text-xl font-bold text-white">25</Text>
              </View>

              <View className="h-12 w-px bg-gray-400 opacity-30" />

              <View className="items-center pr-4">
                <Text className="text-2xl font-black tracking-widest text-white">XP</Text>
                <Text className="text-sm font-bold tracking-wider text-gray-100 opacity-50">
                  DIDAPAT
                </Text>
                <Text className="text-xl font-bold text-white">+2500</Text>
              </View>
            </View>

            {/* Medals */}
            <View className="mx-10 mt-6 flex-row justify-between gap-4">
              <View className="items-center">
                {/* <Image 
                source={require('assets/medal_icon.png')} 
                className="w-10 h-10"
                resizeMode="contain"
              /> */}
                <FontAwesome5 name="medal" size={24} color="black" />
                <Text className="mt-2 text-sm">Jumlah Kalori </Text>
                <Text className="-mt-1 text-sm">Dibakar</Text>
              </View>
              <View className="items-center">
                {/* <Image 
                source={require('assets/medal_icon.png')} 
                className="w-10 h-10"
                resizeMode="contain"
              /> */}
                <FontAwesome5 name="medal" size={24} color="black" />
                <Text className="mt-2 text-sm">Jumlah Set </Text>
                <Text className="-mt-1 text-sm">Terbanyak</Text>
              </View>
              <View className="items-center">
                {/* <Image 
                source={require('assets/medal_icon.png')} 
                className="w-10 h-10"
                resizeMode="contain"
              /> */}
                <FontAwesome5 name="medal" size={24} color="black" />
                <Text className="mt-2 text-sm">Quest selesai</Text>
              </View>
            </View>
            <View className="mb-4 flex flex-row items-center justify-between pt-8">
              <View className="mx-6 flex flex-row gap-8">
                <View className="flex flex-row items-center gap-2">
                  <AntDesign name="hearto" size={16} color="black" />
                  <Text>121</Text>
                </View>
                <View className="flex flex-row items-center gap-2">
                  <FontAwesome name="comment-o" size={16} color="black" />
                  <Text>34</Text>
                </View>
              </View>
              <View className="mx-6 flex flex-row items-center gap-2">
                <Feather name="share" size={16} color="black" />
                <Text>Share</Text>
              </View>
            </View>
          </View>
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
