import React, { useState } from 'react';
import { View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { styles } from './menu/menuStyles';
import {
  MenuDivider,
  MenuGroup,
  MenuHeader,
  LoginRow,
  LoginDialog,
} from './menu/components';
import { primaryItems, serviceItems } from './menu/data';

type MenuScreenProps = {
  onClose: () => void;
  showLoginDialog?: boolean;
  dimmed?: boolean;
};

export const MenuScreen: React.FC<MenuScreenProps> = ({
  onClose,
  showLoginDialog = false,
  dimmed = false,
}) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const dialogOpen = showLoginDialog || isLoginOpen;
  const dimMenu = dimmed || dialogOpen;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.overlay}>
        <Pressable style={styles.overlayPressable} onPress={onClose} />
        <ScrollView
          contentContainerStyle={[
            styles.container,
            dimMenu && styles.containerDimmed,
          ]}
        >
          <MenuHeader onClose={onClose} />
          <LoginRow onPress={() => setIsLoginOpen(true)} />
          <MenuDivider />
          <MenuGroup items={primaryItems} />
          <MenuDivider />
          <MenuGroup items={serviceItems} />
        </ScrollView>
        {dialogOpen && (
          <View style={styles.dialogOverlay}>
            <Pressable
              style={styles.dialogBackdrop}
              onPress={() => setIsLoginOpen(false)}
            />
            <LoginDialog />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
