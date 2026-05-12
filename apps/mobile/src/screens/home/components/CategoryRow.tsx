import React from 'react';
import { ScrollView, View, Image, Text } from 'react-native';
import { styles } from '../homeStyles';
import type { CategoryItem } from '../data';

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
        {category.icon && (
          <Image source={{ uri: category.icon }} style={styles.categoryIcon} />
        )}
        <Text style={styles.categoryText}>{category.label}</Text>
      </View>
    ))}
  </ScrollView>
);
