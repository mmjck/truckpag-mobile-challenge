import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  Animated,
  Keyboard,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { spacing, borderRadius, fontSize, layout, palette } from '../theme';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  resultCount?: number;
}

export function SearchBar({
  onSearch,
  placeholder = 'Buscar palavras...',
  resultCount,
}: SearchBarProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const cancelAnim = useRef(new Animated.Value(0)).current;

  const handleChange = useCallback(
    (text: string) => {
      setValue(text);
      onSearch(text);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
    inputRef.current?.focus();
  }, [onSearch]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    Animated.spring(cancelAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  }, [cancelAnim]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (!value) {
      Animated.spring(cancelAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }).start();
    }
  }, [cancelAnim, value]);

  const handleCancel = useCallback(() => {
    setValue('');
    onSearch('');
    Keyboard.dismiss();
    Animated.spring(cancelAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  }, [onSearch, cancelAnim]);

  const showCancel = isFocused || value.length > 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {/* Search Input Container */}
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: '#e5e5ea',
              borderColor: isFocused ? palette.blue : 'transparent',
              borderWidth: isFocused ? 2 : 0,
              flex: 1,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={isFocused ? palette.blue : colors.icon}
            style={styles.icon}
          />
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: colors.text }]}
            value={value}
            onChangeText={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={colors.inputPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="never"
            selectionColor={palette.blue}
          />
          {value.length > 0 && (
            <Pressable
              onPress={handleClear}
              style={({ pressed }) => [
                styles.clearButton,
                pressed && styles.clearButtonPressed,
              ]}
              hitSlop={8}
            >
              <View style={[styles.clearIcon, { backgroundColor: colors.icon }]}>
                <Ionicons name="close" size={12} color="#fff" />
              </View>
            </Pressable>
          )}
        </Animated.View>

        {/* Cancel Button */}
        {showCancel && (
          <Animated.View
            style={[
              styles.cancelContainer,
              {
                opacity: cancelAnim,
                transform: [
                  {
                    translateX: cancelAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Pressable onPress={handleCancel} style={styles.cancelButton}>
              <Text style={[styles.cancelText, { color: palette.blue }]}>
                Cancelar
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </View>

      {/* Result count badge */}
      {value.length > 0 && resultCount !== undefined && (
        <View style={styles.resultContainer}>
          <View style={[styles.resultBadge, { backgroundColor: '#f2f2f7' }]}>
            <Ionicons name="list" size={14} color={palette.blue} style={styles.resultIcon} />
            <Text style={[styles.resultText, { color: colors.textSecondary }]}>
              {resultCount === 0
                ? 'Nenhum resultado'
                : resultCount === 1
                ? '1 palavra encontrada'
                : `${resultCount.toLocaleString('pt-BR')} palavras encontradas`}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.base,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    height: '100%',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  clearButton: {
    padding: spacing.xs,
  },
  clearButtonPressed: {
    opacity: 0.6,
  },
  clearIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelContainer: {
    marginLeft: spacing.sm,
  },
  cancelButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultContainer: {
    marginTop: spacing.sm,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  resultIcon: {
    marginRight: spacing.xs,
  },
  resultText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
