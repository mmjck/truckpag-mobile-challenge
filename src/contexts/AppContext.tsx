import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { AppContextValue } from '../types';
import {
  addFavorite as addFavoriteToDb,
  removeFavorite as removeFavoriteFromDb,
  getFavorites,
  addToHistory as addToHistoryDb,
  getHistory,
  clearHistory as clearHistoryDb,
} from '../services/firebase';
import { useAuth } from './AuthContext';

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data when user changes
  useEffect(() => {
    async function loadData() {
      if (!isAuthenticated || !user) {
        setFavorites([]);
        setHistory([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [favs, hist] = await Promise.all([
          getFavorites(user.uid),
          getHistory(user.uid),
        ]);

        setFavorites(favs);
        setHistory(hist);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user, isAuthenticated]);

  const addFavorite = useCallback(
    async (word: string) => {
      if (!user) return;

      // Optimistic update
      setFavorites((prev) => {
        if (prev.includes(word)) return prev;
        return [word, ...prev];
      });

      try {
        await addFavoriteToDb(user.uid, word);
      } catch (error) {
        // Revert on error
        setFavorites((prev) => prev.filter((w) => w !== word));
        console.error('Error adding favorite:', error);
        throw error;
      }
    },
    [user]
  );

  const removeFavorite = useCallback(
    async (word: string) => {
      if (!user) return;

      // Optimistic update
      setFavorites((prev) => prev.filter((w) => w !== word));

      try {
        await removeFavoriteFromDb(user.uid, word);
      } catch (error) {
        // Revert on error
        setFavorites((prev) => [...prev, word]);
        console.error('Error removing favorite:', error);
        throw error;
      }
    },
    [user]
  );

  const isFavorite = useCallback(
    (word: string) => {
      return favorites.includes(word);
    },
    [favorites]
  );

  const addToHistory = useCallback(
    async (word: string) => {
      if (!user) return;

      // Update local state (move to top if exists, add if new)
      setHistory((prev) => {
        const filtered = prev.filter((w) => w !== word);
        return [word, ...filtered];
      });

      try {
        await addToHistoryDb(user.uid, word);
      } catch (error) {
        console.error('Error adding to history:', error);
      }
    },
    [user]
  );

  const clearHistoryHandler = useCallback(async () => {
    if (!user) return;

    const previousHistory = history;
    setHistory([]);

    try {
      await clearHistoryDb(user.uid);
    } catch (error) {
      // Revert on error
      setHistory(previousHistory);
      console.error('Error clearing history:', error);
      throw error;
    }
  }, [user, history]);

  const value: AppContextValue = {
    favorites,
    history,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    addToHistory,
    clearHistory: clearHistoryHandler,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook to access the app context.
 */
export function useApp(): AppContextValue {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
}
