// Cloudflare Workers Environment Access - type-safe wrapper
// Replaces (globalThis as any).env pattern

interface Env {
  MINIMAX_API_KEY?: string;
}

export function getEnv(): Env {
  if (typeof globalThis !== 'undefined' && 'env' in globalThis) {
    return globalThis.env as Env;
  }
  return {};
}

export function getMinimaxApiKey(): string {
  return getEnv().MINIMAX_API_KEY || '';
}