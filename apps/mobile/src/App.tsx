import React from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { HomeScreen } from './screens/HomeScreen';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_300Light: require('../assets/fonts/Nunito-Variable.ttf'),
    Nunito_400Regular: require('../assets/fonts/Nunito-Variable.ttf'),
    Nunito_700Bold: require('../assets/fonts/Nunito-Variable.ttf'),
    // Adicione Horizon-Regular.ttf em assets/fonts e habilite aqui.
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return <HomeScreen />;
}
