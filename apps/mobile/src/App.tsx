import React from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './navigation/RootNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { StripeProvider } from './utils/stripe';

import { ToastProvider } from './contexts/ToastContext';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

import NunitoFont from '../assets/fonts/Nunito-Variable.ttf';

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#8162FF', backgroundColor: '#1A1B1F', borderColor: '#26272B', borderWidth: 1 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: '#FFFFFF'
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: 'Nunito_400Regular',
        color: '#838896'
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#EF4444', backgroundColor: '#1A1B1F', borderColor: '#26272B', borderWidth: 1 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: '#FFFFFF'
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: 'Nunito_400Regular',
        color: '#838896'
      }}
    />
  ),
};

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
          <ToastProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
            <Toast config={toastConfig} />
          </ToastProvider>
        </AuthProvider>
      </StripeProvider>
    </SafeAreaProvider>
  );
}
