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

// Define your navigation types
type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const Register = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Ntar dimasukin klo endpoin udh jadi
    console.log('Registration attempted with:', { name, email, password, confirmPassword });
    if (password === confirmPassword) {
      navigation.navigate('Login');
    } else {
      console.log('Passwords do not match');
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
        className="flex-1"
      >
        <ScrollView className="flex-1 mt-[4rem]">
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

          {/* Header dengan logo */}
          <View className="items-center">
            <Image 
              source={require('assets/logo-fitodyssey.png')}
              className="w-25 h-25 my-4"
              resizeMode="contain"
            />
            <Text className="text-2xl text-black font-bold text-center mt-2">
              Buat akun
            </Text>
            <Text className="text-base text-gray-500 text-center mt-1">
              Start your fitness journey today
            </Text>
          </View>
          
          {/* Registration Form */}
          <View className="px-6 mt-2">
            <View className="mb-4">
              <Text className="text-base font-medium text-gray-700 mb-2">Nama</Text>
              <TextInput
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
                placeholder="Masukkan nama anda"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
            </View>
            
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
            
            <View className="mb-4">
              <Text className="text-base font-medium text-gray-700 mb-2">Password</Text>
              <TextInput
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
                placeholder="Masukkan password anda"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            
            <View className="mb-6">
              <Text className="text-base font-medium text-gray-700 mb-2">Confirm Password</Text>
              <TextInput
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black"
                placeholder="Masukkan kembali password anda"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
            
            <TouchableOpacity
              className="w-full py-4 rounded-xl items-center mb-3 bg-purple-800"
              onPress={handleRegister}
            >
              <Text className="text-base font-bold text-white">Daftar</Text>
            </TouchableOpacity>
            
            <View className="flex-row justify-center items-center my-6">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="mx-4 text-gray-500">Atau masuk dengan</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>
            
            {/* Ntar dimasukin klo endpoin udh jadi */}
            
            <View className="flex-row justify-center mt-6 mb-10">
              <Text className="text-gray-600">Sudah memiliki akun? </Text>
              <TouchableOpacity onPress={handleLoginPress}>
                <Text className="text-purple-800 font-bold">Masuk</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
