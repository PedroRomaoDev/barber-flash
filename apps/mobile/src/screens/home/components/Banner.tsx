import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../homeStyles';
import { assets } from '../assets';

import { Feather } from '@expo/vector-icons';

const BannerArt: React.FC = () => (
  <View style={[styles.bannerArt, { justifyContent: 'center', alignItems: 'center' }]}>
    {assets.bannerWindow ? (
      <>
        <Image source={assets.bannerWindow} style={styles.bannerWindow} />
        <Image source={assets.bannerStars} style={styles.bannerStars} />
        <Image source={assets.bannerCharacterTwo} style={styles.bannerCharacterTwo} />
      </>
    ) : (
      <Feather name="scissors" size={48} color="#8162FF" style={{ opacity: 0.5 }} />
    )}
  </View>
);

type BannerProps = {
  titleLines: string[];
  subtitle: string;
};

export const Banner: React.FC<BannerProps> = ({ titleLines, subtitle }) => (
  <View style={styles.banner}>
    <View style={styles.bannerContent}>
      {titleLines.map((line, index) => (
        <Text key={`${line}-${index}`} style={styles.bannerTitle}>
          {line}
        </Text>
      ))}
      <Text style={styles.bannerSubtitle}>{subtitle}</Text>
    </View>
    <BannerArt />
  </View>
);
