import React from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_300Light: require('../assets/fonts/Nunito-Variable.ttf'),
    Nunito_400Regular: require('../assets/fonts/Nunito-Variable.ttf'),
    Nunito_700Bold: require('../assets/fonts/Nunito-Variable.ttf'),
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
