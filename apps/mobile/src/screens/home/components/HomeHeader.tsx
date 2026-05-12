import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { styles } from '../homeStyles';
import { assets } from '../assets';

type HomeHeaderProps = {
  onMenuPress: () => void;
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onMenuPress }) => (
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
      <TouchableOpacity
        style={styles.menuButton}
        activeOpacity={0.7}
        onPress={onMenuPress}
      >
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
        <View style={styles.menuLine} />
      </TouchableOpacity>
    </View>
    <View style={styles.divider} />
  </View>
);
