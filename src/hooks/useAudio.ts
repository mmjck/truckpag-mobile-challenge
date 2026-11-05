import { useState, useCallback } from 'react';
import * as Speech from 'expo-speech';

interface UseAudioReturn {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  play: (word: string) => Promise<void>;
  stop: () => Promise<void>;
}

/**
 * Hook for speaking words using expo-speech (text-to-speech).
 * Works in Expo Go without native modules.
 */
export function useAudio(): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const play = useCallback(async (word: string) => {
    if (!word) {
      setError('Palavra não disponível');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Stop any ongoing speech
      await Speech.stop();

      setIsPlaying(true);

      Speech.speak(word, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => {
          setIsPlaying(false);
        },
        onError: () => {
          setError('Erro ao reproduzir áudio');
          setIsPlaying(false);
        },
        onStopped: () => {
          setIsPlaying(false);
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reproduzir áudio';
      setError(errorMessage);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stop = useCallback(async () => {
    try {
      await Speech.stop();
      setIsPlaying(false);
    } catch (err) {
      console.error('Error stopping speech:', err);
    }
  }, []);

  return {
    isPlaying,
    isLoading,
    error,
    play,
    stop,
  };
}
