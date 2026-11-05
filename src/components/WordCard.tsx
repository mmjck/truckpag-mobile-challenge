import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';
import { spacing, borderRadius, typography, layout, palette } from '../theme';

interface WordCardProps {
  word: string;
  showFavoriteButton?: boolean;
}

function WordCardComponent({ word, showFavoriteButton = true }: WordCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const { isFavorite, addFavorite, removeFavorite } = useApp();

  const favorite = isFavorite(word);
  const firstLetter = word.charAt(0).toUpperCase();

  const handlePress = useCallback(() => {
    router.push(`/word/${encodeURIComponent(word)}`);
  }, [router, word]);

  const handleFavoritePress = useCallback(async () => {
    if (favorite) {
      await removeFavorite(word);
    } else {
      await addFavorite(word);
    }
  }, [favorite, word, addFavorite, removeFavorite]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.card,
          shadowColor: '#000',
          shadowOpacity: 0.08,
        },
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      {/* Avatar com inicial */}
      <View style={[styles.avatar, { backgroundColor: palette.blue }]}>
        <Text style={styles.avatarText}>{firstLetter}</Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={[styles.word, { color: colors.text }]} numberOfLines={1}>
          {word}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Toque para ver definição
        </Text>
      </View>

      {/* Botão favorito */}
      {showFavoriteButton && (
        <Pressable
          onPress={handleFavoritePress}
          style={({ pressed }) => [
            styles.favoriteButton,
            { backgroundColor: favorite ? 'rgba(255,59,48,0.1)' : 'transparent' },
            pressed && styles.favoritePressed,
          ]}
          hitSlop={8}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={layout.iconMd}
            color={favorite ? palette.red : colors.icon}
          />
        </Pressable>
      )}

      {/* Chevron */}
      <View style={styles.chevronContainer}>
        <Ionicons name="chevron-forward" size={18} color={colors.icon} />
      </View>
    </Pressable>
  );
}

export const WordCard = memo(WordCardComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    marginHorizontal: spacing.base,
    marginVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    // Shadow para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    // Elevation para Android
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  word: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  favoriteButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
  },
  favoritePressed: {
    opacity: 0.7,
  },
  chevronContainer: {
    padding: spacing.xs,
  },
});
