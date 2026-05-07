// Tests for hash utilities
import { describe, it, expect } from 'vitest';
import { sha256 } from './hash';

describe('sha256', () => {
  it('should return 64-character hex string', async () => {
    const blob = new Blob(['test content']);
    const hash = await sha256(blob);
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });

  it('should return same hash for same content', async () => {
    const blob1 = new Blob(['same content']);
    const blob2 = new Blob(['same content']);
    const hash1 = await sha256(blob1);
    const hash2 = await sha256(blob2);
    expect(hash1).toBe(hash2);
  });

  it('should return different hash for different content', async () => {
    const blob1 = new Blob(['content A']);
    const blob2 = new Blob(['content B']);
    const hash1 = await sha256(blob1);
    const hash2 = await sha256(blob2);
    expect(hash1).not.toBe(hash2);
  });
});
