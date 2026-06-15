import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../menuStyles';
import { menuAssets } from '../assets';

import { Feather } from '@expo/vector-icons';

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
      <View style={[styles.closeIcon, { justifyContent: 'center', alignItems: 'center' }]}>
        {menuAssets.closeStrokeOne ? (
          <>
            <Image source={menuAssets.closeStrokeOne} style={styles.closeLineOne} />
            <Image source={menuAssets.closeStrokeTwo} style={styles.closeLineTwo} />
          </>
        ) : (
          <Feather name="x" size={24} color="#FFF" />
        )}
      </View>
    </TouchableOpacity>
  </View>
);
