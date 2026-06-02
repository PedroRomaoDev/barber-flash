import React from 'react';
import { ScrollView, View, Image, Text } from 'react-native';
import { styles } from '../homeStyles';
import type { CategoryItem } from '../data';
import { Feather } from '@expo/vector-icons';

type CategoryRowProps = {
  categories: CategoryItem[];
};

export const CategoryRow: React.FC<CategoryRowProps> = ({ categories }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.categoryRow}
  >
    {categories.map((category) => (
      <View key={category.id} style={styles.categoryChip}>
        {category.icon ? (
          <Image source={category.icon} style={styles.categoryIcon} />
        ) : (
          <Feather name="list" size={16} color="#FFF" style={{ marginRight: 8 }} />
        )}
        <Text style={styles.categoryText}>{category.label}</Text>
      </View>
    ))}
  </ScrollView>
);
