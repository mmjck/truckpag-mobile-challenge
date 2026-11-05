import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { WordCard } from '@/src/components/WordCard';
import { useApp } from '@/src/contexts/AppContext';

export default function FavoritesScreen() {
  const { favorites, isLoading } = useApp();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="heart-outline" size={64} color="#c7c7cc" />
        <Text style={styles.emptyTitle}>Nenhum Favorito</Text>
        <Text style={styles.emptySubtitle}>
          Toque no ícone de coração em qualquer palavra para salvá-la aqui
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.countText}>
        {favorites.length} {favorites.length === 1 ? 'favorito' : 'favoritos'}
      </Text>
      <FlatList
        data={favorites}
        renderItem={({ item }) => <WordCard word={item} />}
        keyExtractor={(item) => item}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#f2f2f7',
  },
  list: {
    flex: 1,
  },
  countText: {
    fontSize: 13,
    marginHorizontal: 16,
    marginVertical: 8,
    color: '#6e6e73',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
    color: '#000',
  },
  emptySubtitle: {
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
    color: '#6e6e73',
  },
});
