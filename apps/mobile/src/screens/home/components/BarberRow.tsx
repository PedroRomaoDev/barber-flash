import React from 'react';
import { ScrollView } from 'react-native';
import { styles } from '../homeStyles';
import type { BarberItem } from '../data';
import { BarberCard } from './BarberCard';

type BarberRowProps = {
  items: BarberItem[];
  prefix: string;
};

export const BarberRow: React.FC<BarberRowProps> = ({ items, prefix }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.cardsRow}
  >
    {items.map((item, index) => (
      <BarberCard
        key={`${prefix}-${item.id}-${index}`}
        name={item.name}
        address={item.address}
        image={item.imageUrl}
      />
    ))}
  </ScrollView>
);
