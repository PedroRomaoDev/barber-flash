import React from 'react';
import { Text } from 'react-native';
import { styles } from '../homeStyles';

type SectionTitleProps = {
  text: string;
};

export const SectionTitle: React.FC<SectionTitleProps> = ({ text }) => (
  <Text style={styles.sectionTitle}>{text}</Text>
);
