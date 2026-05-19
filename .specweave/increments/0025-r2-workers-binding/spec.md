---
increment: 0025-r2-workers-binding
title: "R2 Workers Binding Migration"
type: refactor
priority: high
status: completed
created: 2026-05-04
structure: user-stories
test_mode: none
coverage_target: 80
---

# Refactor: R2 Workers Binding Migration

## Overview

Refactor R2 storage access from AWS SDK (S3-compatible API requiring credentials) to Cloudflare Workers R2 binding (`env.MEDIA_BUCKET.put()`), aligning with timorbuy architecture for consistent local development experience.

## Problem Statement

| Aspect | Before (AWS SDK) | After (Workers Binding) |
|--------|-----------------|------------------------|
| Credentials | Required | Not needed |
| Local Dev | Fails without env vars | Works with wrangler binding |
| Dependencies | @aws-sdk/client-s3 | None (native Workers API) |
| Config | env vars (R2_ENDPOINT, R2_ACCESS_KEY_ID, etc.) | wrangler.toml binding |

## User Stories

### US-001: Local Development R2 Access
**Project**: TimorLink

**As a** developer
**I want** to access R2 storage during local development without configuring credentials
**So that** I can test file uploads and media operations seamlessly

**Acceptance Criteria**:
- [x] **AC-US1-01**: R2 bucket accessible via `env.MEDIA_BUCKET` Workers binding
- [x] **AC-US1-02**: `bucket.put(key, data)` works for file uploads
- [x] **AC-US1-03**: `bucket.delete(key)` works for file deletion
- [x] **AC-US1-04**: `bucket.list()` works for listing objects

### US-002: Codebase Alignment
**Project**: TimorLink

**As a** developer
**I want** TimorLink and timorbuy to use the same R2 access pattern
**So that** maintenance and knowledge transfer are easier

**Acceptance Criteria**:
- [x] **AC-US2-01**: Media operations use `env.MEDIA_BUCKET.put()` pattern
- [x] **AC-US2-02**: No AWS SDK imports for R2 operations
- [x] **AC-US2-03**: Astro config uses Cloudflare adapter consistently

## Technical Changes

### Files Modified

| File | Change |
|------|--------|
| `src/lib/media.ts` | Replace S3Client with env.MEDIA_BUCKET |
| `src/pages/api/media/upload.ts` | Use bucket.put() directly |
| `src/pages/api/media/index.ts` | Use bucket operations |
| `src/pages/api/media/[id].ts` | Use bucket.delete() |
| `src/pages/api/scheduled/_cleanup.ts` | Use bucket.delete() for folder cleanup |
| `src/pages/api/scheduled/_cleanup-orphan-media.ts` | Use bucket.delete() |
| `src/middleware.ts` | Remove cloudflare:workers shim |
| `wrangler.toml` | R2 binding (MEDIA_BUCKET) already configured |
| `astro.config.mjs` | Use Cloudflare adapter |
| `package.json` | Update dev script to use wrangler dev |

### API Pattern Comparison

**Before (AWS SDK)**:
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: { accessKeyId, secretAccessKey }
});

await client.send(new PutObjectCommand({
  Bucket: 'TimorLink-media',
  Key: key,
  Body: data,
  ContentType: mimeType
}));
```

**After (Workers Binding)**:
```typescript
import { env } from 'cloudflare:workers';

const bucket = env.MEDIA_BUCKET as R2Bucket;
await bucket.put(key, data, {
  httpMetadata: { contentType: mimeType }
});
```

## Success Criteria

- [x] `pnpm build` succeeds with Cloudflare adapter
- [x] `pnpm dev` starts wrangler dev with R2 binding
- [x] No AWS SDK references remain for R2 operations
- [x] Code matches timorbuy architecture pattern

## Dependencies

- Cloudflare Workers runtime
- wrangler.toml R2 binding configuration
- @astrojs/cloudflare adapter

## Out of Scope

- Migration of existing R2 files (no changes to stored content)
- Changes to R2 bucket permissions or CORS configuration
- Adding new media features (this is a refactor only)
