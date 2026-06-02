import React from 'react';
import { View } from 'react-native';
import { styles } from '../menuStyles';
import type { MenuItem } from '../data';
import { MenuButton } from './MenuButton';

type MenuGroupProps = {
  items: MenuItem[];
  onAction?: (id: string) => void;
};

export const MenuGroup: React.FC<MenuGroupProps> = ({ items, onAction }) => (
  <View style={styles.menuGroup}>
    {items.map((item) => (
      <MenuButton key={item.id} item={item} onPress={() => onAction?.(item.id)} />
    ))}
  </View>
);
