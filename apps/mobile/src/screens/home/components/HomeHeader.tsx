import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from '../homeStyles';
import { assets } from '../assets';

type HomeHeaderProps = {
  onMenuPress: () => void;
  onBellPress?: () => void;
  showBell?: boolean;
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onMenuPress, onBellPress, showBell }) => (
  <View style={styles.header}>
    <View style={styles.headerRow}>
      <Text style={styles.marca} >BARBER FLASH</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        {showBell && (
          <TouchableOpacity onPress={onBellPress} style={{ marginTop: 24 }}>
            <Feather name="bell" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
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
    </View>
    <View style={styles.divider} />
  </View>
);
