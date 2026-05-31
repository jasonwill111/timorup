/**
 * Common Zod Schemas
 * Shared validation schemas for actions and API endpoints
 */
import * as z from 'zod';

/**
 * Email schema with consistent error message
 * Use this instead of inline z.email() to maintain consistent validation
 */
export const emailSchema = z.email({ error: 'Valid email required' });

/**
 * Required string with optional custom message
 */
export const requiredString = (message = 'Required') => z.string().min(1, message);

/**
 * Optional string
 */
export const optionalString = () => z.string().optional();

/**
 * Phone number schema (international format)
 * Supports formats like +6701234567, +1-234-567-8900
 */
export const phoneSchema = z.string().regex(
  /^\+?[1-9]\d{1,14}$/,
  'Invalid phone number format'
);

/**
 * Country code schema with default Timor-Leste
 */
export const countryCodeSchema = z.string().default('+670');

/**
 * URL schema with optional http/https
 */
export const urlSchema = z.string().url().or(z.literal('')).optional();

/**
 * Slug schema (lowercase alphanumeric with hyphens)
 */
export const slugSchema = z.string().regex(
  /^[a-z0-9]+(-[a-z0-9]+)*$/,
  'Invalid slug format'
);