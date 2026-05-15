---
increment: 0051-0042-better-auth-kv-session
---

# Architecture Plan: Better Auth KV Session Cache

## Design

### Current State
- Sessions stored in D1 only
- Every session read = D1 query (~10ms)
- No caching layer

### Target State
- Sessions cached in KV
- Reads hit KV first (~1ms), fallback to D1
- Writes go to both KV + D1
- KV auto-expires via TTL

### Better Auth secondaryStorage
```
Read flow:
  Request → KV.get(session-token) → if miss → D1 → KV.set → return

Write flow:
  Login → D1.insert → KV.set(session, data, { ttl }) → return

Delete flow:
  Logout → D1.delete → KV.delete(session-token) → return
```

## KV Store Adapter

Better Auth accepts custom storage. Need adapter:
```typescript
const kvStore = (kv: KVNamespace) => ({
  async get(key: string) {
    return kv.get(key);
  },
  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await kv.put(key, value, { expirationTtl: ttl });
    } else {
      await kv.put(key, value);
    }
  },
  async delete(key: string) {
    await kv.delete(key);
  }
});
```

## Key Format
```
better-auth:session:{token}
```
Better Auth handles prefix internally based on storage config.

## TTL Strategy
- Session TTL: 24 hours (86400 seconds)
- Matches cookie expiry
- KV auto-deletes expired entries

## Rationale

### Why KV over D1?
- Read latency: ~1ms KV vs ~10ms D1
- Better Auth recommends KV for sessions
- SESSION namespace already exists

### Why D1 stays as source of truth?
- KV can lose data (eviction, bugs)
- D1 has transactional guarantees
- On KV miss → fallback to D1 → re-populate KV

## Files to Modify

| File | Change |
|------|--------|
| `src/lib/auth.ts` | Add secondaryStorage config |

## Risks

| Risk | Mitigation |
|------|------------|
| KV/D1 drift | On KV miss, always refresh from D1 |
| TTL mismatch | Use same TTL for KV and cookie |
| KV unavailable | Fallback to D1-only (degraded but functional) |