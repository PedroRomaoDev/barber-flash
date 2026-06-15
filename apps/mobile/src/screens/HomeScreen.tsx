import React, { useState, useCallback } from 'react';
import { ScrollView, View, Platform, Text, Pressable, ActivityIndicator, ImageSourcePropType } from 'react-native';
import barbeariaImg from '../../assets/images/barbearia.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { RootStackParamList } from '../navigation/RootNavigator';
import { assets } from './home/assets';
import { categories, BarberItem, mockSchedule } from './home/data';
import { styles } from './home/homeStyles';
import {
  Banner,
  BarberCard,
  CategoryRow,
  Footer,
  Greeting,
  HomeHeader,
  ScheduleCard,
  SearchBar,
  SectionTitle,
} from './home/components';
import { MenuScreen } from './MenuScreen';
import { useAuth } from '../contexts/AuthContext';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [barbershops, setBarbershops] = useState<BarberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

  // mock active schedules for now based on user auth, 
  // until we implement real bookings. The user requested to hide if none exists.
  const userBookings = user ? [] : []; // Empty array means no mock schedules

  const fetchBarbershops = async (query = '') => {
    try {
      setLoading(true);
      let host = 'localhost';
      if (Constants.expoConfig?.hostUri) {
        host = Constants.expoConfig.hostUri.split(':')[0];
      } else if (Platform.OS === 'android') {
        host = '10.0.2.2';
      }

      const url = `http://${host}:3000/barbershops${query ? `?search=${encodeURIComponent(query)}` : ''}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = (await response.json()) as BarberItem[];
        setBarbershops(data);
      }
    } catch (err) {
      console.log('API fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      void fetchBarbershops(searchQuery);
    }, [searchQuery])
  );

  const getBarberImage = (imageUrl: unknown): ImageSourcePropType => {
    if (!imageUrl || typeof imageUrl !== 'string') return barbeariaImg;
    if (imageUrl.startsWith('http')) return { uri: imageUrl };
    if (imageUrl === 'barberOne') return assets.barberOne;
    if (imageUrl === 'barberTwo') return assets.barberTwo;
    if (imageUrl === 'barberThree') return assets.barberThree;
    if (imageUrl === 'barberFour') return assets.barberFour;
    return barbeariaImg;
  };

  const getPopularBarbershops = () => {
    const order = ['Los Barberos', 'Homem Elegante', 'Vintage Barber', 'Clássica Cortez'];
    return [...barbershops].sort((a, b) => {
      const idxA = order.indexOf(a.name);
      const idxB = order.indexOf(b.name);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  };

  const filteredBarbershops = barbershops;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHeader 
          onMenuPress={() => setMenuOpen(true)} 
          showBell={!!user} 
          onBellPress={() => navigation.navigate('BarberAppointments')} 
        />
        <Greeting
          title="Olá,"
          highlight={user ? `${user.name}!` : "Faça seu Login!"}
          subtitle="Sexta, 2 de Fevereiro"
        />
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <CategoryRow categories={categories} />
        <Banner
          titleLines={['Agende', 'nos melhores']}
          subtitle="com Flash Barber"
        />

        {!!user && (
          <View style={styles.section}>
            <SectionTitle text="AGENDAMENTOS" />
            {userBookings.length > 0 ? (
              <ScheduleCard {...mockSchedule} />
            ) : (
              <Text style={{ color: '#838896', fontSize: 14, fontFamily: 'Nunito_400Regular', marginLeft: 20 }}>
                Você não possui agendamentos.
              </Text>
            )}
          </View>
        )}

        <View style={styles.section}>
          <SectionTitle text="RECOMENDADOS" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
            {loading ? (
              <ActivityIndicator size="small" color="#8162FF" />
            ) : filteredBarbershops.length === 0 ? (
              <Text style={{ color: '#838896', marginLeft: 20 }}>Nenhuma barbearia encontrada.</Text>
            ) : (
              filteredBarbershops.map((item) => (
                <Pressable key={item.id} onPress={() => navigation.navigate('BarbershopDetails', { id: item.id })}>
                  <BarberCard
                    name={item.name}
                    address={item.address}
                    image={getBarberImage(item.imageUrl)}
                  />
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionTitle text="POPULARES" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
            {loading ? (
              <ActivityIndicator size="small" color="#8162FF" />
            ) : filteredBarbershops.length === 0 ? (
              <Text style={{ color: '#838896', marginLeft: 20 }}>Nenhuma barbearia encontrada.</Text>
            ) : (
              getPopularBarbershops().map((item) => (
                <Pressable key={item.id} onPress={() => navigation.navigate('BarbershopDetails', { id: item.id })}>
                  <BarberCard
                    name={item.name}
                    address={item.address}
                    image={getBarberImage(item.imageUrl)}
                  />
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>

        <Footer brand="Flash Barber" />
      </ScrollView>
      <MenuScreen visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </SafeAreaView>
  );
};
