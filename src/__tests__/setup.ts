/// <reference types="jest" />

/**
 * Jest test setup file
 */

// Mock global fetch
(globalThis as any).fetch = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
