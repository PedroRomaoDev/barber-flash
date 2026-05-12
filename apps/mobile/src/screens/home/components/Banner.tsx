import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../homeStyles';
import { assets } from '../assets';

const BannerArt: React.FC = () => (
  <View style={styles.bannerArt}>
    <Image
      source={{ uri: assets.bannerBackground }}
      style={styles.bannerBackground}
    />
    <Image source={{ uri: assets.bannerWindow }} style={styles.bannerWindow} />
    <Image source={{ uri: assets.bannerStars }} style={styles.bannerStars} />
    <Image
      source={{ uri: assets.bannerCharacterTwo }}
      style={styles.bannerCharacterTwo}
    />
    <Image
      source={{ uri: assets.bannerCharacterOne }}
      style={styles.bannerCharacterOne}
    />
    <Image source={{ uri: assets.bannerTable }} style={styles.bannerTable} />
    <Image source={{ uri: assets.bannerMirror }} style={styles.bannerMirror} />
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
