import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { styles } from '../menuStyles';
import { AntDesign } from '@expo/vector-icons';

type LoginDialogProps = {
  onGooglePress: () => void;
  loading?: boolean;
  errorMessage?: string | null;
};

export const LoginDialog: React.FC<LoginDialogProps> = ({
  onGooglePress,
  loading = false,
  errorMessage = null,
}) => {
  return (
    <View style={styles.dialogCard}>
      <View style={styles.dialogTextGroup}>
        <Text style={styles.dialogTitle}>Faça login na plataforma</Text>
        <Text style={styles.dialogSubtitle}>Conecte-se usando sua conta do Google</Text>
      </View>

      <Pressable
        style={[
          styles.dialogButton,
          { backgroundColor: '#1E1E22', borderColor: '#26272B', paddingVertical: 12 },
          loading && styles.dialogButtonDisabled,
        ]}
        onPress={onGooglePress}
        disabled={loading}
      >
        <AntDesign name="google" size={18} color="#FFFFFF" />
        <Text style={[styles.dialogButtonText, { fontFamily: 'Nunito_700Bold' }]}>Google</Text>
        {loading && <ActivityIndicator size="small" color="#FFFFFF" style={{ marginLeft: 8 }} />}
      </Pressable>

      {!!errorMessage && (
        <Text style={styles.dialogErrorText}>{errorMessage}</Text>
      )}
    </View>
  );
};
