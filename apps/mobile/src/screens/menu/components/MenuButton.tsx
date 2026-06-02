import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { styles } from '../menuStyles';
import type { MenuItem } from '../data';
import { Feather } from '@expo/vector-icons';

type MenuButtonProps = {
  item: MenuItem;
  onPress?: () => void;
};

export const MenuButton: React.FC<MenuButtonProps> = ({ item, onPress }) => (
  <Pressable onPress={onPress}>
    <View style={[styles.menuButton, item.active && styles.menuButtonActive]}>
      {item.icon ? (
        typeof item.icon === 'string' ? (
          <Feather name={item.icon as any} size={20} color="#FFF" style={{ marginRight: 12 }} />
        ) : (
          <Image source={item.icon as any} style={styles.menuIcon} />
        )
      ) : (
        <Feather name="circle" size={20} color="#FFF" style={{ marginRight: 12 }} />
      )}
      <Text style={styles.menuLabel}>{item.label}</Text>
    </View>
  </Pressable>
);
