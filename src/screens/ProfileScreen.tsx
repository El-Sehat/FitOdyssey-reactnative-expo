import { FontAwesome5, Fontisto } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const iconProfileSize = screenWidth * 0.25;

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 rounded-3xl bg-purple-900 p-4 pt-20">
        <View className="absolute inset-0 z-50 items-center pt-[3.5em]">
          <View className="border-3 h-32 w-32 items-center justify-center rounded-full border border-purple-900 bg-purple-900">
            <FontAwesome5 name="user-circle" size={iconProfileSize} color="white" />
          </View>
        </View>
        <View className="mx-4 flex-1 flex-col rounded-3xl bg-white">
          <View className="flex h-[25%] w-full items-center justify-end">
            <View className="relative flex flex-row justify-center gap-2">
              <Text className=" items-center justify-center text-2xl font-extrabold text-black">
                Vincent Marceto
              </Text>
              <FontAwesome5
                name="pen"
                size={iconProfileSize * 0.15}
                color="purple"
                className="absolute -right-6"
              />
            </View>

            <Text className=" whitespace-normal px-10 text-center font-medium leading-relaxed text-gray-400">
              Gymnassium enjoyer, Loves to work out, Pondok Cina
            </Text>
          </View>
          <View className="mx-6 mt-6 flex-row items-center justify-between rounded-[3rem] border  bg-purple-800 p-4 py-2 text-white">
            <View className="items-center pl-4">
              <FontAwesome5 name="star" size={22} color="white" />
              <Text className=" text-sm font-bold tracking-wider text-gray-100 opacity-50">
                QUEST
              </Text>
              <Text className="text-xl font-bold text-white">5</Text>
            </View>

            <View className="h-12 w-px bg-gray-400 opacity-30" />

            <View className="items-center">
              <Fontisto name="world-o" size={22} color="white" />
              <Text className="text-sm font-bold tracking-wider text-gray-100 opacity-50">
                TEMAN
              </Text>
              <Text className="text-whited text-xl font-bold text-white">25</Text>
            </View>

            <View className="h-12 w-px bg-gray-400 opacity-30" />
            <View className="-mb-3 items-center pr-4">
              <Text className="text-xl font-black tracking-widest text-white">LEVEL</Text>
              <Text className=" pt-1 text-xl font-bold text-white">89</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
