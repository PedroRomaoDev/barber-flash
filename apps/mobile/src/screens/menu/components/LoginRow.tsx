import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { styles } from '../menuStyles';
import { menuAssets } from '../assets';

type LoginRowProps = {
  onPress: () => void;
};

export const LoginRow: React.FC<LoginRowProps> = ({ onPress }) => (
  <Pressable style={styles.loginRow} onPress={onPress}>
    <Text style={styles.loginText}>Olá. Faça seu login!</Text>
    <View style={styles.iconButtonSquare}>
      <View style={styles.loginIconWrap}>
        <Image
          source={{ uri: menuAssets.loginArrowOuter }}
          style={styles.loginArrowOuter}
        />
        <Image
          source={{ uri: menuAssets.loginArrowInner }}
          style={styles.loginArrowInner}
        />
        <Image
          source={{ uri: menuAssets.loginArrowStem }}
          style={styles.loginArrowStem}
        />
      </View>
    </View>
  </Pressable>
);
