import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined; 
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Ntar dimasukin klo endpoin udh jadi
    console.log('Login attempted with:', { email, password });
    navigation.navigate('Home');
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 mt-[4rem]">
          {/* Header */}

          <View className="px-6 flex-row justify-between items-center mt-6">
            <TouchableOpacity 
              onPress={() => navigation.navigate('SplashScreen')} 
              className="p-2 rounded-full"
            >
              <View className="bg-gray-100 rounded-full p-2">
              <Image 
                source={require('assets/back_arrow.png')} 
                className="w-5 h-5"
                resizeMode="contain"
              />
              </View>
            </TouchableOpacity>
            <View className="flex-1" />
            </View>

          <View className="items-center">
            <Image 
              source={require('assets/logo-fitodyssey.png')}
              className="w-25 h-25 my-4"
              resizeMode="contain"
            />
            <Text className="text-2xl text-black font-bold text-center mt-2">
              Halo, Selamat Datang Kembali
            </Text>
            <Text className="text-base text-gray-500 text-center mt-1">
              silahkan login untuk melanjutkan
            </Text>
          </View>


          
          {/* Login Form */}
          <View className="px-6 mt-6">
            <View className="mb-4">
              <Text className="text-base font-medium text-gray-700 mb-2">Email</Text>
              <TextInput
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
                placeholder="Masukkan email anda"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View className="mb-6">
              <Text className="text-base font-medium text-gray-700 mb-2">Password</Text>
              <TextInput
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
                placeholder="Masukkan password anda"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity className="self-end mt-2">
                <Text className="text-purple-800 font-medium">Lupa Password?</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              className="w-full py-4 rounded-xl items-center mb-3 bg-purple-800"
              onPress={handleLogin}
            >
              <Text className="text-base font-bold text-white">Masuk</Text>
            </TouchableOpacity>
            
            <View className="flex-row justify-center items-center my-6">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-500">Atau login dengan</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>
            
            {/* WIP Oauth kalo jadi? */}
            
            <View className="flex-row justify-center mt-6 mb-10">
              <Text className="text-gray-600">Belum memiliki akun? </Text>
              <TouchableOpacity onPress={handleRegisterPress}>
                <Text className="text-purple-800 font-bold">Daftar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;