import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { FeedbackModal } from '../components/FeedbackModal';

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
  const [modal, setModal] = useState<{ visible: boolean, type: 'success' | 'error', title: string, message: string }>({ visible: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    const fetchShops = async () => {
      try {
        let host = 'localhost';
        if (Constants.expoConfig?.hostUri) {
          host = Constants.expoConfig.hostUri.split(':')[0];
        } else if (Platform.OS === 'android') {
          host = '10.0.2.2';
        }
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
      setModal({ visible: true, type: 'error', title: 'Atenção', message: 'Selecione uma barbearia e escreva uma bio.' });
      return;
    }
    setLoading(true);
    try {
      let host = 'localhost';
      if (Constants.expoConfig?.hostUri) {
        host = Constants.expoConfig.hostUri.split(':')[0];
      } else if (Platform.OS === 'android') {
        host = '10.0.2.2';
      }

      const response = await fetch(`http://${host}:3000/barbershops/${selectedShop}/barbers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description: bio, userId: user?.id })
      });

      if (response.ok) {
        setModal({ visible: true, type: 'success', title: 'Sucesso', message: 'Você agora é um barbeiro!' });
      } else {
        throw new Error('Falha ao registrar barbeiro');
      }
    } catch {
      setModal({ visible: true, type: 'error', title: 'Erro', message: 'Ocorreu um erro ao registrar.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    const wasSuccess = modal.type === 'success';
    setModal({ ...modal, visible: false });
    if (wasSuccess) {
      navigation.goBack();
    }
  };

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
        <Text style={styles.headerTitle}>Tornar-se Barbeiro</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.label}>Vincular-se à Barbearia</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {barbershops.map((shop) => (
            <Pressable
              key={shop.id}
              style={[styles.shopChip, selectedShop === shop.id && styles.shopChipActive]}
              onPress={() => setSelectedShop(shop.id)}
            >
              <Text style={[styles.shopText, selectedShop === shop.id && styles.shopTextActive]}>{shop.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>Biografia (Especialidades)</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Ex: Especialista em degradê e barba..."
          placeholderTextColor="#838896"
          multiline
          value={bio}
          onChangeText={setBio}
        />

        <Pressable style={styles.button} onPress={() => { void handleRegister(); }} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Registrar</Text>}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#141518' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  content: { padding: 20 },
  label: { color: '#838896', fontSize: 14, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#1A1B1F', borderRadius: 8, padding: 16, color: '#FFF', fontSize: 16, borderWidth: 1, borderColor: '#26272B' },
  shopChip: { padding: 12, backgroundColor: '#1A1B1F', borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: '#26272B' },
  shopChipActive: { backgroundColor: '#8162FF', borderColor: '#8162FF' },
  shopText: { color: '#838896' },
  shopTextActive: { color: '#FFF', fontWeight: 'bold' },
  button: { backgroundColor: '#8162FF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 32 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
