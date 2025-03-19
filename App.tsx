import React from 'react';
import { StatusBar } from 'expo-status-bar';
import './global.css';
import Navigation from '~/navigation';

export default function App() {
  return (
    <>
      <Navigation />
      <StatusBar style="auto" />
    </>
  );
}
