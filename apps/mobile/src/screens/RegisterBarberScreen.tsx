import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import Constants from 'expo-constants';
import { FeedbackModal } from '../components/FeedbackModal';
import { useToast } from '../contexts/ToastContext';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterBarber'>;

interface Barbershop {
  id: string;
  name: string;
}

export const RegisterBarberScreen: React.FC<Props> = ({ navigation }) => {
  const { user, token } = useAuth();
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [bioFocused, setBioFocused] = useState(false);
  const [modal, setModal] = useState<{ visible: boolean; type: 'success' | 'error'; title: string; message: string }>({ visible: false, type: 'success', title: '', message: '' });
  const toast = useToast();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        let host = 'localhost';
        if (Constants.expoConfig?.hostUri) host = Constants.expoConfig.hostUri.split(':')[0];
        else if (Platform.OS === 'android') host = '10.0.2.2';
        const response = await fetch(`http://${host}:3000/barbershops`);
        if (response.ok) {
          const data = (await response.json()) as Barbershop[];
          setBarbershops(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    void fetchShops();
  }, []);

  const handleRegister = async () => {
    if (!bio || !selectedShop) {
      toast.show({ message: 'Selecione a barbearia e escreva uma bio!', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      let host = 'localhost';
      if (Constants.expoConfig?.hostUri) host = Constants.expoConfig.hostUri.split(':')[0];
      else if (Platform.OS === 'android') host = '10.0.2.2';

      const response = await fetch(`http://${host}:3000/barbershops/${selectedShop}/barbers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ description: bio, userId: user?.id }),
      });

      if (response.ok) {
        setModal({ visible: true, type: 'success', title: 'Bem-vindo!', message: 'Você agora é um barbeiro na plataforma!' });
        toast.show({ message: 'Você agora é um barbeiro!', type: 'success' });
      } else {
        throw new Error('Falha ao registrar barbeiro');
      }
    } catch {
      setModal({ visible: true, type: 'error', title: 'Erro', message: 'Ocorreu um erro ao registrar.' });
      toast.show({ message: 'Ocorreu um erro ao registrar.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    const wasSuccess = modal.type === 'success';
    setModal({ ...modal, visible: false });
    if (wasSuccess) navigation.goBack();
  };

  const isValid = bio.trim().length > 0 && selectedShop !== null;

  return (
    <SafeAreaView style={styles.screen}>
      <FeedbackModal visible={modal.visible} type={modal.type} title={modal.title} message={modal.message} onClose={handleCloseModal} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Tornar-se Barbeiro</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Hero */}
          <View style={styles.heroBadge}>
            <LinearGradient colors={['#8162FF33', '#8162FF11']} style={styles.heroBadgeIcon}>
              <Feather name="user-check" size={28} color="#8162FF" />
            </LinearGradient>
            <Text style={styles.heroTitle}>Seja um Barbeiro</Text>
            <Text style={styles.heroSubtitle}>Conecte-se a uma barbearia parceira e comece{'\n'}a receber agendamentos na plataforma.</Text>
          </View>

          {/* Barbershop selection */}
          <View style={styles.formCard}>
            <Text style={styles.sectionLabel}>SELECIONE SUA BARBEARIA</Text>
            {barbershops.length === 0 ? (
              <View style={styles.emptyShops}>
                <Feather name="loader" size={20} color="#55585F" />
                <Text style={styles.emptyShopsText}>Carregando barbearias...</Text>
              </View>
            ) : (
              <View style={styles.shopsGrid}>
                {barbershops.map((shop) => {
                  const isSelected = selectedShop === shop.id;
                  return (
                    <Pressable
                      key={shop.id}
                      style={[styles.shopChip, isSelected && styles.shopChipActive]}
                      onPress={() => setSelectedShop(shop.id)}
                    >
                      {isSelected && (
                        <LinearGradient colors={['#9B7FFF', '#8162FF']} style={StyleSheet.absoluteFillObject} />
                      )}
                      <Feather name="scissors" size={14} color={isSelected ? '#FFF' : '#55585F'} />
                      <Text style={[styles.shopChipText, isSelected && styles.shopChipTextActive]}>{shop.name}</Text>
                      {isSelected && <Feather name="check" size={14} color="#FFF" />}
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          {/* Bio */}
          <View style={styles.formCard}>
            <Text style={styles.sectionLabel}>SUA ESPECIALIDADE</Text>
            <Text style={styles.inputLabel}>Biografia Profissional</Text>
            <View style={[styles.bioWrapper, bioFocused && styles.bioWrapperFocused]}>
              <TextInput
                style={styles.bioInput}
                placeholder="Ex: Especialista em degradê, barba estilizada e cortes modernos..."
                placeholderTextColor="#3A3B3F"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={bio}
                onChangeText={setBio}
                onFocus={() => setBioFocused(true)}
                onBlur={() => setBioFocused(false)}
              />
            </View>
            <Text style={styles.charCount}>{bio.length} caracteres</Text>
          </View>

          {/* Submit */}
          <Pressable
            onPress={() => { void handleRegister(); }}
            disabled={loading || !isValid}
            style={{ marginHorizontal: 20, marginTop: 8 }}
          >
            <LinearGradient
              colors={isValid ? ['#9B7FFF', '#8162FF', '#6B4FE0'] : ['#26272B', '#1A1B1F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitButton}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Feather name="check-circle" size={18} color={isValid ? '#FFF' : '#55585F'} />
                  <Text style={[styles.submitText, !isValid && { color: '#55585F' }]}>Registrar como Barbeiro</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
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

  scroll: { paddingBottom: 40 },

  heroBadge: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 24 },
  heroBadgeIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#8162FF44',
  },
  heroTitle: { color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 22, marginBottom: 10 },
  heroSubtitle: { color: '#838896', fontFamily: 'Nunito_400Regular', fontSize: 14, textAlign: 'center', lineHeight: 22 },

  formCard: {
    backgroundColor: '#1A1B1F',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#26272B',
    marginHorizontal: 20,
    padding: 20,
    marginBottom: 16,
  },
  sectionLabel: { color: '#55585F', fontFamily: 'Nunito_700Bold', fontSize: 11, letterSpacing: 1.2, marginBottom: 16 },
  inputLabel: { color: '#838896', fontFamily: 'Nunito_700Bold', fontSize: 13, marginBottom: 10 },

  emptyShops: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  emptyShopsText: { color: '#55585F', fontFamily: 'Nunito_400Regular', fontSize: 14 },

  shopsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  shopChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#26272B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#303136',
    overflow: 'hidden',
    position: 'relative',
  },
  shopChipActive: { borderColor: '#8162FF' },
  shopChipText: { color: '#838896', fontFamily: 'Nunito_700Bold', fontSize: 13 },
  shopChipTextActive: { color: '#FFFFFF' },

  bioWrapper: {
    backgroundColor: '#26272B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#303136',
    padding: 14,
    minHeight: 110,
  },
  bioWrapperFocused: { borderColor: '#8162FF', backgroundColor: '#8162FF0A' },
  bioInput: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    lineHeight: 22,
    minHeight: 80,
  },
  charCount: { color: '#3A3B3F', fontFamily: 'Nunito_400Regular', fontSize: 11, textAlign: 'right', marginTop: 6 },

  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  submitText: { color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 16 },
});
