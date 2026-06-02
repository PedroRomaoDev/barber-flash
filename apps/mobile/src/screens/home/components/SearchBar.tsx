import React from 'react';
import { View, TextInput, Image } from 'react-native';
import { styles } from '../homeStyles';
import { assets } from '../assets';

import { Feather } from '@expo/vector-icons';

const SearchIcon: React.FC = () => (
  <View style={[styles.searchIconBox, { justifyContent: 'center', alignItems: 'center' }]}>
    {assets.search ? (
      <Image source={assets.search} style={styles.searchIconBox} />
    ) : (
      <Feather name="search" size={20} color="#838896" />
    )}
  </View>
);

export const SearchBar: React.FC<{ value?: string, onChangeText?: (text: string) => void }> = ({ value, onChangeText }) => (
  <View style={styles.searchRow}>
    <View style={styles.searchInputWrapper}>
      <TextInput
        placeholder="Buscar barbearias..."
        placeholderTextColor="#838896"
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
    <View style={styles.searchButton}>
      <SearchIcon />
    </View>
  </View>
);
