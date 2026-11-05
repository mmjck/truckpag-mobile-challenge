import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { WordCard } from '@/src/components/WordCard';
import { useApp } from '@/src/contexts/AppContext';
import { useAuth } from '@/src/contexts/AuthContext';

export default function HistoryScreen() {
  const router = useRouter();
  const { history, isLoading, clearHistory } = useApp();
  const { user, signOut } = useAuth();

  const handleClearHistory = useCallback(() => {
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza que deseja limpar todo o histórico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => clearHistory(),
        },
      ]
    );
  }, [clearHistory]);

  const handleLogout = useCallback(() => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }, [signOut, router]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="time-outline" size={64} color="#c7c7cc" />
        <Text style={styles.emptyTitle}>Nenhum Histórico</Text>
        <Text style={styles.emptySubtitle}>
          As palavras que você visualizar aparecerão aqui
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Card do Usuário */}
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.displayName || 'Usuário'}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
        </View>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#ff3b30" />
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={styles.countText}>
          {history.length} {history.length === 1 ? 'palavra visualizada' : 'palavras visualizadas'}
        </Text>
        <Pressable onPress={handleClearHistory} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Limpar Tudo</Text>
        </Pressable>
      </View>
      <FlatList
        data={history}
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007aff',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 2,
    color: '#6e6e73',
  },
  logoutButton: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  list: {
    flex: 1,
  },
  countText: {
    fontSize: 13,
    color: '#6e6e73',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#ff3b30',
    fontSize: 15,
    fontWeight: '500',
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
