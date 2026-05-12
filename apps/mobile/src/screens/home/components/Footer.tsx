import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../homeStyles';

type FooterProps = {
  brand: string;
};

export const Footer: React.FC<FooterProps> = ({ brand }) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>
      © 2026 Copyright <Text style={styles.footerTextBold}>{brand}</Text>
    </Text>
  </View>
);
