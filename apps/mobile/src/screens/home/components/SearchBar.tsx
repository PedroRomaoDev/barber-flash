import React from 'react';
import { View, TextInput, Image } from 'react-native';
import { styles } from '../homeStyles';
import { assets } from '../assets';

const SearchIcon: React.FC = () => (
  <View style={styles.searchIconBox}>
    <Image source={{ uri: assets.searchLens }} style={styles.searchLens} />
    <Image source={{ uri: assets.searchHandle }} style={styles.searchHandle} />
  </View>
);

export const SearchBar: React.FC = () => (
  <View style={styles.searchRow}>
    <View style={styles.searchInputWrapper}>
      <TextInput
        placeholder="Buscar"
        placeholderTextColor="#838896"
        style={styles.searchInput}
      />
    </View>
    <View style={styles.searchButton}>
      <SearchIcon />
    </View>
  </View>
);
