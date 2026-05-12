import React from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { styles } from '../menuStyles';
import { menuAssets } from '../assets';

type LoginDialogProps = {
  onGooglePress: () => void;
  loading?: boolean;
  errorMessage?: string | null;
};

export const LoginDialog: React.FC<LoginDialogProps> = ({
  onGooglePress,
  loading = false,
  errorMessage = null,
}) => (
  <View style={styles.dialogCard}>
    <View style={styles.dialogTextGroup}>
      <Text style={styles.dialogTitle}>Faça login na plataforma</Text>
      <Text style={styles.dialogSubtitle}>
        Conecte-se usando sua conta do Google
      </Text>
    </View>
    <Pressable
      style={[styles.dialogButton, loading && styles.dialogButtonDisabled]}
      onPress={onGooglePress}
      disabled={loading}
    >
      <Image
        source={{ uri: menuAssets.googleIcon }}
        style={styles.dialogGoogleIcon}
      />
      <Text style={styles.dialogButtonText}>
        {loading ? 'Conectando...' : 'Google'}
      </Text>
      {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
    </Pressable>
    {!!errorMessage && (
      <Text style={styles.dialogErrorText}>{errorMessage}</Text>
    )}
  </View>
);
