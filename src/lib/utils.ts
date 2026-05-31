/**
 * Utility functions for UI components
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { nanoid } from 'nanoid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Escape HTML to prevent XSS attacks
 * Use this when inserting user-controlled data into innerHTML
 */
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Server-side HTML escape (for use in API routes)
 */
export function escapeHtmlServer(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Format a number as USD currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format a date string for display
 */
export function formatDate(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Convert a string to a URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')    // Remove special chars
    .trim()
    .replace(/\s+/g, '-')             // Replace spaces with hyphens
    .replace(/-+/g, '-');             // Collapse multiple hyphens
}

/**
 * Generate a unique slug by appending nanoid suffix
 * Use for creating slugs that won't collide with existing ones
 */
export function generateUniqueSlug(title: string): string {
  const base = slugify(title).replace(/-+/g, '-').replace(/^-|-$/g, '');
  return `${base}-${nanoid(6)}`;
}

/**
 * Extract error message from unknown error
 * Used across all server actions to normalize error messages
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
