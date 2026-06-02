import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../homeStyles';
import { assets } from '../assets';

import { Feather } from '@expo/vector-icons';

type BarberCardProps = {
  name: string;
  address: string;
  image: any;
};

export const BarberCard: React.FC<BarberCardProps> = ({
  name,
  address,
  image,
}) => (
  <View style={styles.barberCard}>
    <View style={styles.barberImageWrapper}>
      {image ? (
        <Image source={image} style={styles.barberImage} />
      ) : (
        <View style={[styles.barberImage, { backgroundColor: '#1A1B1F', justifyContent: 'center', alignItems: 'center' }]}>
          <Feather name="scissors" size={32} color="#8162FF" />
        </View>
      )}
      <View style={styles.ratingBadge}>
        {assets.star ? (
          <Image source={assets.star} style={styles.ratingStar} />
        ) : (
          <Feather name="star" size={12} color="#8162FF" />
        )}
        <Text style={styles.ratingText}>5,0</Text>
      </View>
    </View>
    <View style={styles.barberInfo}>
      <View style={styles.barberTextBlock}>
        <Text style={styles.barberName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.barberAddress} numberOfLines={2}>
          {address}
        </Text>
      </View>
    </View>
  </View>
);
