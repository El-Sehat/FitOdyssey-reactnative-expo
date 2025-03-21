import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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

type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Ntar dimasukin klo endpoin udh jadi
    console.log('Login attempted with:', { email, password });
    navigation.navigate('MainApp');
  };

  const handleRegisterPress = () => {
    navigation.navigate('MainApp');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView className="mt-[4rem] flex-1">
          {/* Header */}

          <View className="mt-6 flex-row items-center justify-between px-6">
            <TouchableOpacity
              onPress={() => navigation.navigate('SplashScreen')}
              className="rounded-full p-2">
              <View className="rounded-full bg-gray-100 p-2">
                <Image
                  source={require('assets/back_arrow.png')}
                  className="h-5 w-5"
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
            <Text className="mt-2 text-center text-2xl font-bold text-black">
              Halo, Selamat Datang Kembali
            </Text>
            <Text className="mt-1 text-center text-base text-gray-500">
              silahkan login untuk melanjutkan
            </Text>
          </View>

          {/* Login Form */}
          <View className="mt-6 px-6">
            <View className="mb-4">
              <Text className="mb-2 text-base font-medium text-gray-700">Email</Text>
              <TextInput
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black"
                placeholder="Masukkan email anda"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="mb-6">
              <Text className="mb-2 text-base font-medium text-gray-700">Password</Text>
              <TextInput
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black"
                placeholder="Masukkan password anda"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity className="mt-2 self-end">
                <Text className="font-medium text-purple-800">Lupa Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="mb-3 w-full items-center rounded-xl bg-purple-800 py-4"
              onPress={handleLogin}>
              <Text className="text-base font-bold text-white">Masuk</Text>
            </TouchableOpacity>

            <View className="my-6 flex-row items-center justify-center">
              <View className="h-[1px] flex-1 bg-gray-300" />
              <Text className="mx-4 text-gray-500">Atau login dengan</Text>
              <View className="h-[1px] flex-1 bg-gray-300" />
            </View>

            {/* WIP Oauth kalo jadi? */}

            <View className="mb-10 mt-6 flex-row justify-center">
              <Text className="text-gray-600">Belum memiliki akun? </Text>
              <TouchableOpacity onPress={handleRegisterPress}>
                <Text className="font-bold text-purple-800">Daftar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
