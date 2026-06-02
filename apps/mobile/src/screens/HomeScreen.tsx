import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Platform, Text, Pressable, ActivityIndicator } from 'react-native';
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
        const data = await response.json();
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
      fetchBarbershops(searchQuery);
    }, [searchQuery])
  );

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
          title={user ? "Olá," : "Bem-vindo,"}
          highlight={user ? user.name : "Faça login"}
          subtitle="Sexta, 2 de Fevereiro"
        />
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <CategoryRow categories={categories} />
        <Banner
          titleLines={['Agende', 'nos melhores']}
          subtitle="com Barber Flash"
        />

        {userBookings.length > 0 && (
          <View style={styles.section}>
            <SectionTitle text="AGENDAMENTOS" />
            <ScheduleCard {...mockSchedule} />
          </View>
        )}

        <View style={styles.section}>
          <SectionTitle text="BARBEARIAS" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                    image={item.imageUrl && item.imageUrl.startsWith('http') ? { uri: item.imageUrl } : require('../../assets/images/barbearia.png')}
                  />
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>

        {/* <View style={styles.section}>
          <SectionTitle text="POPULARES" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {loading ? (
              <ActivityIndicator size="small" color="#8162FF" />
            ) : (
              filteredBarbershops.slice().reverse().map((item) => (
                <Pressable key={item.id} onPress={() => navigation.navigate('BarbershopDetails', { id: item.id })}>
                  <BarberCard
                    name={item.name}
                    address={item.address}
                    image={item.imageUrl}
                  />
                </Pressable>
              ))
            )}
          </ScrollView>
        </View> */}

        <Footer brand="Barber Flash" />
      </ScrollView>
      <MenuScreen visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </SafeAreaView>
  );
};
