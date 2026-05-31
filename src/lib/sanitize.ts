/**
 * XSS Sanitization utilities using DOMPurify
 * For sanitizing user-generated HTML content
 */
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Allows basic formatting tags while stripping dangerous elements
 */
export function sanitizeHtml(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'class', 'style'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
  });
}

/**
 * Sanitize plain text (strip all HTML)
 */
export function sanitizeText(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
