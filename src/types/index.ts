/**
 * Types for the Dictionary App
 */

/** Phonetic information for a word */
export interface Phonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
}

/** Definition of a word meaning */
export interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

/** Meaning of a word (noun, verb, etc.) */
export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

/** Complete word data from Dictionary API */
export interface WordData {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license?: {
    name: string;
    url: string;
  };
  sourceUrls?: string[];
}

/** API error response */
export interface ApiError {
  title: string;
  message: string;
  resolution: string;
}

/** Favorite word stored in Firebase */
export interface FavoriteWord {
  word: string;
  addedAt: number;
}

/** History entry stored in Firebase */
export interface HistoryEntry {
  word: string;
  viewedAt: number;
}

/** User data */
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

/** Auth state */
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/** Auth context actions */
export interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

/** App context state */
export interface AppState {
  favorites: string[];
  history: string[];
  isLoading: boolean;
}

/** App context actions */
export interface AppContextValue extends AppState {
  addFavorite: (word: string) => Promise<void>;
  removeFavorite: (word: string) => Promise<void>;
  isFavorite: (word: string) => boolean;
  addToHistory: (word: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}
