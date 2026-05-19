// cloudflare workers Environment Type Definitions
// extend the global Env interface for project bindings

declare module 'cloudflare:workers' {
  interface Env {
    ASSETS: Fetcher;
    DB: D1Database;
    SESSION: KVNamespace;
    MEDIA_BUCKET: R2Bucket;
    R2_PUBLIC_URL?: string;
    MINIMAX_API_KEY?: string;
  }
}

declare global {
  interface Env {
    ASSETS: Fetcher;
    DB: D1Database;
    SESSION: KVNamespace;
    MEDIA_BUCKET: R2Bucket;
    R2_PUBLIC_URL?: string;
    MINIMAX_API_KEY?: string;
  }
}

export {};