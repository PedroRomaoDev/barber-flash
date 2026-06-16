import React from 'react';
import { ScrollView, Image, Text, Pressable } from 'react-native';
import { styles } from '../homeStyles';
import type { CategoryItem } from '../data';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type CategoryRowProps = {
  categories: CategoryItem[];
  onCategoryPress?: (label: string) => void;
};

export const CategoryRow: React.FC<CategoryRowProps> = ({ categories, onCategoryPress }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.categoryRow}
  >
    {categories.map((category) => {
      let iconName = 'help-circle-outline' as React.ComponentProps<typeof MaterialCommunityIcons>['name'];
      if (category.label === 'Cabelo') {
        iconName = 'scissors-cutting';
      } else if (category.label === 'Barba') {
        iconName = 'mustache';
      } else if (category.label === 'Acabamento') {
        iconName = 'razor-double-edge';
      }

      return (
        <Pressable key={category.id} style={styles.categoryChip} onPress={() => onCategoryPress && onCategoryPress(category.label)}>
          {category.icon ? (
            <Image source={category.icon} style={styles.categoryIcon} />
          ) : (
            <MaterialCommunityIcons name={iconName} size={16} color="#FFF" />
          )}
          <Text style={styles.categoryText}>{category.label}</Text>
        </Pressable>
      );
    })}
  </ScrollView>
);
