import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { RootStackParamList } from '../navigation/RootNavigator';
import { styles } from './home/homeStyles';
import { HomeHeader, SearchBar, BarberCard } from './home/components';
import { BarberItem } from './home/data';
import { assets } from './home/assets';
import barbeariaImg from '../../assets/images/barbearia.png';
import { MenuScreen } from './MenuScreen';
import { useAuth } from '../contexts/AuthContext';
import { ImageSourcePropType } from 'react-native';
import Toast from 'react-native-toast-message';

type SearchScreenProps = NativeStackScreenProps<RootStackParamList, 'Search'>;

export const SearchScreen: React.FC<SearchScreenProps> = ({ route, navigation }) => {
  const { query } = route.params;
  const [searchQuery, setSearchQuery] = useState(query);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<BarberItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

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

  const fetchResults = async (q: string) => {
    try {
      setLoading(true);
      let host = 'localhost';
      if (Constants.expoConfig?.hostUri) {
        host = Constants.expoConfig.hostUri.split(':')[0];
      } else if (Platform.OS === 'android') {
        host = '10.0.2.2';
      }
      const res = await fetch(`http://${host}:3000/barbershops${q ? `?search=${q}` : ''}`);
      if (res.ok) {
        const data = await res.json() as BarberItem[];
        setResults(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchResults(query);
  }, [query]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      void fetchResults(searchQuery.trim());
    }
  };

  const getBarberImage = (imageUrl: unknown): ImageSourcePropType => {
    if (!imageUrl || typeof imageUrl !== 'string') return barbeariaImg;
    if (imageUrl.startsWith('http')) return { uri: imageUrl };
    if (imageUrl === 'barber1.svg' || imageUrl === 'barberOne') return assets.barberOne;
    if (imageUrl === 'barber2.svg' || imageUrl === 'barberTwo') return assets.barberTwo;
    if (imageUrl === 'barber3.svg' || imageUrl === 'barberThree') return assets.barberThree;
    if (imageUrl === 'barber4.svg' || imageUrl === 'barber.svg' || imageUrl === 'barberFour') return assets.barberFour;
    return barbeariaImg;
  };

  const renderItem = ({ item }: { item: BarberItem }) => (
    <Pressable onPress={() => navigation.navigate('BarbershopDetails', { id: item.id })}>
      <BarberCard
        name={item.name}
        address={item.address}
        image={getBarberImage(item.imageUrl)}
        onReservePress={() => handleReservePress(item.id)}
      />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader 
        onMenuPress={() => setMenuOpen(true)} 
        showBell={!!user} 
        onBellPress={() => navigation.navigate('BarberAppointments')} 
      />
      
      <View style={{ paddingTop: 24, paddingBottom: 24 }}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
          onSearch={handleSearch}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Nunito_700Bold', fontSize: 12, color: '#838896', marginBottom: 24, marginLeft: 20, textTransform: 'uppercase' }}>
          RESULTADOS PARA "{searchQuery}"
        </Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#8162FF" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={renderItem}
            columnWrapperStyle={{ justifyContent: 'center', gap: 0 }}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={
              <Text style={{ color: '#838896', textAlign: 'center', marginTop: 40 }}>
                Nenhuma barbearia encontrada.
              </Text>
            }
          />
        )}
      </View>
      <MenuScreen visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </SafeAreaView>
  );
};
