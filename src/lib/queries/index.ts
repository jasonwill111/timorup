/**
 * Query Layer - Centralized data access functions
 * Re-exports all query functions for consistent imports
 */

// Result type
export { type Result, success, error, isSuccess, isError, unwrap, unwrapOr } from './result';

// Query functions
export * from './business';
export * from './category';
export * from './review';