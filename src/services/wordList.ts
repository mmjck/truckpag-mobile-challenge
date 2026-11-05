const WORDS_URL =
  'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json';

let cachedWords: string[] | null = null;

/**
 * Fetches and parses the English words dictionary from GitHub.
 * The result is cached in memory for subsequent calls.
 *
 * @returns Array of English words sorted alphabetically
 */
export async function fetchWordList(): Promise<string[]> {
  if (cachedWords) {
    return cachedWords;
  }

  try {
    const response = await fetch(WORDS_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch word list: ${response.status}`);
    }

    const data: Record<string, number> = await response.json();
    cachedWords = Object.keys(data).sort();

    return cachedWords;
  } catch (error) {
    console.error('Error fetching word list:', error);
    throw error;
  }
}

/**
 * Gets a paginated slice of words from the cached list.
 *
 * @param page - Page number (0-indexed)
 * @param pageSize - Number of words per page
 * @param filter - Optional search filter
 * @returns Paginated words and metadata
 */
export async function getWordsPaginated(
  page: number,
  pageSize: number = 50,
  filter?: string
): Promise<{
  words: string[];
  hasMore: boolean;
  total: number;
}> {
  const allWords = await fetchWordList();

  let filteredWords = allWords;
  if (filter && filter.trim()) {
    const search = filter.toLowerCase().trim();
    filteredWords = allWords.filter((word) =>
      word.toLowerCase().startsWith(search)
    );
  }

  const start = page * pageSize;
  const end = start + pageSize;
  const words = filteredWords.slice(start, end);

  return {
    words,
    hasMore: end < filteredWords.length,
    total: filteredWords.length,
  };
}

/**
 * Clears the cached word list (useful for memory management).
 */
export function clearWordCache(): void {
  cachedWords = null;
}
