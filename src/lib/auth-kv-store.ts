// KV Store adapter for Better Auth secondaryStorage
// Implements the store interface required by Better Auth

export interface KVStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number }): Promise<{ keys: string[] }>;
}

export function createKVStore(kv: KVNamespace): KVStore {
  return {
    async get(key: string): Promise<string | null> {
      try {
        const value = await kv.get(key);
        return value;
      } catch (e) {
        console.warn('[KVStore] Get failed:', e instanceof Error ? e.message : String(e));
        return null;
      }
    },

    async set(key: string, value: string, ttl?: number): Promise<void> {
      try {
        if (ttl) {
          await kv.put(key, value, { expirationTtl: ttl });
        } else {
          await kv.put(key, value);
        }
      } catch (error) {
        console.error('[KVStore] Failed to set key:', key, error);
      }
    },

    async delete(key: string): Promise<void> {
      try {
        await kv.delete(key);
      } catch (error) {
        console.error('[KVStore] Failed to delete key:', key, error);
      }
    },

    async list(options?: { prefix?: string; limit?: number }): Promise<{ keys: string[] }> {
      try {
        const listResult = await kv.list({
          prefix: options?.prefix,
          limit: options?.limit,
        });
        return { keys: listResult.keys.map(k => k.name) };
      } catch (e) {
        console.warn('[KVStore] List failed:', e instanceof Error ? e.message : String(e));
        return { keys: [] };
      }
    },
  };
}

// Session store factory for Better Auth secondaryStorage
export function createSessionKVStore(kv: KVNamespace, ttl: number = 86400): {
  store: KVStore;
  ttl: number;
} {
  return {
    store: createKVStore(kv),
    ttl,
  };
}