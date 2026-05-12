import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../menuStyles';
import { menuAssets } from '../assets';

export const LoginRow: React.FC = () => (
  <View style={styles.loginRow}>
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
  </View>
);
