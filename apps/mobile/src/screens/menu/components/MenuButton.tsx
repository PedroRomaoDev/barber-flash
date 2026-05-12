import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../menuStyles';
import type { MenuItem } from '../data';

type MenuButtonProps = {
  item: MenuItem;
};

export const MenuButton: React.FC<MenuButtonProps> = ({ item }) => (
  <View style={[styles.menuButton, item.active && styles.menuButtonActive]}>
    <Image source={{ uri: item.icon }} style={styles.menuIcon} />
    <Text style={styles.menuLabel}>{item.label}</Text>
  </View>
);
