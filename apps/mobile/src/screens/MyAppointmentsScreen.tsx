import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { useToast } from '../contexts/ToastContext';

type Props = NativeStackScreenProps<RootStackParamList, 'MyAppointments'>;

interface BookingItem {
  id: string;
  status: string;
  scheduledAt: string | number | Date;
  priceSnapshot: string | number;
  barbershop?: { name?: string };
  service?: { name?: string };
  barber?: { user?: { name?: string } };
}

export const MyAppointmentsScreen: React.FC<Props> = ({ navigation }) => {
  const { token: authToken } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const getHost = () => {
    let host = 'localhost';
    if (Constants.expoConfig?.hostUri) host = Constants.expoConfig.hostUri.split(':')[0];
    else if (Platform.OS === 'android') host = '10.0.2.2';
    return host;
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

  const renderItem = ({ item }: { item: BookingItem }) => {
    const date = new Date(item.scheduledAt);
    const isPending = item.status === 'PENDING';
    const statusColor = item.status === 'CONFIRMED' ? '#00D084' : item.status === 'CANCELLED' ? '#FF4E4E' : '#8162FF';
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.shopName}>{item.barbershop?.name || 'Barbearia'}</Text>
          <Text style={[styles.status, { color: statusColor }]}>{item.status}</Text>
        </View>
        <Text style={styles.serviceName}>{item.service?.name}</Text>
        <Text style={styles.dateText}>{date.toLocaleDateString()} às {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>R$ {item.priceSnapshot}</Text>
          <Text style={styles.barber}>Com {item.barber?.user?.name || 'Barbeiro'}</Text>
        </View>
        {isPending && (
          <Pressable style={styles.cancelButton} onPress={() => { void handleCancel(item.id); }}>
            <Feather name="x-circle" size={14} color="#FF4E4E" />
            <Text style={styles.cancelText}>Cancelar agendamento</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Meus Agendamentos</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#8162FF" />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Você ainda não possui agendamentos.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#141518' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 20 },
  card: { backgroundColor: '#1A1B1F', padding: 20, borderRadius: 10, marginBottom: 16, borderWidth: 1, borderColor: '#26272B' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  shopName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  status: { color: '#8162FF', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  serviceName: { color: '#838896', fontSize: 14, marginBottom: 12 },
  dateText: { color: '#FFF', fontSize: 16, marginBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#26272B', paddingTop: 16 },
  price: { color: '#8162FF', fontSize: 16, fontWeight: 'bold' },
  barber: { color: '#838896', fontSize: 14 },
  emptyText: { color: '#838896', textAlign: 'center', marginTop: 40 },
  cancelButton: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#3A2A2A' },
  cancelText: { color: '#FF4E4E', fontSize: 13, fontWeight: 'bold' },
});
