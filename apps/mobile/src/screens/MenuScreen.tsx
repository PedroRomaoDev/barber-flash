import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, ScrollView, Pressable, Platform, Text, Animated, PanResponder, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './menu/menuStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import { serviceItems } from './menu/data';

import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

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
  const toast = useToast();

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
              const data = (await res.json()) as { length: number };
              setOwnedShopsCount(data.length);
            }
          } catch (e) {
            console.error(e);
          }
        };
        void fetchOwnedShops();
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

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsLoggingIn(true);
    try {
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));
      
      setUser({
        id: '1',
        name: 'Pedro Gonçalves',
        email: 'pedrogoncalves@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'USER',
      });
      setToken('mock-google-token');
      setIsLoginOpen(false);
      toast.show({ message: 'Login realizado com sucesso!', type: 'success' });
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Erro ao fazer login com Google';
      setAuthError(errorMsg);
      toast.show({ message: errorMsg, type: 'error' });
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
    toast.show({ message: 'Logout realizado com sucesso!', type: 'info' });
  };

  const route = useRoute();
  const currentRouteName = route.name || 'Home';

  // Extend menu items dynamically based on auth
  const dynamicPrimaryItems = useMemo(() => {
    const items = [
      { id: 'home', label: 'Início', icon: 'home', active: currentRouteName === 'Home' },
      { id: 'my-appointments', label: 'Agendamentos', icon: 'calendar', active: currentRouteName === 'MyAppointments' },
    ];

    if (user) {
      items.push({ id: 'register-barbershop', label: 'Cadastrar Barbearia', icon: 'briefcase', active: currentRouteName === 'RegisterBarbershop' });
      if (ownedShopsCount > 0) {
        items.push({ id: 'register-service', label: 'Cadastrar Serviço', icon: 'scissors', active: currentRouteName === 'RegisterService' });
      }
      items.push({ id: 'register-barber', label: 'Cadastrar Barbeiro', icon: 'user-plus', active: currentRouteName === 'RegisterBarber' });
    }

    return items;
  }, [user, ownedShopsCount, currentRouteName]);

  const handleAction = (id: string) => {
    onClose();
    if (id === 'home') {
      navigation.navigate('Home');
    }
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
      if (!user) {
        setIsLoginOpen(true);
      } else {
        navigation.navigate('MyAppointments');
      }
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
          <Pressable style={styles.overlayPressable} onPress={handleClose} />
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
                <LoginRow label="Olá. Faça seu login!" onPress={() => setIsLoginOpen(true)} />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 24 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#26272B', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    {user.avatarUrl ? (
                      <Image source={{ uri: user.avatarUrl }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                      <Feather name="user" size={24} color="#838896" />
                    )}
                  </View>
                  <View style={{ gap: 4 }}>
                    <Text style={{ color: '#FFF', fontSize: 16, fontFamily: 'Nunito_700Bold' }}>{user.name}</Text>
                    <Text style={{ color: '#838896', fontSize: 12, fontFamily: 'Nunito_400Regular' }}>{user.email}</Text>
                  </View>
                </View>
              )}
              <MenuDivider />
              <MenuGroup items={dynamicPrimaryItems} onAction={handleAction} />
              
              <MenuDivider />
              <MenuGroup items={serviceItems} />

              {!!user && (
                <>
                  <MenuDivider />
                  <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
                    <Pressable 
                      style={[styles.menuButton, { flexDirection: 'row', alignItems: 'center', gap: 12 }]} 
                      onPress={handleLogout}
                    >
                      <Feather name="log-out" size={16} color="#838896" />
                      <Text style={[styles.menuLabel, { color: '#838896' }]}>Sair da conta</Text>
                    </Pressable>
                  </View>
                </>
              )}

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
                  onGooglePress={() => { void handleGoogleLogin(); }}
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
