import React from 'react';
import { View, Image } from 'react-native';
import { styles } from '../homeStyles';
import { assets } from '../assets';

export const HomeHeader: React.FC = () => (
  <View style={styles.header}>
    <View style={styles.headerRow}>
      <View style={styles.logo}>
        <Image source={{ uri: assets.scissor }} style={styles.logoScissor} />
        <Image
          source={{ uri: assets.logoText }}
          style={styles.logoText}
          resizeMode="contain"
        />
      </View>
      <View style={styles.menuButton}>
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
      </View>
    </View>
    <View style={styles.divider} />
  </View>
);
