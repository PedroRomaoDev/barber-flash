import React from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { StripeProvider } from './utils/stripe';

import NunitoFont from '../assets/fonts/Nunito-Variable.ttf';

export default function App() {
   
  const [fontsLoaded] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    Nunito_300Light: NunitoFont,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    Nunito_400Regular: NunitoFont,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    Nunito_700Bold: NunitoFont,
  });

  if (!fontsLoaded) {
    return <View />;
  }

   
  const stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey={stripeKey}>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </StripeProvider>
    </SafeAreaProvider>
  );
}
