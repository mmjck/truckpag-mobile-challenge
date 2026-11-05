import { useQuery } from '@tanstack/react-query';
import { fetchWordDetails } from '../services/api';
import { WordData } from '../types';

interface UseWordDetailsReturn {
  data: WordData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook for fetching word details with caching via React Query.
 *
 * @param word - The word to look up
 * @param enabled - Whether to fetch automatically
 */
export function useWordDetails(
  word: string,
  enabled: boolean = true
): UseWordDetailsReturn {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['word', word.toLowerCase()],
    queryFn: () => fetchWordDetails(word),
    enabled: enabled && !!word,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
    retry: 1,
  });

  return {
    data,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
}
