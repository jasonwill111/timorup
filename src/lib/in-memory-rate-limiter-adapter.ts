/**
 * In-Memory Rate Limiter Adapter for Testing
 * No Cloudflare Workers dependency
 */
import type { RateLimiterAdapter, RateLimitResult, RateLimiterConfig } from './rate-limiter-adapter';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export class InMemoryRateLimiterAdapter implements RateLimiterAdapter {
  private store: Map<string, RateLimitRecord> = new Map();
  private config: RateLimiterConfig;
  private mutex: Map<string, Promise<void>> = new Map();

  constructor(config: RateLimiterConfig = { windowMs: 60000, maxRequests: 100 }) {
    this.config = config;
  }

  async check(identifier: string): Promise<RateLimitResult> {
    // Acquire lock for this identifier
    await this.acquireLock(identifier);

    try {
      return this.checkUnlocked(identifier);
    } finally {
      this.releaseLock(identifier);
    }
  }

  private checkUnlocked(identifier: string): RateLimitResult {
    const now = Date.now();
    const record = this.store.get(identifier);

    // Check if valid and not expired
    if (record && now < record.resetTime) {
      // Check BEFORE incrementing
      if (record.count >= this.config.maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetIn: Math.ceil((record.resetTime - now) / 1000),
        };
      }

      // Increment
      record.count++;

      return {
        allowed: true,
        remaining: this.config.maxRequests - record.count,
        resetIn: Math.ceil((record.resetTime - now) / 1000),
      };
    }

    // Create new record
    const resetTime = now + this.config.windowMs;
    this.store.set(identifier, { count: 1, resetTime });

    return {
      allowed: true,
      remaining: this.config.maxRequests - 1,
      resetIn: Math.ceil(this.config.windowMs / 1000),
    };
  }

  async reset(identifier: string): Promise<void> {
    await this.acquireLock(identifier);
    try {
      this.store.delete(identifier);
    } finally {
      this.releaseLock(identifier);
    }
  }

  // Simple mutex using Promise chains
  private async acquireLock(identifier: string): Promise<void> {
    const existingLock = this.mutex.get(identifier);
    if (existingLock) {
      await existingLock;
    }

    let release: () => void;
    const lock = new Promise<void>(resolve => {
      release = resolve;
    });

    // Store release function
    this.mutex.set(identifier, new Promise<void>(resolve => {
      // Replace with new promise that resolves when current work is done
      const currentLock = this.mutex.get(identifier);
      if (currentLock) {
        currentLock.then(() => {
          this.mutex.set(identifier, lock);
          release!();
        });
      } else {
        this.mutex.set(identifier, lock);
        release!();
      }
    }));
  }

  private releaseLock(identifier: string): void {
    const lock = this.mutex.get(identifier);
    if (lock) {
      // Resolve the lock
      this.mutex.delete(identifier);
    }
  }

  // Helper for tests
  clear(): void {
    this.store.clear();
    this.mutex.clear();
  }

  // Get current state for debugging
  getState(identifier: string): RateLimitRecord | undefined {
    return this.store.get(identifier);
  }
}