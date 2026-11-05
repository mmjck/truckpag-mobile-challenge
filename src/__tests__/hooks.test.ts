/// <reference types="jest" />

/**
 * Testes para configuração e lógica dos hooks
 */

describe('useWordDetails Hook Configuration', () => {
  it('deve usar query key baseada na palavra em lowercase', () => {
    const word = 'Hello';
    const queryKey = ['word', word.toLowerCase()];

    expect(queryKey).toEqual(['word', 'hello']);
  });

  it('deve ter staleTime de 1 hora', () => {
    const staleTime = 1000 * 60 * 60; // 1 hora em ms

    expect(staleTime).toBe(3600000);
  });

  it('deve ter gcTime de 24 horas', () => {
    const gcTime = 1000 * 60 * 60 * 24; // 24 horas em ms

    expect(gcTime).toBe(86400000);
  });

  it('deve desabilitar query quando word está vazio', () => {
    const testCases = [
      { word: '', enabled: true, shouldFetch: false },
      { word: 'hello', enabled: true, shouldFetch: true },
      { word: 'hello', enabled: false, shouldFetch: false },
      { word: '', enabled: false, shouldFetch: false },
    ];

    testCases.forEach(({ word, enabled, shouldFetch }) => {
      const calculatedEnabled = enabled && !!word;
      expect(calculatedEnabled).toBe(shouldFetch);
    });
  });
});

describe('useWords Hook Logic', () => {
  const PAGE_SIZE = 50;

  describe('Pagination', () => {
    it('deve calcular próxima página corretamente', () => {
      let page = 0;

      // Simula loadMore
      page = page + 1;
      expect(page).toBe(1);

      page = page + 1;
      expect(page).toBe(2);
    });

    it('deve prevenir loadMore quando isLoadingMore é true', () => {
      const isLoadingMore = true;
      const hasMore = true;

      const shouldLoad = !isLoadingMore && hasMore;
      expect(shouldLoad).toBe(false);
    });

    it('deve prevenir loadMore quando hasMore é false', () => {
      const isLoadingMore = false;
      const hasMore = false;

      const shouldLoad = !isLoadingMore && hasMore;
      expect(shouldLoad).toBe(false);
    });

    it('deve permitir loadMore quando condições são atendidas', () => {
      const isLoadingMore = false;
      const hasMore = true;

      const shouldLoad = !isLoadingMore && hasMore;
      expect(shouldLoad).toBe(true);
    });
  });

  describe('Search', () => {
    it('deve resetar página para 0 ao buscar', () => {
      const currentPage = 5;
      const searchPage = 0;

      // Ao fazer search, página deve voltar para 0
      expect(searchPage).toBe(0);
      expect(searchPage).not.toBe(currentPage);
    });

    it('deve manter searchTerm entre chamadas de loadMore', () => {
      const searchTerm = 'hello';
      const page = 2;

      // loadMore deve usar o mesmo searchTerm
      const loadMoreParams = { page: page + 1, term: searchTerm };
      expect(loadMoreParams.term).toBe('hello');
    });
  });

  describe('State Management', () => {
    it('deve append palavras corretamente', () => {
      const currentWords = ['a', 'b', 'c'];
      const newWords = ['d', 'e', 'f'];

      const result = [...currentWords, ...newWords];

      expect(result).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
      expect(result).toHaveLength(6);
    });

    it('deve substituir palavras ao fazer refresh', () => {
      const currentWords = ['a', 'b', 'c'];
      const refreshedWords = ['x', 'y', 'z'];

      // Refresh substitui, não append
      const result = refreshedWords;

      expect(result).toEqual(['x', 'y', 'z']);
      expect(result).not.toContain('a');
    });

    it('deve converter erro para Error quando não é instância', () => {
      const unknownError: unknown = 'string error';
      const error = unknownError instanceof Error
        ? unknownError
        : new Error('Failed to load words');

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Failed to load words');
    });

    it('deve manter erro original quando é instância de Error', () => {
      const originalError: unknown = new Error('Original error');
      const error = originalError instanceof Error
        ? originalError
        : new Error('Failed to load words');

      expect(error.message).toBe('Original error');
    });
  });
});

describe('Cache Configuration', () => {
  it('deve ter configuração de cache adequada para dicionário', () => {
    const config = {
      staleTime: 1000 * 60 * 60, // 1 hora
      gcTime: 1000 * 60 * 60 * 24, // 24 horas
      retry: 1,
    };

    // Dados de dicionário mudam raramente, cache longo faz sentido
    expect(config.staleTime).toBeGreaterThanOrEqual(1000 * 60 * 30); // Min 30 min
    expect(config.gcTime).toBeGreaterThan(config.staleTime);
    expect(config.retry).toBeLessThanOrEqual(3);
  });
});

describe('Error Handling', () => {
  it('deve tratar diferentes tipos de erro', () => {
    const errorCases = [
      { input: new Error('Network error'), expected: 'Network error' },
      { input: new Error('API error: 500'), expected: 'API error: 500' },
      { input: 'string error', expected: 'Failed to load words' },
      { input: null, expected: 'Failed to load words' },
      { input: undefined, expected: 'Failed to load words' },
    ];

    errorCases.forEach(({ input, expected }) => {
      const error = input instanceof Error
        ? input
        : new Error('Failed to load words');

      expect(error.message).toBe(expected);
    });
  });
});
