/// <reference types="jest" />

/**
 * Testes para validação de tipos/DTOs
 */
import {
  WordData,
  Phonetic,
  Definition,
  Meaning,
  FavoriteWord,
  HistoryEntry,
  User,
  ApiError,
} from '../types';

describe('Types/DTOs Validation', () => {
  describe('Phonetic', () => {
    it('deve aceitar phonetic completo', () => {
      const phonetic: Phonetic = {
        text: '/həˈloʊ/',
        audio: 'https://example.com/audio.mp3',
        sourceUrl: 'https://example.com',
      };

      expect(phonetic.text).toBe('/həˈloʊ/');
      expect(phonetic.audio).toBeDefined();
      expect(phonetic.sourceUrl).toBeDefined();
    });

    it('deve aceitar phonetic com campos opcionais undefined', () => {
      const phonetic: Phonetic = {};

      expect(phonetic.text).toBeUndefined();
      expect(phonetic.audio).toBeUndefined();
    });
  });

  describe('Definition', () => {
    it('deve ter estrutura correta', () => {
      const definition: Definition = {
        definition: 'A greeting.',
        example: 'Hello, how are you?',
        synonyms: ['hi', 'hey'],
        antonyms: ['goodbye'],
      };

      expect(definition.definition).toBe('A greeting.');
      expect(definition.example).toBe('Hello, how are you?');
      expect(definition.synonyms).toHaveLength(2);
      expect(definition.antonyms).toHaveLength(1);
    });

    it('deve aceitar listas vazias de sinônimos e antônimos', () => {
      const definition: Definition = {
        definition: 'A word.',
        synonyms: [],
        antonyms: [],
      };

      expect(definition.synonyms).toHaveLength(0);
      expect(definition.antonyms).toHaveLength(0);
      expect(definition.example).toBeUndefined();
    });
  });

  describe('Meaning', () => {
    it('deve ter estrutura correta com múltiplas definições', () => {
      const meaning: Meaning = {
        partOfSpeech: 'noun',
        definitions: [
          {
            definition: 'First definition',
            synonyms: [],
            antonyms: [],
          },
          {
            definition: 'Second definition',
            example: 'An example',
            synonyms: ['syn1'],
            antonyms: ['ant1'],
          },
        ],
        synonyms: ['word1', 'word2'],
        antonyms: ['opposite1'],
      };

      expect(meaning.partOfSpeech).toBe('noun');
      expect(meaning.definitions).toHaveLength(2);
      expect(meaning.synonyms).toHaveLength(2);
      expect(meaning.antonyms).toHaveLength(1);
    });

    it('deve aceitar diferentes partes do discurso', () => {
      const partsOfSpeech = ['noun', 'verb', 'adjective', 'adverb', 'interjection'];

      partsOfSpeech.forEach((pos) => {
        const meaning: Meaning = {
          partOfSpeech: pos,
          definitions: [],
          synonyms: [],
          antonyms: [],
        };
        expect(meaning.partOfSpeech).toBe(pos);
      });
    });
  });

  describe('WordData', () => {
    it('deve ter estrutura mínima válida', () => {
      const wordData: WordData = {
        word: 'test',
        phonetics: [],
        meanings: [],
      };

      expect(wordData.word).toBe('test');
      expect(Array.isArray(wordData.phonetics)).toBe(true);
      expect(Array.isArray(wordData.meanings)).toBe(true);
    });

    it('deve ter estrutura completa válida', () => {
      const wordData: WordData = {
        word: 'hello',
        phonetic: '/həˈloʊ/',
        phonetics: [
          {
            text: '/həˈloʊ/',
            audio: 'https://example.com/hello.mp3',
          },
        ],
        meanings: [
          {
            partOfSpeech: 'interjection',
            definitions: [
              {
                definition: 'Used as a greeting.',
                synonyms: [],
                antonyms: [],
              },
            ],
            synonyms: ['hi'],
            antonyms: ['bye'],
          },
        ],
        license: {
          name: 'CC BY-SA 3.0',
          url: 'https://creativecommons.org/licenses/by-sa/3.0',
        },
        sourceUrls: ['https://en.wiktionary.org/wiki/hello'],
      };

      expect(wordData.word).toBe('hello');
      expect(wordData.phonetic).toBe('/həˈloʊ/');
      expect(wordData.phonetics).toHaveLength(1);
      expect(wordData.meanings).toHaveLength(1);
      expect(wordData.license).toBeDefined();
      expect(wordData.sourceUrls).toHaveLength(1);
    });
  });

  describe('ApiError', () => {
    it('deve ter estrutura de erro da API', () => {
      const error: ApiError = {
        title: 'No Definitions Found',
        message: 'Sorry, we couldn\'t find definitions.',
        resolution: 'Try again later.',
      };

      expect(error.title).toBe('No Definitions Found');
      expect(error.message).toContain('Sorry');
      expect(error.resolution).toContain('Try again');
    });
  });

  describe('FavoriteWord', () => {
    it('deve ter estrutura correta', () => {
      const favorite: FavoriteWord = {
        word: 'hello',
        addedAt: Date.now(),
      };

      expect(favorite.word).toBe('hello');
      expect(typeof favorite.addedAt).toBe('number');
      expect(favorite.addedAt).toBeGreaterThan(0);
    });

    it('deve usar timestamp válido', () => {
      const now = Date.now();
      const favorite: FavoriteWord = {
        word: 'test',
        addedAt: now,
      };

      expect(favorite.addedAt).toBe(now);
      // Verifica se é um timestamp razoável (após 2020)
      expect(favorite.addedAt).toBeGreaterThan(1577836800000);
    });
  });

  describe('HistoryEntry', () => {
    it('deve ter estrutura correta', () => {
      const entry: HistoryEntry = {
        word: 'hello',
        viewedAt: Date.now(),
      };

      expect(entry.word).toBe('hello');
      expect(typeof entry.viewedAt).toBe('number');
    });
  });

  describe('User', () => {
    it('deve ter estrutura completa', () => {
      const user: User = {
        uid: 'abc123',
        email: 'user@example.com',
        displayName: 'John Doe',
      };

      expect(user.uid).toBe('abc123');
      expect(user.email).toBe('user@example.com');
      expect(user.displayName).toBe('John Doe');
    });

    it('deve aceitar campos nulos', () => {
      const user: User = {
        uid: 'abc123',
        email: null,
        displayName: null,
      };

      expect(user.uid).toBe('abc123');
      expect(user.email).toBeNull();
      expect(user.displayName).toBeNull();
    });
  });
});

describe('Data Transformations', () => {
  it('deve extrair áudio da lista de phonetics', () => {
    const phonetics: Phonetic[] = [
      { text: '/test/' },
      { text: '/test/', audio: '' },
      { text: '/test/', audio: 'https://example.com/audio.mp3' },
    ];

    const audioUrl = phonetics.find((p) => p.audio && p.audio.length > 0)?.audio;
    expect(audioUrl).toBe('https://example.com/audio.mp3');
  });

  it('deve retornar undefined quando não há áudio', () => {
    const phonetics: Phonetic[] = [
      { text: '/test/' },
      { text: '/test/', audio: '' },
    ];

    const audioUrl = phonetics.find((p) => p.audio && p.audio.length > 0)?.audio;
    expect(audioUrl).toBeUndefined();
  });

  it('deve limitar sinônimos/antônimos a 5 itens', () => {
    const synonyms = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const limited = synonyms.slice(0, 5);

    expect(limited).toHaveLength(5);
    expect(limited).not.toContain('f');
    expect(limited).not.toContain('g');
  });
});
