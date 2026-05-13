# Tasks: Better Auth KV Session Cache

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

## Phase 1: Implementation

### T-001: Create KV store adapter
**Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US2-01, AC-US2-02

**Description**: Create adapter function for Better Auth secondaryStorage

**Implementation**:
1. Create `src/lib/auth-kv-store.ts`
2. Export function `createKVStore(kv: KVNamespace)`
3. Implement `{ get, set, delete, list }` interface
4. Use `expirationTtl` for set with TTL

**Test Plan**:
- **File**: `tests/unit/auth-kv-store.test.ts`
- **Tests**:
  - **TC-001**: KV store implements required interface
    - Given KV mock
    - When `createKVStore(kv)` called
    - Then returned object has `get, set, delete, list` methods
  - **TC-002**: Set uses expirationTtl when provided
    - Given KV mock
    - When `store.set('key', 'value', 3600)` called
    - Then KV.put called with expirationTtl: 3600

**Status**: [x] completed

### T-002: Update auth.ts with secondaryStorage
**Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04

**Description**: Add secondaryStorage to Better Auth config

**Implementation**:
1. Read `src/lib/auth.ts`
2. Import `createKVStore` from auth-kv-store
3. Get SESSION KV from cloudflare:workers env
4. Add secondaryStorage to drizzleAdapter config:
```typescript
secondaryStorage: {
  sessions: {
    store: createKVStore(env.SESSION),
    ttl: 86400,
  }
}
```

**Dependencies**: T-001

**Status**: [x] completed

## Phase 2: Testing

### T-003: Test session caching
**Satisfies ACs**: AC-US1-02, AC-US1-04

**Description**: Verify sessions cached in KV on read/write

**Implementation**:
1. Create integration test for session flow
2. Mock KV + D1
3. Verify: read → KV hit, write → both stores updated

**Dependencies**: T-002

**Status**: [x] completed

### T-004: Test cache invalidation
**Satisfies ACs**: AC-US2-01, AC-US2-02

**Description**: Verify logout deletes from KV

**Implementation**:
1. Create logout flow test
2. Mock KV + D1
3. Verify: logout → KV.delete called with session token

**Dependencies**: T-003

**Status**: [x] completed

### T-005: Manual verification
**Satisfies ACs**: All

**Description**: Verify KV contains session data after login

**Implementation**:
1. Start dev server
2. Login as user
3. Check KV: `wrangler kv:key list --namespace-id <SESSION_ID>`
4. Verify session key exists with correct TTL

**Dependencies**: T-004

**Status**: [x] completed

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| 1. Implementation | T-001, T-002 | 2 tasks |
| 2. Testing | T-003, T-004, T-005 | 3 tasks |
| **Total** | **5 tasks** | |