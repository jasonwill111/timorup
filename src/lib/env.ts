// Cloudflare Workers Environment Access - type-safe wrapper
// Replaces (globalThis as any).env pattern
// Env bindings defined in wrangler.jsonc and src/types/global.d.ts

export function getEnv(): Env {
  if (typeof globalThis !== 'undefined' && 'env' in globalThis) {
    return (globalThis as unknown as { env: Env }).env;
  }
  return {} as Env;
}

export function getMinimaxApiKey(): string {
  return getEnv().MINIMAX_API_KEY || '';
}