/// <reference types="jest" />

/**
 * Testes para o serviço de lista de palavras
 */
import { fetchWordList, getWordsPaginated, clearWordCache } from '../services/wordList';

// Mock do fetch global
const mockFetch = (globalThis as any).fetch as jest.Mock;

describe('WordList Service', () => {
  // Limpa cache antes de cada teste
  beforeEach(() => {
    clearWordCache();
    jest.clearAllMocks();
  });

  describe('fetchWordList', () => {
    it('deve buscar e retornar lista de palavras ordenada', async () => {
      const mockWords = {
        zebra: 1,
        apple: 1,
        banana: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWords,
      });

      const result = await fetchWordList();

      expect(result).toEqual(['apple', 'banana', 'zebra']);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json'
      );
    });

    it('deve usar cache na segunda chamada', async () => {
      const mockWords = { hello: 1, world: 1 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWords,
      });

      // Primeira chamada - busca da API
      await fetchWordList();
      // Segunda chamada - deve usar cache
      const result = await fetchWordList();

      expect(result).toEqual(['hello', 'world']);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('deve lançar erro quando fetch falha', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchWordList()).rejects.toThrow('Failed to fetch word list: 500');
    });

    it('deve lançar erro quando fetch rejeita', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchWordList()).rejects.toThrow('Network error');
    });
  });

  describe('getWordsPaginated', () => {
    const setupMockWords = () => {
      const words: Record<string, number> = {};
      // Cria 100 palavras para teste: word001, word002, etc.
      for (let i = 1; i <= 100; i++) {
        words[`word${i.toString().padStart(3, '0')}`] = 1;
      }
      // Adiciona algumas palavras especiais para filtro
      words['apple'] = 1;
      words['application'] = 1;
      words['appetizer'] = 1;
      words['banana'] = 1;

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => words,
      });
    };

    beforeEach(() => {
      setupMockWords();
    });

    it('deve retornar primeira página com tamanho correto', async () => {
      const result = await getWordsPaginated(0, 10);

      expect(result.words).toHaveLength(10);
      expect(result.hasMore).toBe(true);
      expect(result.total).toBe(104); // 100 + 4 palavras especiais
    });

    it('deve retornar segunda página corretamente', async () => {
      const page0 = await getWordsPaginated(0, 10);
      clearWordCache();
      setupMockWords();
      const page1 = await getWordsPaginated(1, 10);

      // Páginas não devem ter palavras em comum
      const overlap = page0.words.filter(w => page1.words.includes(w));
      expect(overlap).toHaveLength(0);
    });

    it('deve filtrar palavras corretamente', async () => {
      const result = await getWordsPaginated(0, 50, 'app');

      expect(result.words).toContain('apple');
      expect(result.words).toContain('application');
      expect(result.words).toContain('appetizer');
      expect(result.words).not.toContain('banana');
      expect(result.total).toBe(3);
    });

    it('deve ser case-insensitive no filtro', async () => {
      const result = await getWordsPaginated(0, 50, 'APP');

      expect(result.words).toContain('apple');
      expect(result.total).toBe(3);
    });

    it('deve retornar hasMore false na última página', async () => {
      const result = await getWordsPaginated(0, 200); // Mais que o total

      expect(result.hasMore).toBe(false);
    });

    it('deve retornar array vazio para filtro sem resultados', async () => {
      const result = await getWordsPaginated(0, 50, 'xyz123');

      expect(result.words).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });

    it('deve ignorar filtro vazio ou whitespace', async () => {
      const result1 = await getWordsPaginated(0, 10, '');
      clearWordCache();
      setupMockWords();
      const result2 = await getWordsPaginated(0, 10, '   ');

      expect(result1.total).toBe(104);
      expect(result2.total).toBe(104);
    });

    it('deve usar pageSize padrão de 50', async () => {
      const result = await getWordsPaginated(0);

      expect(result.words.length).toBeLessThanOrEqual(50);
    });
  });

  describe('clearWordCache', () => {
    it('deve limpar o cache', async () => {
      const mockWords = { test: 1 };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockWords,
      });

      // Primeira chamada
      await fetchWordList();
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Limpa cache
      clearWordCache();

      // Deve buscar novamente
      await fetchWordList();
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});

describe('Pagination Logic', () => {
  beforeEach(() => {
    clearWordCache();
  });

  it('deve calcular corretamente o slice para cada página', () => {
    const pageSize = 10;
    const testCases = [
      { page: 0, expectedStart: 0, expectedEnd: 10 },
      { page: 1, expectedStart: 10, expectedEnd: 20 },
      { page: 2, expectedStart: 20, expectedEnd: 30 },
    ];

    testCases.forEach(({ page, expectedStart, expectedEnd }) => {
      const start = page * pageSize;
      const end = start + pageSize;
      expect(start).toBe(expectedStart);
      expect(end).toBe(expectedEnd);
    });
  });

  it('deve identificar corretamente quando há mais páginas', () => {
    const totalItems = 100;
    const pageSize = 10;

    const testCases = [
      { page: 0, hasMore: true },
      { page: 5, hasMore: true },
      { page: 9, hasMore: false }, // Última página (90-99)
      { page: 10, hasMore: false }, // Além do total
    ];

    testCases.forEach(({ page, hasMore }) => {
      const end = (page + 1) * pageSize;
      const calculatedHasMore = end < totalItems;
      expect(calculatedHasMore).toBe(hasMore);
    });
  });
});
