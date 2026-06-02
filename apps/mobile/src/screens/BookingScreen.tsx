import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { FeedbackModal } from '../components/FeedbackModal';
import { useStripe } from '@stripe/stripe-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Booking'>;

export const BookingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { barbershopId, serviceId } = route.params;
  const { user, token } = useAuth();

  const [barbershop, setBarbershop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);

  // Hardcoded times for prototype
  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modal, setModal] = useState<{ visible: boolean, type: 'success' | 'error', title: string, message: string }>({ visible: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let host = 'localhost';
        if (Constants.expoConfig?.hostUri) {
          host = Constants.expoConfig.hostUri.split(':')[0];
        } else if (Platform.OS === 'android') {
          host = '10.0.2.2';
        }

        const response = await fetch(`http://${host}:3000/barbershops/${barbershopId}`);
        if (response.ok) {
          const data = await response.json();
          if (!data.barbers || data.barbers.length === 0) {
            data.barbers = [{ id: 'mock-1', user: { name: 'João Barbeiro (Mock)' } }];
          }
          setBarbershop(data);
          setSelectedBarberId(data.barbers[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch barbershop details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [barbershopId]);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handleOpenPayment = async () => {
    if (!user || !token) {
      setModal({ visible: true, type: 'error', title: 'Atenção', message: 'Faça login para continuar com o agendamento.' });
      return;
    }
    if (!selectedBarberId) {
      setModal({ visible: true, type: 'error', title: 'Atenção', message: 'Selecione um barbeiro.' });
      return;
    }
    if (!selectedTime) {
      setModal({ visible: true, type: 'error', title: 'Atenção', message: 'Selecione um horário.' });
      return;
    }
    await processPaymentAndBooking();
  };

  const processPaymentAndBooking = async () => {
    setIsProcessingPayment(true);
    
    try {
      let host = 'localhost';
      if (Constants.expoConfig?.hostUri) {
        host = Constants.expoConfig.hostUri.split(':')[0];
      } else if (Platform.OS === 'android') {
        host = '10.0.2.2';
      }

      // 1. Criar Payment Intent no Backend
      const intentResponse = await fetch(`http://${host}:3000/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Number(selectedService?.price) || 0
        })
      });

      if (!intentResponse.ok) {
        const errorText = await intentResponse.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Falha na API: ${errorText}`);
      }

      const { clientSecret } = await intentResponse.json();

      // 2. Inicializar o Payment Sheet nativo
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Barber Flash',
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: user.name,
        }
      });

      if (initError) {
        console.error(initError);
        throw new Error('Erro ao abrir o painel de pagamento.');
      }

      // 3. Exibir o Payment Sheet e aguardar o cliente pagar
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        if (paymentError.code === 'Canceled') {
          // Usuário fechou o modal
          setIsProcessingPayment(false);
          return;
        }
        throw new Error(`Pagamento recusado: ${paymentError.message}`);
      }

      // 4. Pagamento Aprovado! Agora cria o agendamento no banco:
      const [hours, minutes] = selectedTime!.split(':');
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const response = await fetch(`http://${host}:3000/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          barberId: selectedBarberId,
          barbershopId: barbershopId,
          serviceId: serviceId,
          scheduledAt: scheduledAt.toISOString(),
          priceSnapshot: selectedService?.price
        })
      });

      if (response.ok) {
        setModal({ visible: true, type: 'success', title: 'Sucesso!', message: `Pagamento aprovado na Stripe e reserva confirmada!` });
      } else {
        const errData = await response.json();
        if (errData.message && errData.message.includes('disponível')) {
          throw new Error('CONFLITO_HORARIO');
        }
        throw new Error('Falha na API ao confirmar reserva');
      }
    } catch (e: any) {
      if (e.message === 'CONFLITO_HORARIO') {
        setModal({ visible: true, type: 'error', title: 'Ops!', message: 'Este horário não está mais disponível para este barbeiro. Escolha outro horário.' });
      } else {
        setModal({ visible: true, type: 'error', title: 'Erro', message: e.message || 'Ocorreu um erro ao processar o agendamento.' });
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCloseModal = () => {
    const wasSuccess = modal.type === 'success';
    setModal({ ...modal, visible: false });
    if (wasSuccess) {
      navigation.navigate('Home');
    }
  };

  if (loading || !barbershop) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#8162FF" />
      </SafeAreaView>
    );
  }

  const selectedService = barbershop.services?.find((s: any) => s.id === serviceId);

  return (
    <SafeAreaView style={styles.screen}>
      <FeedbackModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={handleCloseModal}
      />
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Agendamento</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{selectedService?.name}</Text>
          <Text style={styles.summaryPrice}>R$ {selectedService?.price}</Text>
          <Text style={styles.summaryDesc}>{barbershop.name}</Text>
        </View>

        <Text style={styles.sectionTitle}>Selecione o Barbeiro</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {barbershop.barbers && barbershop.barbers.length > 0 ? (
            barbershop.barbers.map((barber: any) => (
              <Pressable
                key={barber.id}
                style={[styles.barberChip, selectedBarberId === barber.id && styles.barberChipActive]}
                onPress={() => setSelectedBarberId(barber.id)}
              >
                <Feather name="user" size={20} color={selectedBarberId === barber.id ? '#FFF' : '#838896'} />
                <Text style={[styles.barberName, selectedBarberId === barber.id && styles.barberNameActive]}>
                  {barber.user?.name || 'Barbeiro'}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhum barbeiro cadastrado nesta barbearia.</Text>
          )}
        </ScrollView>

        <Text style={styles.sectionTitle}>Selecione a Data</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const isSelected = selectedDate.getDate() === d.getDate();
            const weekDay = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()];
            return (
              <Pressable
                key={i}
                style={[styles.dateChip, isSelected && styles.dateChipActive]}
                onPress={() => setSelectedDate(d)}
              >
                <Text style={[styles.dateWeekText, isSelected && styles.dateTextActive]}>{weekDay}</Text>
                <Text style={[styles.dateDayText, isSelected && styles.dateTextActive]}>{d.getDate()}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Selecione o Horário</Text>
        <View style={styles.timeGrid}>
          {availableTimes.map((time) => (
            <Pressable
              key={time}
              style={[styles.timeChip, selectedTime === time && styles.timeChipActive]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.timeText, selectedTime === time && styles.timeTextActive]}>{time}</Text>
            </Pressable>
          ))}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>R$ {selectedService?.price}</Text>
        </View>
        <Pressable style={styles.confirmButton} onPress={handleOpenPayment}>
          <Text style={styles.confirmButtonText}>Pagar e Reservar</Text>
        </Pressable>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#141518' },
  center: { flex: 1, backgroundColor: '#141518', justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  content: { padding: 20 },
  summaryCard: { backgroundColor: '#1A1B1F', padding: 20, borderRadius: 10, marginBottom: 24 },
  summaryTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  summaryPrice: { fontSize: 24, fontWeight: 'bold', color: '#8162FF', marginBottom: 8 },
  summaryDesc: { fontSize: 14, color: '#838896' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#838896', textTransform: 'uppercase', marginBottom: 12, marginTop: 12 },
  horizontalList: { marginBottom: 24 },
  barberChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1B1F', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, marginRight: 12, borderWidth: 1, borderColor: '#26272B' },
  barberChipActive: { backgroundColor: '#8162FF', borderColor: '#8162FF' },
  barberName: { color: '#838896', marginLeft: 8, fontWeight: 'bold' },
  barberNameActive: { color: '#FFF' },
  emptyText: { color: '#838896', fontStyle: 'italic' },
  dateChip: { alignItems: 'center', backgroundColor: '#1A1B1F', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, marginRight: 12, borderWidth: 1, borderColor: '#26272B', width: 70 },
  dateChipActive: { backgroundColor: '#8162FF', borderColor: '#8162FF' },
  dateWeekText: { color: '#838896', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 },
  dateDayText: { color: '#838896', fontSize: 18, fontWeight: 'bold' },
  dateTextActive: { color: '#FFF' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 40 },
  timeChip: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#1A1B1F', borderRadius: 8, borderWidth: 1, borderColor: '#26272B' },
  timeChipActive: { backgroundColor: '#8162FF', borderColor: '#8162FF' },
  timeText: { color: '#838896', fontWeight: 'bold' },
  timeTextActive: { color: '#FFF' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#1A1B1F', borderTopWidth: 1, borderTopColor: '#26272B' },
  totalLabel: { color: '#838896', fontSize: 12 },
  totalPrice: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  confirmButton: { backgroundColor: '#8162FF', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8 },
  confirmButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  paymentOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  paymentSheet: { backgroundColor: '#1A1B1F', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  paymentTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  paymentSubtitle: { fontSize: 14, color: '#838896', marginBottom: 24 },
  paymentMethods: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  paymentMethodCard: { flex: 1, backgroundColor: '#141518', borderWidth: 2, borderColor: '#26272B', borderRadius: 12, padding: 16, alignItems: 'center', gap: 8 },
  paymentMethodCardActive: { borderColor: '#8162FF', backgroundColor: '#8162FF' },
  paymentMethodText: { color: '#838896', fontWeight: 'bold' },
  paymentMethodTextActive: { color: '#FFF' },
  payActionBtn: { backgroundColor: '#00D084', padding: 16, borderRadius: 12, alignItems: 'center' },
  payActionBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
