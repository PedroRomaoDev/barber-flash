import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { FeedbackModal } from '../components/FeedbackModal';
import { useStripe } from '../utils/stripe';
import { useToast } from '../contexts/ToastContext';

interface Service {
  id: string;
  name: string;
  price: string | number;
}

interface Barber {
  id: string;
  user?: { name?: string };
}

interface Barbershop {
  id: string;
  name: string;
  barbers?: Barber[];
  services?: Service[];
}

type Props = NativeStackScreenProps<RootStackParamList, 'Booking'>;

export const BookingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { barbershopId, serviceId } = route.params;
  const { user, token } = useAuth();

  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);

  const ALL_TIMES = ['09:00', '09:45', '10:30', '11:15', '12:00', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45'];
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());

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
          const data = (await response.json()) as Barbershop;
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
    void fetchDetails();
  }, [barbershopId]);

  useEffect(() => {
    if (!selectedBarberId) {
      setBookedSlots([]);
      return;
    }
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        let host = 'localhost';
        if (Constants.expoConfig?.hostUri) {
          host = Constants.expoConfig.hostUri.split(':')[0];
        } else if (Platform.OS === 'android') {
          host = '10.0.2.2';
        }
        const dateStr = selectedDate.toISOString().split('T')[0];
        const res = await fetch(`http://${host}:3000/bookings/availability?barberId=${selectedBarberId}&date=${dateStr}`);
        if (res.ok) {
          const data = (await res.json()) as { bookedSlots: string[] };
          setBookedSlots(data.bookedSlots);
          if (selectedTime && data.bookedSlots.includes(selectedTime)) {
            setSelectedTime(null);
          }
        }
      } catch (e) {
        console.error('Failed to fetch availability', e);
      } finally {
        setLoadingSlots(false);
      }
    };
    void fetchSlots();
  }, [selectedBarberId, selectedDate]);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const toast = useToast();

  const handleOpenPayment = async () => {
    if (!user || !token) {
      toast.show({ message: 'Faça login para continuar com o agendamento.', type: 'error' });
      return;
    }
    if (!selectedTime) {
      toast.show({ message: 'Selecione um horário para continuar.', type: 'error' });
      return;
    }
    await processPaymentAndBooking();
  };

  const processPaymentAndBooking = async () => {
    try {
      let host = 'localhost';
      if (Constants.expoConfig?.hostUri) {
        host = Constants.expoConfig.hostUri.split(':')[0];
      } else if (Platform.OS === 'android') {
        host = '10.0.2.2';
      }

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
        throw new Error(`Falha na API: ${errorText}`);
      }

      const { clientSecret } = (await intentResponse.json()) as { clientSecret: string };

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Flash Barber',
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: user!.name,
        }
      });

      if (initError) {
        throw new Error('Erro ao abrir o painel de pagamento.');
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (paymentError.code === 'Canceled') {
          return;
        }
        throw new Error(`Pagamento recusado: ${paymentError.message}`);
      }

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
        setModal({ visible: true, type: 'success', title: 'Reserva Efetuada!', message: `Sua reserva foi agendada com sucesso.` });
      } else {
        const errData = (await response.json()) as { message?: string };
        if (errData.message && errData.message.includes('disponível')) {
          throw new Error('CONFLITO_HORARIO');
        }
        throw new Error('Falha na API ao confirmar reserva');
      }
    } catch (e: unknown) {
      const error = e as Error;
      if (error.message === 'CONFLITO_HORARIO') {
        setModal({ visible: true, type: 'error', title: 'Ops!', message: 'Este horário não está mais disponível para este barbeiro. Escolha outro horário.' });
      } else {
        setModal({ visible: true, type: 'error', title: 'Erro', message: error.message || 'Ocorreu um erro ao processar o agendamento.' });
      }
    }
  };

  const handleCloseModal = () => {
    const wasSuccess = modal.type === 'success';
    setModal({ ...modal, visible: false });
    if (wasSuccess) {
      navigation.navigate('Home');
    }
  };

  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const startingDayOfWeek = firstDay.getDay(); 
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    const remainingDays = 42 - days.length; 
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    return days;
  }, [currentMonthDate]);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  if (loading || !barbershop) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#8162FF" />
      </SafeAreaView>
    );
  }

  const selectedService = barbershop.services?.find((s) => s.id === serviceId);

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
        <Text style={styles.headerTitle}>Fazer Reserva</Text>
        <Pressable style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color="#FFF" />
        </Pressable>
      </View>
      <View style={styles.headerDivider} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarMonthName}>{monthNames[currentMonthDate.getMonth()]}</Text>
            <View style={styles.calendarNav}>
              <Pressable style={styles.calendarNavButton} onPress={handlePrevMonth}>
                <Feather name="chevron-left" size={16} color="#838896" />
              </Pressable>
              <Pressable style={styles.calendarNavButton} onPress={handleNextMonth}>
                <Feather name="chevron-right" size={16} color="#838896" />
              </Pressable>
            </View>
          </View>

          <View style={styles.weekDaysRow}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {calendarDays.map((d, index) => {
              const isCurrentMonth = d.getMonth() === currentMonthDate.getMonth();
              const isSelected = d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
              
              return (
                <Pressable
                  key={index}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected
                  ]}
                  onPress={() => {
                    setSelectedDate(d);
                    if (d.getMonth() !== currentMonthDate.getMonth()) {
                      setCurrentMonthDate(new Date(d.getFullYear(), d.getMonth(), 1));
                    }
                  }}
                >
                  <Text style={[
                    styles.dayText,
                    !isCurrentMonth && styles.dayTextOut,
                    isSelected && styles.dayTextSelected
                  ]}>
                    {d.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeScroll}>
          {loadingSlots ? (
            <ActivityIndicator color="#8162FF" style={{ marginVertical: 16, marginHorizontal: 20 }} />
          ) : (
            ALL_TIMES.map((time) => {
              const isBooked = bookedSlots.includes(time);
              const isSelected = selectedTime === time;
              return (
                <Pressable
                  key={time}
                  disabled={isBooked}
                  style={[
                    styles.timeChip,
                    isSelected && styles.timeChipActive,
                    isBooked && styles.timeChipBooked,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeText,
                    isSelected && styles.timeTextActive,
                    isBooked && styles.timeTextBooked,
                  ]}>{time}</Text>
                </Pressable>
              );
            })
          )}
        </ScrollView>

        <View style={styles.divider} />

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <Text style={styles.summaryService}>{selectedService?.name || 'Serviço'}</Text>
            <Text style={styles.summaryPrice}>R$ {selectedService?.price || '0,00'}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Data</Text>
            <Text style={styles.summaryValue}>{String(selectedDate.getDate()).padStart(2, '0')} de {monthNames[selectedDate.getMonth()]}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Horário</Text>
            <Text style={styles.summaryValue}>{selectedTime || 'Selecione'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Barbearia</Text>
            <Text style={styles.summaryValue}>{barbershop.name}</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.confirmButton} onPress={() => { void handleOpenPayment(); }}>
          <Text style={styles.confirmButtonText}>Confirmar</Text>
        </Pressable>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#141518' },
  center: { flex: 1, backgroundColor: '#141518', justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: Platform.OS === 'android' ? 10 : 20 },
  closeButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontFamily: 'Nunito_700Bold', color: '#FFF' },
  headerDivider: { height: 1, backgroundColor: '#26272B', width: '100%' },
  content: { paddingBottom: 40 },
  
  calendarContainer: { padding: 20 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  calendarMonthName: { color: '#FFF', fontSize: 16, fontFamily: 'Nunito_700Bold', textTransform: 'capitalize' },
  calendarNav: { flexDirection: 'row', gap: 12 },
  calendarNavButton: { padding: 6, backgroundColor: '#1A1B1F', borderRadius: 8, borderWidth: 1, borderColor: '#26272B' },
  weekDaysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  weekDayText: { color: '#838896', fontSize: 12, fontFamily: 'Nunito_400Regular', width: 40, textAlign: 'center' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  dayCell: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginBottom: 8 },
  dayCellSelected: { backgroundColor: '#8162FF' },
  dayText: { color: '#FFF', fontSize: 16, fontFamily: 'Nunito_400Regular' },
  dayTextSelected: { color: '#FFF', fontFamily: 'Nunito_700Bold' },
  dayTextOut: { color: '#3A3A3C' },

  divider: { height: 1, backgroundColor: '#26272B', marginHorizontal: 20, marginVertical: 10 },

  timeScroll: { paddingHorizontal: 20, paddingVertical: 10, gap: 12 },
  timeChip: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1, borderColor: '#26272B', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  timeChipActive: { backgroundColor: '#8162FF', borderColor: '#8162FF' },
  timeChipBooked: { borderColor: '#1A1B1F', opacity: 0.4 },
  timeText: { color: '#FFF', fontSize: 14, fontFamily: 'Nunito_400Regular' },
  timeTextActive: { color: '#FFF', fontFamily: 'Nunito_700Bold' },
  timeTextBooked: { color: '#838896' },

  summaryCard: { marginHorizontal: 20, marginTop: 10, backgroundColor: '#1A1B1F', padding: 20, borderRadius: 10, borderWidth: 1, borderColor: '#26272B' },
  summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  summaryService: { color: '#FFF', fontSize: 16, fontFamily: 'Nunito_700Bold' },
  summaryPrice: { color: '#FFF', fontSize: 16, fontFamily: 'Nunito_700Bold' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { color: '#838896', fontSize: 14, fontFamily: 'Nunito_400Regular' },
  summaryValue: { color: '#FFF', fontSize: 14, fontFamily: 'Nunito_400Regular' },

  footer: { padding: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, borderTopWidth: 1, borderTopColor: '#26272B', backgroundColor: '#141518' },
  confirmButton: { backgroundColor: '#8162FF', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  confirmButtonText: { color: '#FFF', fontFamily: 'Nunito_700Bold', fontSize: 16 },
});
