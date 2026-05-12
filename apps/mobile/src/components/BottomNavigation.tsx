import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F1F1F',
    borderTopColor: '#2D2D2D',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: '#7C3AED',
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  labelActive: {
    color: '#7C3AED',
    fontWeight: 'bold',
  },
  labelInactive: {
    color: '#A0AEC0',
  },
});

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

export interface BottomNavigationProps {
  items: NavItem[];
  onPress: (id: string) => void;
}

const iconMap: Record<string, string> = {
  home: '🏠',
  search: '🔍',
  bookings: '📅',
  favorites: '❤️',
  profile: '👤',
};

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onPress(item.id)}
          style={[
            styles.navItem,
            item.active && styles.activeNavItem,
          ]}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{iconMap[item.icon] || item.icon}</Text>
          <Text
            style={[
              styles.label,
              item.active ? styles.labelActive : styles.labelInactive,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
