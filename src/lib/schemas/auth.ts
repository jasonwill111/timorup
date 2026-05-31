/**
 * Auth Zod Schemas
 * Validation schemas for authentication actions
 */
import * as z from 'zod';

/**
 * Password complexity schema
 * Requires: uppercase, lowercase, number, special character
 */
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be at most 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Simple password schema (legacy - minimal validation)
 */
export const simplePasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be at most 100 characters');