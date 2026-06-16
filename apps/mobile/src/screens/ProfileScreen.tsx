import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
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

  const roleLabel = user?.role === 'BARBERSHOP_OWNER'
    ? 'Dono de Barbearia'
    : user?.role === 'BARBER'
    ? 'Barbeiro'
    : 'Cliente';

  const roleColor = user?.role === 'BARBERSHOP_OWNER'
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
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: roleColor + '22', borderColor: roleColor }]}>
            <Text style={[styles.roleText, { color: roleColor }]}>{roleLabel}</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Feather name="user" size={16} color="#8162FF" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>{user?.name || '—'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Feather name="mail" size={16} color="#8162FF" />
            </View>
            <View>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{user?.email || '—'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Feather name="shield" size={16} color="#8162FF" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Perfil de acesso</Text>
              <Text style={styles.infoValue}>{roleLabel}</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={18} color="#FF4E4E" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#141518' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  content: { flex: 1, padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 32, marginTop: 12 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#8162FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#8162FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: { color: '#FFF', fontSize: 36, fontWeight: 'bold' },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  roleText: { fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase' },
  card: {
    backgroundColor: '#1A1B1F',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#26272B',
    marginBottom: 24,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 4 },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8162FF22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: { color: '#838896', fontSize: 11, marginBottom: 2 },
  infoValue: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#26272B', marginVertical: 12 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FF4E4E1A',
    borderWidth: 1,
    borderColor: '#FF4E4E55',
    borderRadius: 10,
    padding: 16,
  },
  logoutText: { color: '#FF4E4E', fontWeight: 'bold', fontSize: 16 },
});
