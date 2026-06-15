import React from 'react';
import { ScrollView, View, Image, Text } from 'react-native';
import { styles } from '../homeStyles';
import type { CategoryItem } from '../data';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type CategoryRowProps = {
  categories: CategoryItem[];
};

export const CategoryRow: React.FC<CategoryRowProps> = ({ categories }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.categoryRow}
  >
    {categories.map((category) => {
      let iconName: any = 'help-circle-outline';
      if (category.label === 'Cabelo') {
        iconName = 'scissors-cutting';
      } else if (category.label === 'Barba') {
        iconName = 'mustache';
      } else if (category.label === 'Acabamento') {
        iconName = 'razor-double-edge';
      }

      return (
        <View key={category.id} style={styles.categoryChip}>
          {category.icon ? (
            <Image source={category.icon} style={styles.categoryIcon} />
          ) : (
            <MaterialCommunityIcons name={iconName} size={16} color="#FFF" />
          )}
          <Text style={styles.categoryText}>{category.label}</Text>
        </View>
      );
    })}
  </ScrollView>
);
