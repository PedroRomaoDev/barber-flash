import React, { useEffect, useState } from 'react';
import barbeariaImg from '../../assets/images/barbearia.png';
import { View, Text, StyleSheet, ActivityIndicator, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { LoginDialog } from './menu/components/LoginDialog';

type Props = NativeStackScreenProps<RootStackParamList, 'BarbershopDetails'>;

interface Service {
  id: string;
  name: string;
  description: string;
  price: string | number;
  imageUrl?: string;
}

interface BarbershopDetails {
  id: string;
  name: string;
  address: string;
  services: Service[];
  imageUrl?: string;
}

export const BarbershopDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [barbershop, setBarbershop] = useState<BarbershopDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const { user, setUser, setToken } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const toast = useToast();

  const handleBook = (serviceId: string) => {
    if (!user) {
      setIsLoginOpen(true);
    } else if (barbershop) {
      navigation.navigate('Booking', { barbershopId: barbershop.id, serviceId });
    }
  };

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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let host = 'localhost';
        if (Constants.expoConfig?.hostUri) {
          host = Constants.expoConfig.hostUri.split(':')[0];
        } else if (Platform.OS === 'android') {
          host = '10.0.2.2';
        }

        const response = await fetch(`http://${host}:3000/barbershops/${id}`);
        if (response.ok) {
          const data = (await response.json()) as BarbershopDetails;
          setBarbershop(data);
        }
      } catch (error) {
        console.error('Failed to fetch barbershop details', error);
      } finally {
        setLoading(false);
      }
    };
    void fetchDetails();
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
    <View style={styles.screen}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Header Image with Gradient Overlay */}
        <View style={styles.headerImageContainer}>
          <Image 
            source={barbeariaImg} 
            style={styles.headerImage} 
            resizeMode="cover" 
          />
          <LinearGradient
            colors={['transparent', 'rgba(20, 21, 24, 0.8)', '#141518']}
            style={StyleSheet.absoluteFillObject}
          />
          
          <SafeAreaView edges={['top']} style={styles.headerActions}>
            <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
              <Feather name="chevron-left" size={24} color="#FFF" />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Feather name="menu" size={24} color="#FFF" />
            </Pressable>
          </SafeAreaView>
        </View>

        <View style={styles.contentContainer}>
          {/* Barbershop Info Block */}
          <View style={styles.infoBlock}>
            <Text style={styles.title}>{barbershop.name}</Text>
            
            <View style={styles.infoRow}>
              <Feather name="map-pin" size={16} color="#8162FF" />
              <Text style={styles.infoText}>{barbershop.address}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Feather name="star" size={16} color="#8162FF" />
              <Text style={styles.infoText}>5,0 (889 avaliações)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Sobre Nós Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SOBRE NÓS</Text>
            <Text style={styles.aboutText}>
              Bem-vindo à Vintage Barber, onde tradição encontra estilo. Nossa equipe de mestres barbeiros transforma cortes de cabelo e barbas em obras de arte. Em um ambiente acolhedor, promovemos confiança, estilo e uma comunidade unida.
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Serviços Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SERVIÇOS</Text>
            {barbershop.services?.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <Image source={barbeariaImg} style={styles.serviceImage} />
                <View style={styles.serviceContent}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDesc} numberOfLines={2}>
                    {service.description}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.servicePrice}>
                      R$ {Number(service.price).toFixed(2).replace('.', ',')}
                    </Text>
                    <Pressable
                      style={styles.bookButton}
                      onPress={() => handleBook(service.id)}
                    >
                      <Text style={styles.bookButtonText}>Reservar</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
            {(!barbershop.services || barbershop.services.length === 0) && (
              <Text style={styles.emptyText}>Nenhum serviço disponível.</Text>
            )}
          </View>

          <View style={styles.divider} />

          {/* Contato Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONTATO</Text>
            <View style={styles.contactRow}>
              <View style={styles.contactLeft}>
                <Feather name="smartphone" size={20} color="#FFF" />
                <Text style={styles.contactNumber}>(11) 98204-5108</Text>
              </View>
              <Pressable style={styles.copyButton}>
                <Text style={styles.copyButtonText}>Copiar</Text>
              </Pressable>
            </View>
            <View style={styles.contactRow}>
              <View style={styles.contactLeft}>
                <Feather name="smartphone" size={20} color="#FFF" />
                <Text style={styles.contactNumber}>(11) 99503-2351</Text>
              </View>
              <Pressable style={styles.copyButton}>
                <Text style={styles.copyButtonText}>Copiar</Text>
              </Pressable>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2026 Copyright Flash Barber</Text>
          </View>
        </View>
      </ScrollView>

      {isLoginOpen && (
        <View style={StyleSheet.absoluteFillObject}>
          <View style={styles.loginOverlay}>
            <Pressable
              style={StyleSheet.absoluteFillObject}
              onPress={() => setIsLoginOpen(false)}
            />
            <LoginDialog
              onGooglePress={() => { void handleGoogleLogin(); }}
              loading={isLoggingIn}
              errorMessage={authError}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#141518' },
  center: { flex: 1, backgroundColor: '#141518', alignItems: 'center', justifyContent: 'center' },
  
  headerImageContainer: { height: 280, width: '100%', position: 'relative' },
  headerImage: { width: '100%', height: '100%', position: 'absolute' },
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  iconButton: { width: 44, height: 44, backgroundColor: 'rgba(26, 27, 31, 0.6)', borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  
  contentContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  
  infoBlock: { marginTop: -20 },
  title: { fontSize: 22, fontFamily: 'Nunito_700Bold', color: '#FFFFFF', marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { fontSize: 14, fontFamily: 'Nunito_400Regular', color: '#838896', marginLeft: 8 },
  
  divider: { height: 1, backgroundColor: '#26272B', marginVertical: 24 },
  
  section: { marginBottom: 0 },
  sectionTitle: { fontSize: 12, fontFamily: 'Nunito_700Bold', color: '#838896', marginBottom: 16, letterSpacing: 0.5 },
  
  aboutText: { fontSize: 14, fontFamily: 'Nunito_400Regular', color: '#E8E8E8', lineHeight: 22 },
  
  serviceCard: { flexDirection: 'row', backgroundColor: '#1A1B1F', borderRadius: 12, borderColor: '#26272B', borderWidth: 1, padding: 12, marginBottom: 16 },
  serviceImage: { width: 90, height: 90, borderRadius: 8 },
  serviceContent: { flex: 1, paddingLeft: 16, justifyContent: 'space-between' },
  serviceName: { fontSize: 14, fontFamily: 'Nunito_700Bold', color: '#FFFFFF', marginBottom: 4 },
  serviceDesc: { fontSize: 12, fontFamily: 'Nunito_400Regular', color: '#838896', lineHeight: 18 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  servicePrice: { fontSize: 14, fontFamily: 'Nunito_700Bold', color: '#8162FF' },
  bookButton: { backgroundColor: '#26272B', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8 },
  bookButtonText: { color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 12 },
  
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  contactLeft: { flexDirection: 'row', alignItems: 'center' },
  contactNumber: { color: '#FFFFFF', fontFamily: 'Nunito_400Regular', fontSize: 14, marginLeft: 12 },
  copyButton: { backgroundColor: '#1A1B1F', borderColor: '#26272B', borderWidth: 1, paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8 },
  copyButtonText: { color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 12 },
  
  footer: { alignItems: 'center', marginTop: 20 },
  footerText: { color: '#838896', fontFamily: 'Nunito_400Regular', fontSize: 12 },
  
  emptyText: { color: '#838896', fontSize: 14, fontStyle: 'italic', fontFamily: 'Nunito_400Regular' },
  errorText: { color: '#FFF', fontSize: 16, marginBottom: 20, fontFamily: 'Nunito_700Bold' },
  backButton: { backgroundColor: '#8162FF', padding: 12, borderRadius: 8 },
  backButtonText: { color: '#FFF', fontFamily: 'Nunito_700Bold' },
  
  loginOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
});
