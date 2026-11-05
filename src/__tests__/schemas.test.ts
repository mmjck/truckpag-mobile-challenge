/// <reference types="jest" />

/**
 * Testes para schemas de validação (Zod)
 */
import { loginSchema, registerSchema, AUTH_LIMITS } from '../schemas/auth';

describe('Auth Schemas', () => {
  describe('loginSchema', () => {
    it('deve validar credenciais corretas', () => {
      const validData = {
        email: 'user@example.com',
        password: '123456',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar e-mail vazio', () => {
      const invalidData = {
        email: '',
        password: '123456',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('E-mail é obrigatório');
      }
    });

    it('deve rejeitar e-mail inválido', () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123456',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Formato de e-mail inválido');
      }
    });

    it('deve rejeitar senha vazia', () => {
      const invalidData = {
        email: 'user@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Senha é obrigatória');
      }
    });

    it('deve rejeitar senha menor que o mínimo', () => {
      const invalidData = {
        email: 'user@example.com',
        password: '12345', // 5 caracteres, mínimo é 6
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('mínimo');
      }
    });

    it('deve aceitar senha no limite mínimo', () => {
      const validData = {
        email: 'user@example.com',
        password: '123456', // exatamente 6 caracteres
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar e-mail muito longo', () => {
      const longEmail = 'a'.repeat(250) + '@test.com'; // > 254 caracteres
      const invalidData = {
        email: longEmail,
        password: '123456',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('deve validar dados de cadastro corretos', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar nome vazio', () => {
      const invalidData = {
        name: '',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nome é obrigatório');
      }
    });

    it('deve rejeitar nome muito curto', () => {
      const invalidData = {
        name: 'J', // 1 caractere, mínimo é 2
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('mínimo');
      }
    });

    it('deve rejeitar nome muito longo', () => {
      const invalidData = {
        name: 'J'.repeat(51), // > 50 caracteres
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '123456',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('máximo');
      }
    });

    it('deve rejeitar senhas que não coincidem', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '654321',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmError = result.error.issues.find(
          (issue) => issue.path.includes('confirmPassword')
        );
        expect(confirmError?.message).toBe('As senhas não coincidem');
      }
    });

    it('deve rejeitar confirmação de senha vazia', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        confirmPassword: '',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('AUTH_LIMITS', () => {
    it('deve ter limites corretos para email', () => {
      expect(AUTH_LIMITS.email.min).toBe(5);
      expect(AUTH_LIMITS.email.max).toBe(254);
    });

    it('deve ter limites corretos para senha', () => {
      expect(AUTH_LIMITS.password.min).toBe(6);
      expect(AUTH_LIMITS.password.max).toBe(128);
    });

    it('deve ter limites corretos para nome', () => {
      expect(AUTH_LIMITS.name.min).toBe(2);
      expect(AUTH_LIMITS.name.max).toBe(50);
    });
  });
});
