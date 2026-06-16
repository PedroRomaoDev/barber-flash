import React, { useState, useCallback } from 'react';
import { ScrollView, View, Platform, Text, Pressable, ActivityIndicator, ImageSourcePropType } from 'react-native';
import barbeariaImg from '../../assets/images/barbearia.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { RootStackParamList } from '../navigation/RootNavigator';
import { assets } from './home/assets';
import { categories, BarberItem } from './home/data';

interface BookingItem {
  id: string;
  status: string;
  scheduledAt: string | number | Date;
  priceSnapshot: string | number;
  barbershop?: { name?: string; imageUrl?: string };
  service?: { name?: string };
  barber?: { user?: { name?: string } };
}
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
import Toast from 'react-native-toast-message';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [barbershops, setBarbershops] = useState<BarberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');

  const handleReservePress = (barbershopId: string) => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Faça seu login',
        text2: 'Você precisa estar logado para reservar.',
        position: 'bottom',
      });
    } else {
      navigation.navigate('BarbershopDetails', { id: barbershopId });
    }
  };

  const [userBookings, setUserBookings] = useState<BookingItem[]>([]);

  const fetchBookings = async () => {
    try {
      let host = 'localhost';
      if (Constants.expoConfig?.hostUri) {
        host = Constants.expoConfig.hostUri.split(':')[0];
      } else if (Platform.OS === 'android') {
        host = '10.0.2.2';
      }
      const response = await fetch(`http://${host}:3000/bookings/my-bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = (await response.json()) as BookingItem[];
        const activeBookings = data.filter((b: BookingItem) => b.status === 'PENDING' || b.status === 'CONFIRMED');
        setUserBookings(activeBookings);
      }
    } catch (error) {
      console.log('Failed to fetch bookings', error);
    }
  };

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
      void fetchBarbershops('');
      if (token) {
        void fetchBookings();
      }
    }, [token])
  );

  const getBarberImage = (imageUrl: unknown): ImageSourcePropType => {
    if (!imageUrl || typeof imageUrl !== 'string') return barbeariaImg;
    if (imageUrl.startsWith('http')) return { uri: imageUrl };
    if (imageUrl === 'barber1.svg' || imageUrl === 'barberOne') return assets.barberOne;
    if (imageUrl === 'barber2.svg' || imageUrl === 'barberTwo') return assets.barberTwo;
    if (imageUrl === 'barber3.svg' || imageUrl === 'barberThree') return assets.barberThree;
    if (imageUrl === 'barber4.svg' || imageUrl === 'barber.svg' || imageUrl === 'barberFour') return assets.barberFour;
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
          onBellPress={() => navigation.navigate('MyAppointments')} 
        />
        <Greeting
          title="Olá,"
          highlight={user ? `${user.name}!` : "Faça seu Login!"}
          subtitle="Sexta, 2 de Fevereiro"
        />
        <SearchBar 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
          onSearch={() => {
            if (searchQuery.trim()) {
              navigation.navigate('Search', { query: searchQuery.trim() });
            }
          }}
        />
        <CategoryRow 
          categories={categories} 
          onCategoryPress={(label) => navigation.navigate('Search', { query: label })}
        />
        <Banner
          titleLines={['Agende', 'nos melhores']}
          subtitle="com Flash Barber"
        />

        {!!user && (
          <View style={styles.section}>
            <SectionTitle text="AGENDAMENTOS" />
            {userBookings.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
                {userBookings.map((b: BookingItem) => {
                  const date = new Date(b.scheduledAt);
                  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                  return (
                    <Pressable key={b.id} style={{ marginRight: 12 }}>
                      <ScheduleCard 
                        status="Confirmado"
                        service={b.service?.name || 'Serviço'}
                        barberName={b.barbershop?.name || 'Barbearia'}
                        avatar={getBarberImage(b.barbershop?.imageUrl)}
                        month={monthNames[date.getMonth()]}
                        day={String(date.getDate()).padStart(2, '0')}
                        time={date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      />
                    </Pressable>
                  );
                })}
              </ScrollView>
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
                    onReservePress={() => handleReservePress(item.id)}
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
                    onReservePress={() => handleReservePress(item.id)}
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
