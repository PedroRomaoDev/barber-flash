import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../homeStyles';

type GreetingProps = {
  title: string;
  highlight: string;
  subtitle: string;
};

export const Greeting: React.FC<GreetingProps> = ({
  title,
  highlight,
  subtitle,
}) => (
  <View style={styles.greeting}>
    <Text style={styles.greetingTitle}>
      {title} <Text style={styles.greetingName}>{highlight}</Text>
    </Text>
    <Text style={styles.greetingSubtitle}>{subtitle}</Text>
  </View>
);
