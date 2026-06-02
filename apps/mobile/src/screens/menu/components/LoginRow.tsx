import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { styles } from '../menuStyles';
import { menuAssets } from '../assets';

type LoginRowProps = {
  onPress: () => void;
  label: string;
};

export const LoginRow: React.FC<LoginRowProps> = ({ onPress, label }) => (
  <Pressable style={styles.loginRow} onPress={onPress}>
    <Text style={styles.loginText}>{label}</Text>
    <View style={styles.iconButtonSquare}>
      <Text style={styles.loginText}> Fazer login</Text>
    </View>
  </Pressable>
);
