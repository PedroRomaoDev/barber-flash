import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../menuStyles';
import { menuAssets } from '../assets';

export const LoginDialog: React.FC = () => (
  <View style={styles.dialogCard}>
    <View style={styles.dialogTextGroup}>
      <Text style={styles.dialogTitle}>Faça login na plataforma</Text>
      <Text style={styles.dialogSubtitle}>
        Conecte-se usando sua conta do Google
      </Text>
    </View>
    <View style={styles.dialogButton}>
      <Image
        source={{ uri: menuAssets.googleIcon }}
        style={styles.dialogGoogleIcon}
      />
      <Text style={styles.dialogButtonText}>Google</Text>
    </View>
  </View>
);
