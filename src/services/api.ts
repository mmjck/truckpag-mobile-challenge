import { WordData, ApiError } from '../types';

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

/**
 * Fetches word details from the Free Dictionary API.
 *
 * @param word - The word to look up
 * @returns Word data with meanings, phonetics, etc.
 * @throws Error if word not found or API fails
 */
export async function fetchWordDetails(word: string): Promise<WordData> {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(word)}`);

  if (!response.ok) {
    if (response.status === 404) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Word not found');
    }
    throw new Error(`API error: ${response.status}`);
  }

  const data: WordData[] = await response.json();

  if (!data || data.length === 0) {
    throw new Error('No data returned for this word');
  }

  return data[0];
}
