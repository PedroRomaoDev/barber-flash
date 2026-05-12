import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../menuStyles';
import { menuAssets } from '../assets';

type MenuHeaderProps = {
  onClose: () => void;
};

export const MenuHeader: React.FC<MenuHeaderProps> = ({ onClose }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Menu</Text>
    <TouchableOpacity
      style={styles.iconButton}
      activeOpacity={0.7}
      onPress={onClose}
    >
      <View style={styles.closeIcon}>
        <Image
          source={{ uri: menuAssets.closeStrokeOne }}
          style={styles.closeLineOne}
        />
        <Image
          source={{ uri: menuAssets.closeStrokeTwo }}
          style={styles.closeLineTwo}
        />
      </View>
    </TouchableOpacity>
  </View>
);
