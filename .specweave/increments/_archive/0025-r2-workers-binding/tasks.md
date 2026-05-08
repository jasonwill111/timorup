# Tasks: R2 Workers Binding Migration

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

## Completed Tasks

### T-001: Update astro.config.mjs for Cloudflare adapter
**Description**: Replace Node adapter with Cloudflare adapter, remove platform detection

**References**: AC-US2-03

**Changes**:
- Use `@astrojs/cloudflare` adapter exclusively
- Remove Node adapter and `useCloudflare` detection
- Simplify env schema

**Test Plan**: N/A (configuration only)
**Dependencies**: None
**Status**: [x] Completed (commit 4ad0b04)

---

### T-002: Refactor src/lib/media.ts
**Description**: Replace AWS SDK S3Client with Workers R2 binding

**References**: AC-US1-01, AC-US2-01

**Changes**:
- Remove `import { S3Client, ... } from '@aws-sdk/client-s3'`
- Add `import { env } from 'cloudflare:workers'`
- Replace S3Client with `env.MEDIA_BUCKET`
- Add `getR2Bucket()` helper
- Add `getR2PublicUrl()` helper
- Update `uploadToR2()` to use `bucket.put()`
- Update `deleteFromR2()` to use `bucket.delete()`
- Update `deleteFolderFromR2()` to use `bucket.list()` + delete

**Test Plan**:
- **File**: `src/lib/media.test.ts`
- **Tests**:
  - **TC-001**: getR2Bucket returns R2Bucket
    - Given env.MEDIA_BUCKET is defined
    - When getR2Bucket() is called
    - Then it returns the R2Bucket object

  - **TC-002**: getR2PublicUrl returns CDN URL
    - Given env.R2_PUBLIC_URL is set
    - When getR2PublicUrl() is called
    - Then it returns the configured URL

  - **TC-003**: uploadToR2 calls bucket.put
    - Given getR2Bucket() returns a mock bucket
    - When uploadToR2(data, key, mimeType) is called
    - Then bucket.put is invoked with correct parameters

**Status**: [x] Completed

---

### T-003: Update src/pages/api/media/upload.ts
**Description**: Use Workers R2 binding for file uploads

**References**: AC-US1-02

**Changes**:
- Add `import { env } from 'cloudflare:workers'`
- Replace `uploadToR2()` import with direct `env.MEDIA_BUCKET.put()`
- Add fallback for missing binding (base64 for local dev without R2)

**Test Plan**:
- **File**: `src/pages/api/media/upload.test.ts`
- **Tests**:
  - **TC-001**: POST upload succeeds with R2 bucket
    - Given authenticated user and R2 bucket available
    - When POST /api/media/upload is called with file
    - Then file is stored in R2 and URL returned

  - **TC-002**: POST upload falls back to base64 without R2
    - Given env.MEDIA_BUCKET is undefined
    - When POST /api/media/upload is called
    - Then data:base64 URL is returned

**Status**: [x] Completed

---

### T-004: Update src/pages/api/media/index.ts
**Description**: Use Workers R2 binding for delete operations

**References**: AC-US1-03

**Changes**:
- Add `import { env } from 'cloudflare:workers'`
- Replace `deleteFromR2()` import with direct bucket.delete()
- Update DELETE handler to use bucket operations

**Test Plan**:
- **File**: `src/pages/api/media/index.test.ts`
- **Tests**:
  - **TC-001**: DELETE removes file from R2
    - Given media record exists with R2 URL
    - When DELETE /api/media/:id is called
    - Then bucket.delete is invoked and record removed

**Status**: [x] Completed

---

### T-005: Update src/pages/api/media/[id].ts
**Description**: Use Workers R2 binding for single media delete

**References**: AC-US1-03

**Changes**:
- Add `import { env } from 'cloudflare:workers'`
- Use bucket.delete() for R2 operations

**Status**: [x] Completed

---

### T-006: Update scheduled cleanup jobs
**Description**: Update _cleanup.ts and _cleanup-orphan-media.ts for Workers R2 binding

**References**: AC-US1-04

**Changes**:
- Add `import { env } from 'cloudflare:workers'`
- Use bucket.delete() for folder cleanup
- Add getR2Bucket() helper functions

**Test Plan**:
- **File**: `src/pages/api/scheduled/_cleanup.test.ts`
- **Tests**:
  - **TC-001**: Cleanup deletes R2 folder
    - Given expired business with R2 folder
    - When scheduled cleanup runs
    - Then bucket.delete is called for each object

**Status**: [x] Completed

---

### T-007: Simplify middleware.ts
**Description**: Remove cloudflare:workers shim, simplify cache handling

**References**: AC-US2-03

**Changes**:
- Remove cloudflare:workers dynamic import logic
- Remove shim configuration
- Simplify middleware to only handle cache headers

**Status**: [x] Completed

---

### T-008: Update wrangler.toml
**Description**: Ensure R2 binding is correctly configured

**References**: AC-US1-01

**Changes**:
- Confirm `[[r2_buckets]]` with `binding = "MEDIA_BUCKET"`
- Use `@astrojs/cloudflare/entrypoints/server` as main
- Set `remote = false` for local development (use local R2)

**Status**: [x] Completed

---

### T-009: Update package.json dev script
**Description**: Align dev script with timorbuy pattern

**References**: AC-US2-03

**Changes**:
- Change dev script to: `astro build && wrangler dev --local --port 8787`
- Remove wrangler types from build (handled by wrangler dev)

**Status**: [x] Completed

---

### T-010: Build and verify
**Description**: Verify build succeeds and R2 binding works

**References**: All ACs

**Verification**:
- [x] `pnpm build` completes with Cloudflare adapter
- [ ] `pnpm dev` starts wrangler with R2 binding (needs network)
- [x] No AWS SDK imports for R2 operations
- [x] Code matches timorbuy pattern

**Status**: [x] Build verified, dev pending network