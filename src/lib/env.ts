// Cloudflare Workers Environment Access - type-safe wrapper
// Replaces (globalThis as any).env pattern
// Env bindings defined in wrangler.jsonc and src/types/global.d.ts

export function getEnv(): Env {
  if (typeof globalThis !== 'undefined' && 'env' in globalThis) {
    return (globalThis as unknown as { env: Env }).env;
  }
  return {} as Env;
}

// MiniMax API Key - supports both environments:
// - Local dev: Vite loads .env into import.meta.env
// - Workers: nodejs_compat_populate_process_env populates process.env
export function getMinimaxApiKey(): string {
  if (typeof import.meta !== 'undefined' && (import.meta.env as Record<string, string>)?.MINIMAX_API_KEY) {
    return (import.meta.env as Record<string, string>).MINIMAX_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env?.MINIMAX_API_KEY) {
    return process.env.MINIMAX_API_KEY;
  }
  return getEnv().MINIMAX_API_KEY || '';
}