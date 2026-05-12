import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useMemo, useState } from 'react';
import { View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { styles } from './menu/menuStyles';
import {
  MenuDivider,
  MenuGroup,
  MenuHeader,
  LoginRow,
  LoginDialog,
} from './menu/components';
import { primaryItems, serviceItems } from './menu/data';
import { AuthenticatedUser, loginWithGoogleToken } from '../services/auth-api';

WebBrowser.maybeCompleteAuthSession();

type MenuScreenProps = {
  onClose: () => void;
  showLoginDialog?: boolean;
  dimmed?: boolean;
};

export const MenuScreen: React.FC<MenuScreenProps> = ({
  onClose,
  showLoginDialog = false,
  dimmed = false,
}) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(
    null,
  );

  const extra = Constants.expoConfig?.extra;

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      typeof extra?.googleExpoClientId === 'string'
        ? extra.googleExpoClientId
        : undefined,
    iosClientId:
      typeof extra?.googleIosClientId === 'string'
        ? extra.googleIosClientId
        : undefined,
    androidClientId:
      typeof extra?.googleAndroidClientId === 'string'
        ? extra.googleAndroidClientId
        : undefined,
    webClientId:
      typeof extra?.googleWebClientId === 'string'
        ? extra.googleWebClientId
        : undefined,
    scopes: ['profile', 'email'],
  });

  const dialogOpen = showLoginDialog || isLoginOpen;
  const dimMenu = dimmed || dialogOpen;

  useEffect(() => {
    const authenticate = async () => {
      if (response?.type !== 'success') {
        return;
      }

      const idToken =
        response.authentication?.idToken ??
        (typeof response.params?.id_token === 'string'
          ? response.params.id_token
          : undefined);

      if (!idToken) {
        setAuthError('Nao foi possivel obter o token do Google.');
        return;
      }

      setIsLoggingIn(true);
      setAuthError(null);

      try {
        const result = await loginWithGoogleToken(idToken);
        setCurrentUser(result.user);
        setIsLoginOpen(false);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Falha ao autenticar na API.';
        setAuthError(message);
      } finally {
        setIsLoggingIn(false);
      }
    };

    void authenticate();
  }, [response]);

  const loginLabel = useMemo(() => {
    if (currentUser?.name) {
      return `Ola, ${currentUser.name}!`;
    }

    return 'Ola. Faca seu login!';
  }, [currentUser]);

  const handleGoogleLogin = async () => {
    if (!request) {
      setAuthError('Configuracao do Google indisponivel no momento.');
      return;
    }

    setAuthError(null);
    await promptAsync();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.overlay}>
        <Pressable style={styles.overlayPressable} onPress={onClose} />
        <ScrollView
          contentContainerStyle={[
            styles.container,
            dimMenu && styles.containerDimmed,
          ]}
        >
          <MenuHeader onClose={onClose} />
          <LoginRow label={loginLabel} onPress={() => setIsLoginOpen(true)} />
          <MenuDivider />
          <MenuGroup items={primaryItems} />
          <MenuDivider />
          <MenuGroup items={serviceItems} />
        </ScrollView>
        {dialogOpen && (
          <View style={styles.dialogOverlay}>
            <Pressable
              style={styles.dialogBackdrop}
              onPress={() => setIsLoginOpen(false)}
            />
            <LoginDialog
              onGooglePress={handleGoogleLogin}
              loading={isLoggingIn}
              errorMessage={authError}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
