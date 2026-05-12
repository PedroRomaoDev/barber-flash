import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  hero: {
    width: '100%',
    minHeight: 132,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
    backgroundColor: '#171717',
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.4)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#C4B5FD',
    fontSize: 12,
    fontWeight: '600',
  },
  heroMark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroMarkText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  heroPattern: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  heroLine: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#2D2D2D',
  },
  heroLineAccent: {
    backgroundColor: '#7C3AED',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    color: '#A0AEC0',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  rating: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: 'semibold',
  },
});

export interface ServiceCardProps {
  id: string;
  title: string;
  description?: string;
  onPress?: () => void;
  rating?: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  onPress,
  rating,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.8}
    >
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Serviço local</Text>
          </View>
          <View style={styles.heroMark}>
            <Text style={styles.heroMarkText}>B</Text>
          </View>
        </View>

        <View style={styles.heroPattern}>
          <View style={styles.heroLine} />
          <View style={[styles.heroLine, styles.heroLineAccent]} />
          <View style={styles.heroLine} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}

        {rating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
