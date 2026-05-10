// Shared Zod schemas for API validation
import * as z from 'zod';

export const signInSchema = z.object({
  email: z.email({ error: 'Valid email required' }),
  password: z.string().min(1, 'Password required'),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.email({ error: 'Valid email required' }),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const slugCheckSchema = z.object({
  slug: z.string().min(1, 'Slug required').max(100),
  excludeId: z.number().optional(),
});

export const statsFilterSchema = z.object({
  period: z.enum(['7d', '30d', '90d', 'all']).default('30d'),
});

export const aiGenerateSchema = z.object({
  prompt: z.string().min(1, 'Prompt required').max(2000),
  type: z.enum(['business', 'nonprofit', 'public']).default('business'),
});