import React from 'react';
import { View, Text, Image } from 'react-native';
import { styles } from '../homeStyles';

import { Feather } from '@expo/vector-icons';

import { ImageSourcePropType } from 'react-native';

type ScheduleCardProps = {
  status: string;
  service: string;
  barberName: string;
  avatar?: ImageSourcePropType | null;
  month: string;
  day: string;
  time: string;
};

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  status,
  service,
  barberName,
  avatar,
  month,
  day,
  time,
}) => (
  <View style={styles.scheduleCard}>
    <View style={styles.scheduleInfo}>
      <View style={styles.statusPill}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
      <View style={styles.scheduleDetails}>
        <Text style={styles.scheduleTitle}>{service}</Text>
        <View style={styles.scheduleBarber}>
          <View style={[styles.scheduleAvatarWrapper, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#26272B' }]}>
            {avatar ? (
              <Image source={avatar} style={styles.scheduleAvatar} resizeMode="cover" />
            ) : (
              <Feather name="user" size={16} color="#FFF" />
            )}
          </View>
          <Text style={styles.scheduleBarberName}>{barberName}</Text>
        </View>
      </View>
    </View>
    <View style={styles.scheduleDate}>
      <Text style={styles.scheduleMonth}>{month}</Text>
      <Text style={styles.scheduleDay}>{day}</Text>
      <Text style={styles.scheduleTime}>{time}</Text>
    </View>
  </View>
);
