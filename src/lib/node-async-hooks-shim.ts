// Node.js async_hooks shim for Cloudflare Workers (without nodejs_compat)
// Provides a minimal AsyncLocalStorage implementation using globalThis

interface AsyncLocalStorageOptions<T> {
  specific?: T;
}

class MockAsyncLocalStorage<T = unknown> {
  private storage = new Map<number, T>();

  getStore(): T | undefined {
    return this.storage.get(process.domain?.id ?? 0) as T | undefined;
  }

  run(store: T, fn: (...args: unknown[]) => unknown, ...args: unknown[]): unknown {
    const id = Math.random() * 1000000;
    this.storage.set(id, store);
    try {
      return fn(...args);
    } finally {
      this.storage.delete(id);
    }
  }

  exit(fn: (...args: unknown[]) => unknown, ...args: unknown[]): unknown {
    return fn(...args);
  }

  enterWith(_store: T): void {
    // No-op in CF Workers
  }
}

// Create global shim if not exists
if (typeof (globalThis as unknown as { AsyncLocalStorage?: unknown }).AsyncLocalStorage === 'undefined') {
  (globalThis as unknown as { AsyncLocalStorage: typeof MockAsyncLocalStorage }).AsyncLocalStorage = MockAsyncLocalStorage;
}

// Also try to make it available via node: protocol
const nodeAsyncHooks = {
  AsyncLocalStorage: MockAsyncLocalStorage,
};

// Export for module resolution
export { MockAsyncLocalStorage as AsyncLocalStorage };
export default nodeAsyncHooks;