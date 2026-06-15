import React from 'react';
import { View, TextInput, Image } from 'react-native';
import { styles } from '../homeStyles';
import { assets } from '../assets';

import { Feather } from '@expo/vector-icons';

const SearchIcon: React.FC<{ color?: string }> = ({ color = "#838896" }) => (
  <View style={[styles.searchIconBox, { justifyContent: 'center', alignItems: 'center' }]}>
    {assets.search ? (
      <Image source={assets.search} style={styles.searchIconBox} />
    ) : (
      <Feather name="search" size={20} color={color} />
    )}
  </View>
);

export const SearchBar: React.FC<{ value?: string, onChangeText?: (text: string) => void, onSearch?: () => void }> = ({ value, onChangeText, onSearch }) => (
  <View style={styles.searchRow}>
    <View style={styles.searchInputWrapper}>
      <TextInput
        placeholder="Buscar"
        placeholderTextColor="#838896"
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
    </View>
    <View style={styles.searchButton} onTouchEnd={onSearch}>
      <SearchIcon color="#FFF" />
    </View>
  </View>
);
