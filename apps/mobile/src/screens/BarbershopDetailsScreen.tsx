import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { LoginDialog } from './menu/components/LoginDialog';
import { loginWithEmail, registerWithEmail } from '../services/auth-api';

type Props = NativeStackScreenProps<RootStackParamList, 'BarbershopDetails'>;

export const BarbershopDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [barbershop, setBarbershop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { user, setUser, setToken } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleBook = (serviceId: string) => {
    if (!user) {
      setIsLoginOpen(true);
    } else {
      navigation.navigate('Booking', { barbershopId: barbershop.id, serviceId });
    }
  };

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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let host = 'localhost';
        if (Constants.expoConfig?.hostUri) {
          host = Constants.expoConfig.hostUri.split(':')[0];
          if (host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.')) {
            host = `${host}.nip.io`;
          }
        } else if (Platform.OS === 'android') {
          host = '10.0.2.2';
        }

        const response = await fetch(`http://${host}:3000/barbershops/${id}`);
        if (response.ok) {
          const data = await response.json();
          setBarbershop(data);
        }
      } catch (error) {
        console.error('Failed to fetch barbershop details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#8162FF" />
      </SafeAreaView>
    );
  }

  if (!barbershop) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Barbearia não encontrada.</Text>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView>
        <View style={styles.headerImageContainer}>
          <Image source={require('../../assets/images/barbearia.png')} style={{ width: '100%', height: '100%', position: 'absolute' }} resizeMode="cover" />
          <Pressable style={styles.backIcon} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={24} color="#FFF" />
          </Pressable>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{barbershop.name}</Text>
          <Text style={styles.address}>{barbershop.address}</Text>

          <Text style={styles.sectionTitle}>Serviços</Text>
          {barbershop.services?.map((service: any) => (
            <View key={service.id} style={styles.serviceCard}>
              <View>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDesc}>{service.description}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.servicePrice}>R$ {service.price}</Text>
                <Pressable
                  style={styles.bookButton}
                  onPress={() => handleBook(service.id)}
                >
                  <Text style={styles.bookButtonText}>Reservar</Text>
                </Pressable>
              </View>
            </View>
          ))}
          {(!barbershop.services || barbershop.services.length === 0) && (
            <Text style={styles.emptyText}>Nenhum serviço disponível.</Text>
          )}
        </View>
      </ScrollView>

      {isLoginOpen && (
        <View style={StyleSheet.absoluteFillObject}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }}>
            <Pressable
              style={StyleSheet.absoluteFillObject}
              onPress={() => setIsLoginOpen(false)}
            />
            <LoginDialog
              onLoginPress={handleLogin}
              onRegisterPress={handleRegister}
              loading={isLoggingIn}
              errorMessage={authError}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#141518' },
  center: { flex: 1, backgroundColor: '#141518', alignItems: 'center', justifyContent: 'center' },
  headerImageContainer: { height: 250, width: '100%', backgroundColor: '#26272B', position: 'relative' },
  backIcon: { position: 'absolute', top: 40, left: 20, width: 40, height: 40, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  backIconText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  infoContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  address: { fontSize: 14, color: '#838896', marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#838896', textTransform: 'uppercase', marginBottom: 16 },
  serviceCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1A1B1F', padding: 16, borderRadius: 10, marginBottom: 12 },
  serviceName: { fontSize: 16, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  serviceDesc: { fontSize: 12, color: '#838896', maxWidth: 200 },
  priceContainer: { alignItems: 'flex-end' },
  servicePrice: { fontSize: 16, fontWeight: 'bold', color: '#8162FF', marginBottom: 8 },
  bookButton: { backgroundColor: '#8162FF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  bookButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  emptyText: { color: '#838896', fontSize: 14, fontStyle: 'italic' },
  errorText: { color: '#FFF', fontSize: 16, marginBottom: 20 },
  backButton: { backgroundColor: '#8162FF', padding: 12, borderRadius: 8 },
  backButtonText: { color: '#FFF', fontWeight: 'bold' },
});
