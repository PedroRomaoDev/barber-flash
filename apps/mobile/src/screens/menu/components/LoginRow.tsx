import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '../menuStyles';
import { Feather } from '@expo/vector-icons';

type LoginRowProps = {
  onPress: () => void;
  label: string;
};

export const LoginRow: React.FC<LoginRowProps> = ({ onPress, label }) => (
  <Pressable style={styles.loginRow} onPress={onPress}>
    <Text style={styles.loginText}>{label}</Text>
    <View style={[styles.iconButtonSquare, { width: 36, height: 36, borderRadius: 10, paddingHorizontal: 0 }]}>
      <Feather name="log-in" size={18} color="#FFF" />
    </View>
  </Pressable>
);
