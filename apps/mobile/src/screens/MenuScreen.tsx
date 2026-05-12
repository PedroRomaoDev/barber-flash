import React from 'react';
import { View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { styles } from './menu/menuStyles';
import {
  MenuDivider,
  MenuGroup,
  MenuHeader,
  LoginRow,
} from './menu/components';
import { primaryItems, serviceItems } from './menu/data';

type MenuScreenProps = {
  onClose: () => void;
};

export const MenuScreen: React.FC<MenuScreenProps> = ({ onClose }) => (
  <SafeAreaView style={styles.screen}>
    <View style={styles.overlay}>
      <Pressable style={styles.overlayPressable} onPress={onClose} />
      <ScrollView contentContainerStyle={styles.container}>
        <MenuHeader onClose={onClose} />
        <LoginRow />
        <MenuDivider />
        <MenuGroup items={primaryItems} />
        <MenuDivider />
        <MenuGroup items={serviceItems} />
      </ScrollView>
    </View>
  </SafeAreaView>
);
