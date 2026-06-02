import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { FeedbackModal } from '../components/FeedbackModal';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterBarbershop'>;

export const RegisterBarbershopScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ visible: boolean, type: 'success' | 'error', title: string, message: string }>({ visible: false, type: 'success', title: '', message: '' });

  const handleRegister = async () => {
    if (!name || !address) {
      setModal({ visible: true, type: 'error', title: 'Atenção', message: 'Preencha todos os campos.' });
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

      const response = await fetch(`http://${host}:3000/barbershops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, ownerId: user?.id })
      });

      if (response.ok) {
        setModal({ visible: true, type: 'success', title: 'Sucesso', message: 'Barbearia criada com sucesso!' });
      } else {
        throw new Error('Falha ao criar barbearia');
      }
    } catch (e) {
      setModal({ visible: true, type: 'error', title: 'Erro', message: 'Ocorreu um erro ao criar a barbearia.' });
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
        <Text style={styles.headerTitle}>Nova Barbearia</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Nome da Barbearia</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Barber Flash"
          placeholderTextColor="#838896"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Endereço</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Rua das Flores, 123"
          placeholderTextColor="#838896"
          value={address}
          onChangeText={setAddress}
        />

        <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
        </Pressable>
      </View>
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
  button: { backgroundColor: '#8162FF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 32 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
