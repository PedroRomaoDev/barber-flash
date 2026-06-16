import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useToast } from '../contexts/ToastContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const toast = useToast();

  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('')
    : '?';

  const roleLabel =
    user?.role === 'BARBERSHOP_OWNER'
      ? 'Dono de Barbearia'
      : user?.role === 'BARBER'
      ? 'Barbeiro'
      : 'Cliente';

  const roleColor =
    user?.role === 'BARBERSHOP_OWNER'
      ? '#F5A623'
      : user?.role === 'BARBER'
      ? '#00D084'
      : '#8162FF';

  const handleLogout = () => {
    void logout();
    toast.show({ message: 'Você saiu da sua conta.', type: 'info' });
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header — mesmo padrão do resto do app */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero — gradiente que se funde com o fundo #141518 */}
        <LinearGradient
          colors={['#2B1F5C', '#1A1035', '#141518']}
          locations={[0, 0.55, 1]}
          style={styles.heroSection}
        >
          {/* Halo roxo atrás do avatar */}
          <View style={styles.glowBehind} />

          {/* Anel gradiente */}
          <LinearGradient
            colors={['#9B7FFF', '#8162FF', '#6B4FE0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </LinearGradient>

          <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>

          {/* Badge de role */}
          <View style={[styles.roleBadge, { borderColor: roleColor + '66' }]}>
            <View style={[styles.roleDot, { backgroundColor: roleColor }]} />
            <Text style={[styles.roleText, { color: roleColor }]}>{roleLabel.toUpperCase()}</Text>
          </View>
        </LinearGradient>

        {/* ——— Informações da conta ——— */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMAÇÕES DA CONTA</Text>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconBg, { backgroundColor: '#8162FF22' }]}>
                <Feather name="user" size={16} color="#8162FF" />
              </View>
              <View style={styles.infoTexts}>
                <Text style={styles.infoLabel}>Nome completo</Text>
                <Text style={styles.infoValue}>{user?.name || '—'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIconBg, { backgroundColor: '#8162FF22' }]}>
                <Feather name="mail" size={16} color="#8162FF" />
              </View>
              <View style={styles.infoTexts}>
                <Text style={styles.infoLabel}>E-mail</Text>
                <Text style={styles.infoValue}>{user?.email || '—'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIconBg, { backgroundColor: roleColor + '22' }]}>
                <Feather name="shield" size={16} color={roleColor} />
              </View>
              <View style={styles.infoTexts}>
                <Text style={styles.infoLabel}>Perfil de acesso</Text>
                <Text style={[styles.infoValue, { color: roleColor }]}>{roleLabel}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ——— Ações ——— */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AÇÕES</Text>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <View style={styles.logoutIconBg}>
              <Feather name="log-out" size={18} color="#FF4E4E" />
            </View>
            <Text style={styles.logoutText}>Sair da conta</Text>
            <Feather name="chevron-right" size={18} color="#FF4E4E55" style={{ marginLeft: 'auto' }} />
          </Pressable>
        </View>

        <Text style={styles.footer}>Flash Barber © 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Mesmo background do restante do app
  screen: { flex: 1, backgroundColor: '#141518' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#141518',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },

  scroll: { paddingBottom: 40 },

  // Hero com gradiente que funde no #141518 (sem corte visível)
  heroSection: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  glowBehind: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#8162FF',
    opacity: 0.07,
    top: -20,
    alignSelf: 'center',
  },
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#8162FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 12,
  },
  avatarInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1C1045',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontFamily: 'Nunito_700Bold',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 6,
  },
  userEmail: {
    color: '#838896',
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 20,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF08',
  },
  roleDot: { width: 6, height: 6, borderRadius: 3 },
  roleText: { fontSize: 11, fontFamily: 'Nunito_700Bold', letterSpacing: 1 },

  // Sections — mesma linguagem das outras telas
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    color: '#55585F',
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#1A1B1F',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#26272B',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTexts: { flex: 1 },
  infoLabel: {
    color: '#55585F',
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 3,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#26272B',
    marginLeft: 66,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FF4E4E0F',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FF4E4E33',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  logoutIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FF4E4E22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF4E4E',
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
  },

  footer: {
    color: '#3A3B3F',
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
    marginTop: 40,
  },
});
