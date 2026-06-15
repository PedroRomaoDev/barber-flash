import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../homeStyles';

type HomeHeaderProps = {
  onMenuPress: () => void;
  onBellPress?: () => void;
  showBell?: boolean;
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onMenuPress, onBellPress, showBell }) => (
  <View style={styles.header}>
    <View style={styles.headerRow}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 30 }}>
        <MaterialCommunityIcons name="content-cut" size={20} color="#8162FF" style={{ transform: [{ rotate: '-45deg' }] }} />
        <Text style={{ color: '#FFF', fontSize: 16, fontFamily: 'Nunito_700Bold', letterSpacing: 1 }}>
          FSW <Text style={{ color: '#8162FF' }}>BARBER</Text>
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        {showBell && (
          <TouchableOpacity onPress={onBellPress} style={{ marginTop: 30 }}>
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
