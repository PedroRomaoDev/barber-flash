import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { HomeHeader } from './home/components';
import { MenuScreen } from './MenuScreen';
import barbeariaImg from '../../assets/images/barbearia.png';
import { assets } from './home/assets';
import { ImageSourcePropType } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'MyAppointments'>;

interface BookingItem {
  id: string;
  status: string;
  scheduledAt: string | number | Date;
  priceSnapshot: string | number;
  barbershop?: { name?: string; imageUrl?: string };
  service?: { name?: string };
  barber?: { user?: { name?: string } };
}

export const MyAppointmentsScreen: React.FC<Props> = () => {
  const { token: authToken } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const toast = useToast();

  const getHost = () => {
    let host = 'localhost';
    if (Constants.expoConfig?.hostUri) host = Constants.expoConfig.hostUri.split(':')[0];
    else if (Platform.OS === 'android') host = '10.0.2.2';
    return host;
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

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://${getHost()}:3000/bookings/my-bookings`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = (await response.json()) as BookingItem[];
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings', error);
      toast.show({ message: 'Erro ao carregar agendamentos.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) void fetchBookings();
    else setLoading(false);
  }, [authToken]);

  const handleCancel = async (id: string) => {
    try {
      const res = await fetch(`http://${getHost()}:3000/bookings/${id}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (res.ok) {
        toast.show({ message: 'Agendamento cancelado com sucesso.', type: 'success' });
        void fetchBookings();
      } else {
        toast.show({ message: 'Não foi possível cancelar.', type: 'error' });
      }
    } catch (e) {
      console.error(e);
      toast.show({ message: 'Erro ao cancelar agendamento.', type: 'error' });
    }
  };

  const confirmedBookings = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED');
  const pastBookings = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED');

  const getMonthName = (date: Date) => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[date.getMonth()];
  };

  const renderBookingCard = (item: BookingItem, isConfirmed: boolean) => {
    const date = new Date(item.scheduledAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = getMonthName(date);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const badgeText = isConfirmed ? 'Confirmado' : 'Finalizado';
    const badgeStyle = isConfirmed ? styles.badgeConfirmed : styles.badgeFinalizado;
    const badgeTextStyle = isConfirmed ? styles.badgeTextConfirmed : styles.badgeTextFinalizado;

    const avatarSource = getBarberImage(item.barbershop?.imageUrl);

    return (
      <View key={item.id} style={styles.cardContainer}>
        <View style={styles.cardLeft}>
          <View style={[styles.badge, badgeStyle]}>
            <Text style={[styles.badgeText, badgeTextStyle]}>{badgeText}</Text>
          </View>
          <Text style={styles.serviceTitle}>{item.service?.name || 'Serviço'}</Text>
          <View style={styles.barbershopRow}>
            <Image source={avatarSource} style={styles.avatar} />
            <Text style={styles.barbershopName}>{item.barbershop?.name || 'Barbearia'}</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardRight}>
          <Text style={styles.dateMonth}>{month}</Text>
          <Text style={styles.dateDay}>{day}</Text>
          <Text style={styles.dateTime}>{time}</Text>
        </View>
        
        {item.status === 'PENDING' && (
          <Pressable style={styles.cancelBtn} onPress={() => { void handleCancel(item.id); }}>
            <Text style={styles.cancelBtnText}>Cancelar Agendamento</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <HomeHeader onMenuPress={() => setMenuOpen(true)} />

      {menuOpen && (
        <View style={styles.menuOverlay}>
          <MenuScreen onClose={() => setMenuOpen(false)} />
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#8162FF" />
        </View>
      ) : (
        <FlatList
          data={[{ key: 'content' }]}
          renderItem={() => (
            <View style={styles.content}>
              <Text style={styles.pageTitle}>Agendamentos</Text>

              {confirmedBookings.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>CONFIRMADOS</Text>
                  {confirmedBookings.map((b) => renderBookingCard(b, true))}
                </View>
              )}

              {pastBookings.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>FINALIZADOS</Text>
                  {pastBookings.map((b) => renderBookingCard(b, false))}
                </View>
              )}

              {bookings.length === 0 && (
                <Text style={styles.emptyText}>Você ainda não possui agendamentos.</Text>
              )}
            </View>
          )}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#141518' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  menuOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#838896',
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardContainer: {
    backgroundColor: '#1A1B1F',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#26272B',
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  cardLeft: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    minWidth: 200,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeConfirmed: {
    backgroundColor: '#221C3D',
  },
  badgeFinalizado: {
    backgroundColor: '#26272B',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Nunito_700Bold',
  },
  badgeTextConfirmed: {
    color: '#8162FF',
  },
  badgeTextFinalizado: {
    color: '#838896',
  },
  serviceTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 12,
  },
  barbershopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  barbershopName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  cardDivider: {
    width: 1,
    backgroundColor: '#26272B',
  },
  cardRight: {
    width: 106,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonth: {
    color: '#838896',
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  dateDay: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 28,
    marginBottom: 4,
  },
  dateTime: {
    color: '#838896',
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  cancelBtn: {
    width: '100%',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#26272B',
    alignItems: 'center',
    backgroundColor: '#1A1B1F',
  },
  cancelBtnText: {
    color: '#FF4E4E',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  emptyText: {
    color: '#838896',
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  }
});
