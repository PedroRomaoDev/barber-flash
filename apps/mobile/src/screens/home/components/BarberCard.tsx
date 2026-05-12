import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../homeStyles';
import { assets } from '../assets';

type BarberCardProps = {
  name: string;
  address: string;
  image: string;
};

export const BarberCard: React.FC<BarberCardProps> = ({
  name,
  address,
  image,
}) => (
  <View style={styles.barberCard}>
    <View style={styles.barberImageWrapper}>
      <Image source={{ uri: image }} style={styles.barberImage} />
      <View style={styles.ratingBadge}>
        <Image source={{ uri: assets.star }} style={styles.ratingStar} />
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
      <TouchableOpacity style={styles.reserveButton} activeOpacity={0.85}>
        <Text style={styles.reserveButtonText}>Reservar</Text>
      </TouchableOpacity>
    </View>
  </View>
);
