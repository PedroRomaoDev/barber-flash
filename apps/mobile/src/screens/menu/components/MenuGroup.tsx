import React from 'react';
import { View } from 'react-native';
import { styles } from '../menuStyles';
import type { MenuItem } from '../data';
import { MenuButton } from './MenuButton';

type MenuGroupProps = {
  items: MenuItem[];
};

export const MenuGroup: React.FC<MenuGroupProps> = ({ items }) => (
  <View style={styles.menuGroup}>
    {items.map((item) => (
      <MenuButton key={item.id} item={item} />
    ))}
  </View>
);
