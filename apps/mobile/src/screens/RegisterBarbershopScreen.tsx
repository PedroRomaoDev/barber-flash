import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  ActivityIndicator, ScrollView, KeyboardAvoidingView,
  Platform, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import Constants from 'expo-constants';
import { FeedbackModal } from '../components/FeedbackModal';
import { useToast } from '../contexts/ToastContext';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterBarbershop'>;

export const RegisterBarbershopScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [modal, setModal] = useState<{ visible: boolean; type: 'success' | 'error'; title: string; message: string }>({ visible: false, type: 'success', title: '', message: '' });
  const toast = useToast();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      toast.show({ message: 'Permissão de galeria negada.', type: 'error' });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.6,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!name || !address) {
      toast.show({ message: 'Nome e endereço são obrigatórios!', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      let host = 'localhost';
      if (Constants.expoConfig?.hostUri) host = Constants.expoConfig.hostUri.split(':')[0];
      else if (Platform.OS === 'android') host = '10.0.2.2';

      // Build imageUrl: use the URI directly (works for hosted images)
      // For local files, we store the URI as-is — in production this would be an upload
      const imageUrl = imageUri ?? null;

      const response = await fetch(`http://${host}:3000/barbershops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          address,
          phone: phone || null,
          imageUrl,
          ownerId: user?.id,
        }),
      });

      if (response.ok) {
        setModal({ visible: true, type: 'success', title: 'Sucesso!', message: 'Sua barbearia foi criada com sucesso!' });
        toast.show({ message: 'Barbearia criada com sucesso!', type: 'success' });
      } else {
        throw new Error('Falha ao criar barbearia');
      }
    } catch {
      setModal({ visible: true, type: 'error', title: 'Erro', message: 'Ocorreu um erro ao criar a barbearia.' });
      toast.show({ message: 'Ocorreu um erro ao criar a barbearia.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    const wasSuccess = modal.type === 'success';
    setModal({ ...modal, visible: false });
    if (wasSuccess) navigation.goBack();
  };

  const isValid = name.trim().length > 0 && address.trim().length > 0;

  return (
    <SafeAreaView style={styles.screen}>
      <FeedbackModal visible={modal.visible} type={modal.type} title={modal.title} message={modal.message} onClose={handleCloseModal} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Nova Barbearia</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Hero */}
          <View style={styles.heroBadge}>
            <LinearGradient colors={['#8162FF33', '#8162FF11']} style={styles.heroBadgeIcon}>
              <Feather name="scissors" size={28} color="#8162FF" />
            </LinearGradient>
            <Text style={styles.heroTitle}>Crie sua Barbearia</Text>
            <Text style={styles.heroSubtitle}>Preencha as informações abaixo para registrar{'\n'}sua barbearia na plataforma Flash Barber.</Text>
          </View>

          {/* Foto da Barbearia */}
          <View style={styles.formCard}>
            <Text style={styles.sectionLabel}>FOTO DA BARBEARIA</Text>

            <Pressable style={styles.imagePickerContainer} onPress={() => { void handlePickImage(); }}>
              {imageUri ? (
                <>
                  <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
                  <View style={styles.imageOverlay}>
                    <Feather name="camera" size={20} color="#FFF" />
                    <Text style={styles.imageOverlayText}>Alterar foto</Text>
                  </View>
                </>
              ) : (
                <LinearGradient colors={['#26272B', '#1A1B1F']} style={styles.imagePlaceholder}>
                  <LinearGradient colors={['#8162FF33', '#8162FF11']} style={styles.cameraIconBg}>
                    <Feather name="camera" size={24} color="#8162FF" />
                  </LinearGradient>
                  <Text style={styles.imagePlaceholderTitle}>Adicionar foto</Text>
                  <Text style={styles.imagePlaceholderSub}>Toque para selecionar da galeria</Text>
                </LinearGradient>
              )}
            </Pressable>
          </View>

          {/* Informações Básicas */}
          <View style={styles.formCard}>
            <Text style={styles.sectionLabel}>INFORMAÇÕES BÁSICAS</Text>

            {/* Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome da Barbearia *</Text>
              <View style={[styles.inputWrapper, nameFocused && styles.inputWrapperFocused]}>
                <Feather name="award" size={18} color={nameFocused ? '#8162FF' : '#55585F'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Vintage Barber Shop"
                  placeholderTextColor="#3A3B3F"
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                />
              </View>
            </View>

            {/* Endereço */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Endereço Completo *</Text>
              <View style={[styles.inputWrapper, addressFocused && styles.inputWrapperFocused]}>
                <Feather name="map-pin" size={18} color={addressFocused ? '#8162FF' : '#55585F'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Rua das Flores, 123 — São Paulo"
                  placeholderTextColor="#3A3B3F"
                  value={address}
                  onChangeText={setAddress}
                  onFocus={() => setAddressFocused(true)}
                  onBlur={() => setAddressFocused(false)}
                />
              </View>
            </View>

            {/* Telefone */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone de Contato</Text>
              <View style={[styles.inputWrapper, phoneFocused && styles.inputWrapperFocused]}>
                <Feather name="phone" size={18} color={phoneFocused ? '#8162FF' : '#55585F'} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: (11) 98765-4321"
                  placeholderTextColor="#3A3B3F"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                />
              </View>
            </View>
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
                  <Text style={[styles.submitText, !isValid && { color: '#55585F' }]}>Cadastrar Barbearia</Text>
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
  screen: { flex: 1, backgroundColor: '#141518' },

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

  // Image picker
  imagePickerContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 160,
    borderWidth: 1,
    borderColor: '#303136',
    borderStyle: 'dashed',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  imageOverlayText: { color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 13 },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  cameraIconBg: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8162FF44',
  },
  imagePlaceholderTitle: { color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 15 },
  imagePlaceholderSub: { color: '#55585F', fontFamily: 'Nunito_400Regular', fontSize: 13 },

  // Inputs
  inputGroup: { marginBottom: 16 },
  inputLabel: { color: '#838896', fontFamily: 'Nunito_700Bold', fontSize: 13, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#26272B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#303136',
  },
  inputWrapperFocused: {
    borderColor: '#8162FF',
    backgroundColor: '#8162FF0A',
  },
  inputIcon: { paddingLeft: 14, paddingRight: 4 },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 14,
    color: '#FFFFFF',
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
  },

  // Submit
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
