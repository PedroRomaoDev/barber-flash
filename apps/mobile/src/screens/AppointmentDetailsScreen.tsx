import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert, Image as RNImage, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import Constants from 'expo-constants';
import * as ClipboardRaw from 'expo-clipboard';

const Clipboard = ClipboardRaw as { setStringAsync: (text: string) => Promise<boolean> };
import Toast from 'react-native-toast-message';

import barberMapImg from '../../assets/images/BarberMap.png';

// Se existirem as imagens de placeholder
import { assets } from './home/assets';

interface BookingItem {
  id: string;
  status: string;
  scheduledAt: string | number | Date;
  priceSnapshot: string | number;
  barbershop?: { name?: string; imageUrl?: string };
  service?: { name?: string };
  barber?: { user?: { name?: string } };
}

type Props = NativeStackScreenProps<RootStackParamList, 'AppointmentDetails'>;

export const AppointmentDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const booking = route.params.booking as unknown as BookingItem;
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

  // Check if booking is in the future
  const bookingDate = new Date(booking.scheduledAt);
  const now = new Date();
  const isFuture = bookingDate > now;

  const handleCopyPhone = async (phone: string) => {
    await Clipboard.setStringAsync(phone);
    Toast.show({
      type: 'success',
      text1: 'Copiado!',
      text2: 'Telefone copiado para a área de transferência',
    });
  };

  const handleCancelConfirm = async () => {
    try {
      setLoading(true);
      let host = 'localhost';
      if (Constants.expoConfig?.hostUri) {
        host = Constants.expoConfig.hostUri.split(':')[0];
      } else if (Platform.OS === 'android') {
        host = '10.0.2.2';
      }

      const response = await fetch(`http://${host}:3000/bookings/${booking.id}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsCancelModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Cancelado',
          text2: 'O agendamento foi cancelado com sucesso.',
        });
        navigation.goBack();
      } else {
        const err = (await response.json()) as { message?: string };
        setIsCancelModalVisible(false);
        Alert.alert('Erro', err.message || 'Erro ao cancelar o agendamento.');
      }
    } catch (error) {
      console.error(error);
      setIsCancelModalVisible(false);
      Alert.alert('Erro', 'Ocorreu um problema de conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = () => {
    setIsReviewModalVisible(true);
  };

  const handleConfirmReview = () => {
    if (rating === 0) return;
    
    setLoading(true);
    // Simulating API call since there's no backend route yet
    setTimeout(() => {
      setLoading(false);
      setIsReviewModalVisible(false);
      setIsSuccessModalVisible(true);
    }, 1000);
  };

  // Formatar data e hora
  const dateStr = bookingDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  const timeStr = bookingDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Avatar helper
  const getBarberImage = (imageUrl: any) => {
    if (!imageUrl || typeof imageUrl !== 'string') return assets.barberOne;
    if (imageUrl.startsWith('http')) return { uri: imageUrl };
    if (imageUrl.includes('barber1') || imageUrl.includes('barber_one')) return assets.barberOne;
    if (imageUrl.includes('barber2') || imageUrl.includes('barber_two')) return assets.barberTwo;
    if (imageUrl.includes('barber3') || imageUrl.includes('barber_three')) return assets.barberThree;
    if (imageUrl.includes('barber') || imageUrl.includes('barber_four')) return assets.barberFour;
    return assets.barberOne;
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Feather name="chevron-left" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Informações da Reserva</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Feather name="x" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Container do Mapa (Background escuro elegante com gradiente) */}
        <View style={styles.mapContainer}>
          <RNImage
            source={barberMapImg}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />

          {/* Barbershop Info Card flutuando sobre a base do mapa */}
          <View style={styles.barbershopCard}>
            <View style={styles.barbershopCardHeader}>
              <RNImage source={getBarberImage(booking.barbershop?.imageUrl)} style={styles.avatar} />
              <View style={styles.barbershopInfo}>
                <Text style={styles.barbershopName}>{booking.barbershop?.name || 'Barbearia'}</Text>
                <Text style={styles.barbershopAddress} numberOfLines={1}>
                  Avenida São Sebastião, 357, São Paulo
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>
            {booking.status === 'PENDING' || booking.status === 'CONFIRMED' ? (isFuture ? 'Confirmado' : 'Finalizado') : 'Cancelado'}
          </Text>
        </View>

        {/* Detalhes do Serviço */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsRow}>
            <Text style={styles.serviceTitle}>{booking.service?.name || 'Corte de Cabelo'}</Text>
            <Text style={styles.servicePrice}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(booking.priceSnapshot))}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data</Text>
            <Text style={styles.infoValue}>{dateStr}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Horário</Text>
            <Text style={styles.infoValue}>{timeStr}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Barbearia</Text>
            <Text style={styles.infoValue}>{booking.barbershop?.name || 'Barbearia'}</Text>
          </View>
        </View>

        {/* Contatos */}
        <View style={styles.contactsCard}>
          <View style={styles.contactRow}>
            <View style={styles.contactIconContainer}>
              <Feather name="smartphone" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.contactPhone}>(11) 98204-5108</Text>
            <Pressable style={styles.copyButton} onPress={() => { void handleCopyPhone('(11) 98204-5108'); }}>
              <Text style={styles.copyButtonText}>Copiar</Text>
            </Pressable>
          </View>

          <View style={styles.contactRow}>
            <View style={styles.contactIconContainer}>
              <Feather name="smartphone" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.contactPhone}>(11) 99503-2351</Text>
            <Pressable style={styles.copyButton} onPress={() => { void handleCopyPhone('(11) 99503-2351'); }}>
              <Text style={styles.copyButtonText}>Copiar</Text>
            </Pressable>
          </View>
        </View>

      </ScrollView>

      {/* Botão de Ação no Rodapé */}
      <View style={styles.footer}>
        <Pressable 
          style={styles.backFooterButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backFooterText}>Voltar</Text>
        </Pressable>

        {isFuture ? (
          <Pressable 
            style={[styles.actionButton, styles.cancelButton, loading && { opacity: 0.7 }]} 
            onPress={() => setIsCancelModalVisible(true)}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
          </Pressable>
        ) : (
          <Pressable 
            style={[styles.actionButton, styles.rateButton]} 
            onPress={handleRate}
          >
            <Text style={styles.rateButtonText}>Avaliar</Text>
          </Pressable>
        )}
      </View>

      {/* Cancel Confirmation Modal */}
      <Modal visible={isCancelModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.cancelModalContent}>
            <Text style={styles.cancelModalTitle}>Cancelar Reserva</Text>
            <Text style={styles.cancelModalSubtitle}>
              Tem certeza que deseja cancelar esse{' '}agendamento?
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalCancelButton}
                onPress={() => setIsCancelModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Voltar</Text>
              </Pressable>

              <Pressable
                style={[styles.cancelModalConfirmButton, loading && { opacity: 0.7 }]}
                onPress={() => { void handleCancelConfirm(); }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.cancelModalConfirmText}>Confirmar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal visible={isReviewModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.reviewModalContent}>
            <Text style={styles.reviewTitle}>Avalie sua experiência</Text>
            <Text style={styles.reviewSubtitle}>
              Toque nas estrelas para avaliar sua{'\n'}experiência na {booking.barbershop?.name || 'Barbearia'}!
            </Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => setRating(star)} hitSlop={8}>
                  <FontAwesome
                    name={star <= rating ? 'star' : 'star-o'}
                    size={36}
                    color="#8162FF"
                  />
                </Pressable>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <Pressable 
                style={styles.modalCancelButton} 
                onPress={() => {
                  setRating(0);
                  setIsReviewModalVisible(false);
                }}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable 
                style={[styles.modalConfirmButton, rating === 0 && styles.modalConfirmDisabled]} 
                onPress={handleConfirmReview}
                disabled={rating === 0 || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalConfirmButtonText}>Confirmar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={isSuccessModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Feather name="check" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Avaliação Efetuada</Text>
            <Text style={styles.successSubtitle}>
              Sua avaliação foi efetuada com{'\n'}sucesso
            </Text>

            <Pressable 
              style={styles.successButton} 
              onPress={() => {
                setIsSuccessModalVisible(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.successButtonText}>Confirmar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121214',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
    position: 'relative',
    backgroundColor: '#1A1B1F',
  },
  mapGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barbershopCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1F1F23',
    padding: 16,
  },
  barbershopCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  barbershopInfo: {
    flex: 1,
  },
  barbershopName: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  barbershopAddress: {
    color: '#838896',
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
  },
  statusBadge: {
    backgroundColor: '#221C3D',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 16,
  },
  statusBadgeText: {
    color: '#8162FF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  detailsCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#26272B',
    paddingBottom: 24,
    marginBottom: 24,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  serviceTitle: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
  },
  servicePrice: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#838896',
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
  },
  infoValue: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
  },
  contactsCard: {
    paddingBottom: 24,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactPhone: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    flex: 1,
    marginLeft: 8,
  },
  copyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1A1B1F',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#26272B',
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#26272B',
    backgroundColor: '#121214',
  },
  backFooterButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1B1F',
    borderRadius: 8,
    marginRight: 12,
  },
  backFooterText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#E23E3E',
  },
  rateButton: {
    backgroundColor: '#8162FF',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
  },
  rateButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  reviewModalContent: {
    backgroundColor: '#1F1F23',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#26272B',
  },
  reviewTitle: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  reviewSubtitle: {
    color: '#838896',
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#26272B',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#8162FF',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalConfirmButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
  },
  modalConfirmDisabled: {
    opacity: 0.5,
  },
  successModalContent: {
    backgroundColor: '#1F1F23',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#26272B',
  },
  successIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8162FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    marginBottom: 8,
  },
  successSubtitle: {
    color: '#838896',
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  successButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#26272B',
    borderRadius: 8,
    alignItems: 'center',
  },
  successButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
  },
  cancelModalContent: {
    backgroundColor: '#1F1F23',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#26272B',
  },
  cancelModalTitle: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    marginBottom: 12,
  },
  cancelModalSubtitle: {
    color: '#838896',
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  cancelModalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#E53935',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelModalConfirmText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
  },
});
