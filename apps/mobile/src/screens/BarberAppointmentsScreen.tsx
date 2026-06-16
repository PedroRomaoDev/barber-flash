import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useToast } from '../contexts/ToastContext';

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

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: 'Pendente',   color: '#F5A623', bg: '#F5A62322' },
  CONFIRMED: { label: 'Confirmado', color: '#00D084', bg: '#00D08422' },
  CANCELLED: { label: 'Cancelado',  color: '#FF4E4E', bg: '#FF4E4E22' },
  COMPLETED: { label: 'Finalizado', color: '#838896', bg: '#83889622' },
};

export const BarberAppointmentsScreen: React.FC<Props> = ({ navigation }) => {
  const { token } = useAuth();
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
      const response = await fetch(`http://${getHost()}:3000/bookings/barber-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = (await response.json()) as BookingItem[];
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch barber bookings', error);
      toast.show({ message: 'Erro ao carregar pedidos.', type: 'error' });
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
      const response = await fetch(`http://${getHost()}:3000/bookings/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        void fetchBookings();
        const label = status === 'CONFIRMED' ? 'confirmado' : 'cancelado';
        toast.show({ message: `Agendamento ${label} com sucesso!`, type: status === 'CONFIRMED' ? 'success' : 'info' });
      }
    } catch (e) {
      console.error(e);
      toast.show({ message: 'Erro ao atualizar status do agendamento.', type: 'error' });
    }
  };

  const renderItem = ({ item }: { item: BookingItem }) => {
    const date = new Date(item.scheduledAt);
    const statusInfo = STATUS_MAP[item.status] ?? STATUS_MAP['PENDING'];
    const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const price = Number(item.priceSnapshot).toFixed(2).replace('.', ',');

    return (
      <View style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardTop}>
          {/* Avatar circle with initials */}
          <View style={styles.clientAvatar}>
            <Text style={styles.clientInitial}>
              {(item.client?.name ?? 'C')[0].toUpperCase()}
            </Text>
          </View>

          <View style={styles.cardTopInfo}>
            <Text style={styles.clientName}>{item.client?.name ?? 'Cliente'}</Text>
            <Text style={styles.serviceName}>{item.service?.name ?? 'Serviço'}</Text>
          </View>

          {/* Status badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Card Body */}
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Feather name="calendar" size={13} color="#55585F" />
            <Text style={styles.metaText}>{dateStr}</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Feather name="clock" size={13} color="#55585F" />
            <Text style={styles.metaText}>{timeStr}</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Feather name="home" size={13} color="#55585F" />
            <Text style={styles.metaText}>{item.barbershop?.name ?? 'Barbearia'}</Text>
          </View>
        </View>

        {/* Card Footer */}
        <View style={styles.cardFooter}>
          <LinearGradient colors={['#8162FF22', '#8162FF11']} style={styles.priceTag}>
            <Text style={styles.priceText}>R$ {price}</Text>
          </LinearGradient>

          {item.status === 'PENDING' && (
            <View style={styles.actionRow}>
              <Pressable
                style={styles.rejectBtn}
                onPress={() => { void updateStatus(item.id, 'CANCELLED'); }}
              >
                <Feather name="x" size={16} color="#FF4E4E" />
                <Text style={styles.rejectBtnText}>Recusar</Text>
              </Pressable>

              <Pressable
                onPress={() => { void updateStatus(item.id, 'CONFIRMED'); }}
              >
                <LinearGradient colors={['#9B7FFF', '#8162FF']} style={styles.acceptBtn}>
                  <Feather name="check" size={16} color="#FFF" />
                  <Text style={styles.acceptBtnText}>Aceitar</Text>
                </LinearGradient>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Subtitle */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>
          {bookings.length} pedido{bookings.length !== 1 ? 's' : ''} de agendamento
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#8162FF" />
          <Text style={styles.loadingText}>Carregando pedidos...</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <LinearGradient colors={['#8162FF22', '#8162FF08']} style={styles.emptyIcon}>
                <Feather name="inbox" size={32} color="#8162FF" />
              </LinearGradient>
              <Text style={styles.emptyTitle}>Nenhum pedido</Text>
              <Text style={styles.emptySubtitle}>Você não tem nenhum pedido de{'\n'}agendamento no momento.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0F0F12' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontFamily: 'Nunito_700Bold', color: '#FFFFFF' },

  subHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  subHeaderText: {
    color: '#55585F',
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
  },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#55585F', fontFamily: 'Nunito_400Regular', fontSize: 14 },

  list: { paddingHorizontal: 20, paddingBottom: 40 },

  card: {
    backgroundColor: '#1A1B1F',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#26272B',
    marginBottom: 14,
    overflow: 'hidden',
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8162FF33',
    borderWidth: 1,
    borderColor: '#8162FF55',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientInitial: { color: '#8162FF', fontFamily: 'Nunito_700Bold', fontSize: 18 },
  cardTopInfo: { flex: 1 },
  clientName: { color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 16, marginBottom: 2 },
  serviceName: { color: '#838896', fontFamily: 'Nunito_400Regular', fontSize: 13 },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: { fontFamily: 'Nunito_700Bold', fontSize: 11 },

  divider: { height: 1, backgroundColor: '#26272B' },

  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexWrap: 'wrap',
    gap: 6,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: '#55585F', fontFamily: 'Nunito_400Regular', fontSize: 12 },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#26272B' },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  priceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: { color: '#8162FF', fontFamily: 'Nunito_700Bold', fontSize: 15 },

  actionRow: { flexDirection: 'row', gap: 8 },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FF4E4E18',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4E4E44',
  },
  rejectBtnText: { color: '#FF4E4E', fontFamily: 'Nunito_700Bold', fontSize: 13 },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acceptBtnText: { color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 13 },

  emptyContainer: { alignItems: 'center', paddingTop: 60, gap: 16 },
  emptyIcon: { width: 80, height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 18 },
  emptySubtitle: { color: '#838896', fontFamily: 'Nunito_400Regular', fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
