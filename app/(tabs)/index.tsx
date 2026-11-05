import { View, StyleSheet, Text } from 'react-native';

import { SearchBar } from '@/src/components/SearchBar';
import { WordList } from '@/src/components/WordList';
import { useWords } from '@/src/hooks/useWords';

export default function WordsScreen() {
  const {
    words,
    isLoading,
    isLoadingMore,
    hasMore,
    total,
    loadMore,
    search,
    searchTerm,
    refresh,
  } = useWords();

  return (
    <View style={styles.container}>
      <SearchBar
        onSearch={search}
        placeholder="Buscar palavras..."
        resultCount={searchTerm ? total : undefined}
      />
      {!isLoading && !searchTerm && (
        <Text style={styles.countText}>
          {total.toLocaleString('pt-BR')} palavras
        </Text>
      )}
      <WordList
        words={words}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onRefresh={refresh}
        emptyMessage={
          searchTerm
            ? `Nenhuma palavra encontrada para "${searchTerm}"`
            : 'Nenhuma palavra disponível'
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  countText: {
    fontSize: 13,
    marginHorizontal: 16,
    marginBottom: 8,
    color: '#6e6e73',
  },
});
