import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { styles } from '../menuStyles';
import type { MenuItem } from '../data';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

type MenuButtonProps = {
  item: MenuItem;
  onPress?: () => void;
};

export const MenuButton: React.FC<MenuButtonProps> = ({ item, onPress }) => {
  const iconColor = item.active ? '#FFFFFF' : '#838896';
  const textColor = item.active ? '#FFFFFF' : '#838896';

  const mciIcons = [
    'scissors-cutting',
    'mustache',
    'razor-double-edge',
    'eye-outline',
    'spa',
    'water',
    'briefcase',
    'user-plus',
    'scissors'
  ];

  const renderIcon = () => {
    if (!item.icon) {
      return <Feather name="circle" size={20} color={iconColor} />;
    }

    if (typeof item.icon === 'string') {
      if (mciIcons.includes(item.icon)) {
        return <MaterialCommunityIcons name={item.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']} size={20} color={iconColor} />;
      }
      return <Feather name={item.icon as React.ComponentProps<typeof Feather>['name']} size={20} color={iconColor} />;
    }

    return <Image source={item.icon} style={[styles.menuIcon, { tintColor: iconColor }]} />;
  };

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.menuButton, item.active && styles.menuButtonActive]}>
        <View style={{ position: 'relative' }}>
          {renderIcon()}
          {!!item.badge && (
            <View style={{
              position: 'absolute',
              top: -6,
              right: -8,
              backgroundColor: '#FF4E4E',
              borderRadius: 10,
              minWidth: 18,
              height: 18,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 4,
            }}>
              <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>{item.badge}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.menuLabel, { color: textColor }]}>{item.label}</Text>
      </View>
    </Pressable>
  );
};
