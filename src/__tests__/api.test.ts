/// <reference types="jest" />

/**
 * Testes para o serviço de API do dicionário
 */
import { fetchWordDetails } from '../services/api';
import { WordData } from '../types';

// Mock do fetch global
const mockFetch = (globalThis as any).fetch as jest.Mock;

describe('Dictionary API Service', () => {
  describe('fetchWordDetails', () => {
    const mockWordData: WordData = {
      word: 'hello',
      phonetic: '/həˈloʊ/',
      phonetics: [
        {
          text: '/həˈloʊ/',
          audio: 'https://api.dictionaryapi.dev/media/pronunciations/en/hello-us.mp3',
        },
      ],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'A greeting.',
              example: 'She gave me a warm hello.',
              synonyms: ['greeting', 'salutation'],
              antonyms: ['goodbye', 'farewell'],
            },
          ],
          synonyms: ['greeting'],
          antonyms: ['goodbye'],
        },
        {
          partOfSpeech: 'verb',
          definitions: [
            {
              definition: 'To greet with "hello".',
              synonyms: [],
              antonyms: [],
            },
          ],
          synonyms: [],
          antonyms: [],
        },
      ],
      license: {
        name: 'CC BY-SA 3.0',
        url: 'https://creativecommons.org/licenses/by-sa/3.0',
      },
      sourceUrls: ['https://en.wiktionary.org/wiki/hello'],
    };

    it('deve retornar dados da palavra quando a API responde com sucesso', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockWordData],
      });

      const result = await fetchWordDetails('hello');

      expect(result).toEqual(mockWordData);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.dictionaryapi.dev/api/v2/entries/en/hello'
      );
    });

    it('deve codificar palavras com caracteres especiais na URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockWordData],
      });

      await fetchWordDetails('café');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.dictionaryapi.dev/api/v2/entries/en/caf%C3%A9'
      );
    });

    it('deve lançar erro quando a palavra não é encontrada (404)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          title: 'No Definitions Found',
          message: 'Sorry pal, we couldn\'t find definitions for the word you were looking for.',
          resolution: 'You can try the search again at later time or head to the web instead.',
        }),
      });

      await expect(fetchWordDetails('asdfghjkl')).rejects.toThrow();
    });

    it('deve usar mensagem de erro da API quando disponível', async () => {
      const errorMessage = 'Custom error message from API';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          message: errorMessage,
        }),
      });

      await expect(fetchWordDetails('unknown')).rejects.toThrow(errorMessage);
    });

    it('deve usar mensagem padrão quando API não retorna mensagem', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      });

      await expect(fetchWordDetails('unknown')).rejects.toThrow('Word not found');
    });

    it('deve lançar erro para outros status HTTP', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchWordDetails('test')).rejects.toThrow('API error: 500');
    });

    it('deve lançar erro quando a API retorna array vazio', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await expect(fetchWordDetails('test')).rejects.toThrow(
        'No data returned for this word'
      );
    });

    it('deve lançar erro quando a API retorna null', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      });

      await expect(fetchWordDetails('test')).rejects.toThrow(
        'No data returned for this word'
      );
    });

    it('deve retornar apenas o primeiro resultado quando múltiplos são retornados', async () => {
      const secondWordData = { ...mockWordData, word: 'hello2' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockWordData, secondWordData],
      });

      const result = await fetchWordDetails('hello');

      expect(result.word).toBe('hello');
    });
  });
});

describe('WordData DTO Structure', () => {
  it('deve ter estrutura correta para WordData', () => {
    const wordData: WordData = {
      word: 'test',
      phonetics: [],
      meanings: [],
    };

    expect(wordData).toHaveProperty('word');
    expect(wordData).toHaveProperty('phonetics');
    expect(wordData).toHaveProperty('meanings');
  });

  it('deve aceitar campos opcionais', () => {
    const wordData: WordData = {
      word: 'test',
      phonetic: '/test/',
      phonetics: [{ text: '/test/', audio: 'http://example.com/audio.mp3' }],
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [
            {
              definition: 'A test',
              example: 'This is a test',
              synonyms: ['exam'],
              antonyms: [],
            },
          ],
          synonyms: ['exam'],
          antonyms: [],
        },
      ],
      license: {
        name: 'MIT',
        url: 'https://example.com',
      },
      sourceUrls: ['https://example.com'],
    };

    expect(wordData.phonetic).toBe('/test/');
    expect(wordData.license?.name).toBe('MIT');
    expect(wordData.sourceUrls).toHaveLength(1);
  });
});
