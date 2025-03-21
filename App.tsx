import { StatusBar } from 'expo-status-bar';
import React from 'react';

import './global.css';
import { AuthProvider } from '~/context/AuthContext';
import Navigation from '~/navigation';

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
