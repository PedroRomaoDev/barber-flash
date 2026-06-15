import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'BarberAppointments'>;

interface BookingItem {
  id: string;
  client?: { name?: string };
  status: string;
  service?: { name?: string };
  barbershop?: { name?: string };
  scheduledAt: string | number | Date;
  priceSnapshot: string | number;
}

export const BarberAppointmentsScreen: React.FC<Props> = ({ navigation }) => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      let host = 'localhost';
      if (Constants.expoConfig?.hostUri) {
        host = Constants.expoConfig.hostUri.split(':')[0];
      } else if (Platform.OS === 'android') {
        host = '10.0.2.2';
      }

      const response = await fetch(`http://${host}:3000/bookings/barber-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = (await response.json()) as BookingItem[];
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch barber bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (token) {
        setLoading(true);
        void fetchBookings();
      } else {
        setLoading(false);
      }
    }, [token])
  );

  const updateStatus = async (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
    try {
      let host = 'localhost';
      if (Constants.expoConfig?.hostUri) {
        host = Constants.expoConfig.hostUri.split(':')[0];
      } else if (Platform.OS === 'android') {
        host = '10.0.2.2';
      }

      const response = await fetch(`http://${host}:3000/bookings/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        void fetchBookings();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderItem = ({ item }: { item: BookingItem }) => {
    const date = new Date(item.scheduledAt);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.clientName}>Cliente: {item.client?.name || 'Desconhecido'}</Text>
          <Text style={[styles.status, item.status === 'CONFIRMED' && styles.statusConfirmed, item.status === 'CANCELLED' && styles.statusCanceled]}>{item.status}</Text>
        </View>
        <Text style={styles.serviceName}>{item.service?.name} - {item.barbershop?.name}</Text>
        <Text style={styles.dateText}>{date.toLocaleDateString()} às {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>R$ {item.priceSnapshot}</Text>
          {item.status === 'PENDING' && (
            <View style={styles.actionButtons}>
              <Pressable style={styles.rejectButton} onPress={() => { void updateStatus(item.id, 'CANCELLED'); }}>
                <Feather name="x" size={20} color="#FFF" />
              </Pressable>
              <Pressable style={styles.acceptButton} onPress={() => { void updateStatus(item.id, 'CONFIRMED'); }}>
                <Feather name="check" size={20} color="#FFF" />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Notificações / Pedidos</Text>
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
            <Text style={styles.emptyText}>Você não tem nenhum pedido de agendamento no momento.</Text>
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
  clientName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  status: { color: '#838896', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  statusConfirmed: { color: '#00D084' },
  statusCanceled: { color: '#FF4E4E' },
  serviceName: { color: '#838896', fontSize: 14, marginBottom: 12 },
  dateText: { color: '#FFF', fontSize: 16, marginBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#26272B', paddingTop: 16 },
  price: { color: '#8162FF', fontSize: 16, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', gap: 12 },
  acceptButton: { backgroundColor: '#00D084', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  rejectButton: { backgroundColor: '#FF4E4E', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#838896', textAlign: 'center', marginTop: 40 }
});
