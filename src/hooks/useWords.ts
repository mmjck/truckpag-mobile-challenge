import { useState, useCallback, useEffect } from 'react';
import { getWordsPaginated } from '../services/wordList';

const PAGE_SIZE = 50;

interface UseWordsReturn {
  words: string[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  total: number;
  loadMore: () => Promise<void>;
  search: (term: string) => void;
  searchTerm: string;
  refresh: () => Promise<void>;
}

/**
 * Hook for managing the paginated word list with search functionality.
 */
export function useWords(): UseWordsReturn {
  const [words, setWords] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const loadWords = useCallback(
    async (pageNum: number, filter: string, append: boolean) => {
      try {
        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const result = await getWordsPaginated(pageNum, PAGE_SIZE, filter);

        if (append) {
          setWords((prev) => [...prev, ...result.words]);
        } else {
          setWords(result.words);
        }

        setHasMore(result.hasMore);
        setTotal(result.total);
        setPage(pageNum);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load words'));
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    loadWords(0, '', false);
  }, [loadWords]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    await loadWords(page + 1, searchTerm, true);
  }, [isLoadingMore, hasMore, page, searchTerm, loadWords]);

  const search = useCallback(
    (term: string) => {
      setSearchTerm(term);
      loadWords(0, term, false);
    },
    [loadWords]
  );

  const refresh = useCallback(async () => {
    await loadWords(0, searchTerm, false);
  }, [searchTerm, loadWords]);

  return {
    words,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    total,
    loadMore,
    search,
    searchTerm,
    refresh,
  };
}
