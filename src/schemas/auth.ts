import { z } from 'zod';

/**
 * Limites dos campos de autenticação
 */
export const AUTH_LIMITS = {
  email: {
    min: 5,
    max: 254,
  },
  password: {
    min: 6,
    max: 128,
  },
  name: {
    min: 2,
    max: 50,
  },
} as const;

/**
 * Schema do formulário de login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .min(AUTH_LIMITS.email.min, 'E-mail muito curto')
    .max(AUTH_LIMITS.email.max, 'E-mail muito longo')
    .email('Formato de e-mail inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(AUTH_LIMITS.password.min, `Senha deve ter no mínimo ${AUTH_LIMITS.password.min} caracteres`)
    .max(AUTH_LIMITS.password.max, `Senha deve ter no máximo ${AUTH_LIMITS.password.max} caracteres`),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schema do formulário de cadastro
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .min(AUTH_LIMITS.name.min, `Nome deve ter no mínimo ${AUTH_LIMITS.name.min} caracteres`)
      .max(AUTH_LIMITS.name.max, `Nome deve ter no máximo ${AUTH_LIMITS.name.max} caracteres`),
    email: z
      .string()
      .min(1, 'E-mail é obrigatório')
      .min(AUTH_LIMITS.email.min, 'E-mail muito curto')
      .max(AUTH_LIMITS.email.max, 'E-mail muito longo')
      .email('Formato de e-mail inválido'),
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(AUTH_LIMITS.password.min, `Senha deve ter no mínimo ${AUTH_LIMITS.password.min} caracteres`)
      .max(AUTH_LIMITS.password.max, `Senha deve ter no máximo ${AUTH_LIMITS.password.max} caracteres`),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
