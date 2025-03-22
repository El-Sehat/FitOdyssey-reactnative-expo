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
  ActivityIndicator,
  Alert,
} from 'react-native';

import { authService } from '../services/AuthService';

type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const Register = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Validasi dasar, perlu ditambahkan validasi lain biar lebih aman
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({ name, email, password });
      Alert.alert('Registration Successful', 'Your account has been created successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        error.message || 'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView className="mt-[4rem] flex-1">
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

          {/* Header dengan logo */}
          <View className="items-center">
            <Image
              source={require('assets/logo-fitodyssey.png')}
              className="w-25 h-25 my-4"
              resizeMode="contain"
            />
            <Text className="mt-2 text-center text-2xl font-bold text-black">Buat akun</Text>
            <Text className="mt-1 text-center text-base text-gray-500">
              Start your fitness journey today
            </Text>
          </View>

          {/* Registration Form */}
          <View className="mt-2 px-6">
            <View className="mb-4">
              <Text className="mb-2 text-base font-medium text-gray-700">Nama</Text>
              <TextInput
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black"
                placeholder="Masukkan nama anda"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
            </View>

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
                editable={!isLoading}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-base font-medium text-gray-700">Password</Text>
              <TextInput
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black"
                placeholder="Masukkan password anda"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <View className="mb-6">
              <Text className="mb-2 text-base font-medium text-gray-700">Confirm Password</Text>
              <TextInput
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black"
                placeholder="Masukkan kembali password anda"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              className={`mb-3 w-full items-center rounded-xl ${isLoading ? 'bg-purple-600' : 'bg-purple-800'} py-4`}
              onPress={handleRegister}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-bold text-white">Daftar</Text>
              )}
            </TouchableOpacity>

            <View className="my-6 flex-row items-center justify-center">
              <View className="h-[1px] flex-1 bg-gray-300" />
              <Text className="mx-4 text-gray-500">Atau masuk dengan</Text>
              <View className="h-[1px] flex-1 bg-gray-300" />
            </View>

            {/* Ntar dimasukin klo endpoin udh jadi */}

            <View className="mb-10 mt-6 flex-row justify-center">
              <Text className="text-gray-600">Sudah memiliki akun? </Text>
              <TouchableOpacity onPress={handleLoginPress} disabled={isLoading}>
                <Text className="font-bold text-purple-800">Masuk</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
