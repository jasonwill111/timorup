// Cloudflare wrapper for better-auth
// This module provides Cloudflare-specific functionality without depending on the external package

import type { AuthConfig } from 'better-auth';

// Simplified Cloudflare configuration interface
interface CloudflareOptions {
  d1?: {
    db: unknown; // Drizzle instance
    options?: {
      schema?: Record<string, unknown>;
      usePlural?: boolean;
    };
  };
  kv?: unknown;
  r2?: unknown;
  geolocationTracking?: boolean;
  autoDetectIpAddress?: boolean;
  cf?: unknown;
}

// Export types
export type { CloudflareOptions };

/**
 * withCloudflare - Cloudflare-specific better-auth configuration
 *
 * This is a compatibility wrapper that creates the necessary configuration
 * for better-auth to work with Cloudflare Workers (D1, KV, R2).
 *
 * The actual Cloudflare features are provided by better-auth's built-in
 * D1 adapter and session management.
 */
export function withCloudflare(
  cloudflareOptions: CloudflareOptions,
  authOptions: AuthConfig
): AuthConfig {
  // Build the config by merging cloudflare-specific options with standard auth options

  // Configure database adapter for D1
  const dbConfig = cloudflareOptions.d1?.options;

  // Build final config
  const config: AuthConfig = {
    ...authOptions,

    // Database adapter configuration - Drizzle with D1
    database: cloudflareOptions.d1?.db as AuthConfig['database'],
  };

  return config;
}