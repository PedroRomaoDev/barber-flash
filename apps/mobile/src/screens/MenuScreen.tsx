import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, ScrollView, Pressable, Platform, Text, Animated, PanResponder, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './menu/menuStyles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import Constants from 'expo-constants';
import {
  MenuDivider,
  MenuGroup,
  MenuHeader,
  LoginRow,
  LoginDialog,
} from './menu/components';
import { primaryItems, serviceItems } from './menu/data';

import { loginWithEmail, registerWithEmail } from '../services/auth-api';
import { useAuth } from '../contexts/AuthContext';

type MenuScreenProps = {
  visible?: boolean;
  onClose: () => void;
  showLoginDialog?: boolean;
  dimmed?: boolean;
};

export const MenuScreen: React.FC<MenuScreenProps> = ({
  visible = true,
  onClose,
  showLoginDialog = false,
  dimmed = false,
}) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { user, setUser, setToken } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [ownedShopsCount, setOwnedShopsCount] = useState(0);
  const slideAnim = useRef(new Animated.Value(300)).current; // Start hidden

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();

      if (user) {
        const fetchOwnedShops = async () => {
          try {
            let host = 'localhost';
            if (Constants.expoConfig?.hostUri) {
              host = Constants.expoConfig.hostUri.split(':')[0];
            } else if (Platform.OS === 'android') {
              host = '10.0.2.2';
            }
            const res = await fetch(`http://${host}:3000/barbershops?ownerId=${user.id}`);
            if (res.ok) {
              const data = await res.json();
              setOwnedShopsCount(data.length);
            }
          } catch (e) {
            console.error(e);
          }
        };
        fetchOwnedShops();
      }
    }
  }, [visible, user]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dx > 20; // Only capture if swiping right
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50 || gestureState.vx > 0.5) {
          handleClose();
        }
      },
    })
  ).current;

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const dialogOpen = showLoginDialog || isLoginOpen || isLogoutConfirmOpen;
  const dimMenu = dimmed || dialogOpen;

  const handleLogin = async (email: string, pass: string) => {
    setAuthError(null);
    setIsLoggingIn(true);
    try {
      const res = await loginWithEmail(email, pass);
      setUser(res.user);
      setToken(res.accessToken);
      setIsLoginOpen(false);
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Erro ao fazer login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (name: string, email: string, pass: string) => {
    setAuthError(null);
    setIsLoggingIn(true);
    try {
      const res = await registerWithEmail(name, email, pass);
      setUser(res.user);
      setToken(res.accessToken);
      setIsLoginOpen(false);
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Erro ao cadastrar');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    setIsLogoutConfirmOpen(false);
    setUser(null);
    setToken(null);
    setOwnedShopsCount(0);
  };

  const loginLabel = useMemo(() => {
    if (user?.name) {
      return `Olá, ${user.name}!`;
    }
    return 'Olá. Faça seu login!';
  }, [user]);

  // Extend menu items dynamically based on auth
  const dynamicPrimaryItems = [...primaryItems];
  if (user) {
    dynamicPrimaryItems.push({ id: 'my-appointments', label: 'Meus Agendamentos', icon: 'calendar' });
    dynamicPrimaryItems.push({ id: 'register-barbershop', label: 'Cadastrar Barbearia', icon: 'briefcase' });
    if (ownedShopsCount > 0) {
      dynamicPrimaryItems.push({ id: 'register-service', label: 'Cadastrar Serviço', icon: 'scissors' });
    }
    dynamicPrimaryItems.push({ id: 'register-barber', label: 'Cadastrar Barbeiro', icon: 'user-plus' });
    dynamicPrimaryItems.push({ id: 'logout', label: 'Sair', icon: 'log-out' });
  }

  const handleAction = (id: string) => {
    if (id === 'logout') handleLogout();
    if (id === 'register-barbershop') {
      navigation.navigate('RegisterBarbershop');
    }
    if (id === 'register-service') {
      navigation.navigate('RegisterService');
    }
    if (id === 'register-barber') {
      navigation.navigate('RegisterBarber');
    }
    if (id === 'my-appointments') {
      navigation.navigate('MyAppointments');
    }
  };

  if (!visible && slideAnim.addListener === undefined) {
    return null; // fallback
  }

  return (
    <View 
      style={[
        StyleSheet.absoluteFillObject, 
        { zIndex: 100, elevation: 100 }, 
        !visible && { opacity: 0 }
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <SafeAreaView style={styles.screen}>
        <View style={styles.overlay}>
          <Pressable style={styles.dialogBackdrop} onPress={handleClose} />
          <Animated.View
            {...panResponder.panHandlers}
            style={[{ flex: 1, backgroundColor: '#141518' }, { transform: [{ translateX: slideAnim }] }]}
          >
            <ScrollView
              contentContainerStyle={[
                styles.container,
                dimMenu && styles.containerDimmed,
              ]}
            >
              <MenuHeader onClose={handleClose} />
              {!user ? (
                <LoginRow label={loginLabel} onPress={() => setIsLoginOpen(true)} />
              ) : (
                <View style={{ paddingVertical: 24 }}>
                  <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>{loginLabel}</Text>
                </View>
              )}
              <MenuDivider />
              <MenuGroup items={dynamicPrimaryItems} onAction={handleAction} />
              <MenuDivider />

            </ScrollView>
          </Animated.View>
          {dialogOpen && (
            <View style={styles.dialogOverlay}>
              <Pressable
                style={styles.dialogBackdrop}
                onPress={() => {
                  setIsLoginOpen(false);
                  setIsLogoutConfirmOpen(false);
                }}
              />
              {isLoginOpen && (
                <LoginDialog
                  onLoginPress={handleLogin}
                  onRegisterPress={handleRegister}
                  loading={isLoggingIn}
                  errorMessage={authError}
                />
              )}
              {isLogoutConfirmOpen && (
                <View style={styles.dialogCard}>
                  <View style={styles.dialogTextGroup}>
                    <Text style={styles.dialogTitle}>Deseja realmente sair?</Text>
                    <Text style={styles.dialogSubtitle}>Você precisará fazer login novamente para acessar seus dados.</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                    <Pressable style={[styles.dialogButton, { flex: 1 }]} onPress={() => setIsLogoutConfirmOpen(false)}>
                      <Text style={styles.dialogButtonText}>Cancelar</Text>
                    </Pressable>
                    <Pressable style={[styles.dialogButton, { flex: 1, backgroundColor: '#FF4E4E', borderColor: '#FF4E4E' }]} onPress={confirmLogout}>
                      <Text style={styles.dialogButtonText}>Sair</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};
