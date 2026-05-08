# Implementation Plan: R2 Workers Binding Migration

## Overview

Refactor R2 access to use Cloudflare Workers native R2 binding (`env.MEDIA_BUCKET`) instead of AWS SDK S3-compatible API. This aligns timorlist architecture with timorbuy and eliminates credential dependencies for local development.

## Architecture

### Components

| Component | Purpose | Pattern |
|-----------|--------|---------|
| `env.MEDIA_BUCKET` | R2 bucket binding from wrangler.toml | Workers binding |
| `src/lib/media.ts` | R2 utility functions | Wrapper functions |
| Media API routes | Upload/delete operations | Direct bucket access |

### Data Model

No changes to data model. R2 key structure remains:
```
/business/{id}/           - Business images
/gov/{id}/               - Government images
/ngo/{id}/               - NGO images
/blog/{id}/               - Blog images
/hero/                    - Homepage banners
/category/                - Category icons
/page/{name}/            - Page-specific files
/system/                  - Logo, favicon (protected)
/files/                   - PDFs, documents
```

### API Contracts

| Endpoint | Method | Operation |
|----------|--------|-----------|
| `/api/media/upload` | POST | `bucket.put(key, data)` |
| `/api/media/:id` | DELETE | `bucket.delete(key)` |
| `/api/scheduled/cleanup` | CRON | `bucket.delete(prefix)` |

## Technology Stack

- **Runtime**: Cloudflare Workers (workerd for local)
- **Storage**: Cloudflare R2 via Workers binding
- **Configuration**: wrangler.toml with `[[r2_buckets]]`
- **Adapter**: @astrojs/cloudflare (align with timorbuy)

**Architecture Decisions**:

### ADR-001: Workers R2 Binding over AWS SDK
**Decision**: Use `env.MEDIA_BUCKET.put()` instead of AWS SDK S3 client
**Rationale**: 
- No credential management needed
- Native Workers API (no extra dependencies)
- Consistent with timorbuy architecture
- Local development works via wrangler binding
**Alternatives Considered**:
- AWS SDK S3 client (rejected: requires credentials, extra dependency)
- R2 HTTP API (rejected: more complex than needed)

### ADR-002: Cloudflare Adapter Only
**Decision**: Use `@astrojs/cloudflare` adapter exclusively (no Node adapter fallback)
**Rationale**:
- Simplifies configuration
- All environments use same adapter
- wrangler handles local development with bindings
**Alternatives Considered**:
- Node adapter for local, Cloudflare for production (rejected: inconsistent behavior)

### ADR-003: Shim Removal
**Decision**: Remove cloudflare:workers shim from Vite config
**Rationale**:
- With Cloudflare adapter, cloudflare:workers is available
- Shim caused build complexity and confusion
- wrangler handles binding resolution

## Implementation Phases

### Phase 1: Configuration Alignment
- Update `astro.config.mjs` to use Cloudflare adapter
- Update `wrangler.toml` with correct main entry point
- Remove Node adapter and platform detection
- Update package.json dev script

### Phase 2: Media Library Refactor
- Replace S3Client with env.MEDIA_BUCKET access
- Update `src/lib/media.ts` utility functions
- Add fallback for missing binding (return base64 for local dev)

### Phase 3: API Route Updates
- Update upload.ts to use bucket.put() directly
- Update delete operations to use bucket.delete()
- Update scheduled cleanup jobs

## Testing Strategy

| Test Type | Approach |
|-----------|----------|
| Unit | Mock env.MEDIA_BUCKET in tests |
| Integration | wrangler dev with local R2 binding |
| E2E | Upload flow via Playwright |

## Technical Challenges

### Challenge 1: Build Requires Network for Wrangler
**Solution**: Keep dist artifacts for offline builds; re-run build when network available
**Risk**: Build artifacts may become stale
**Mitigation**: Document network requirement in CLAUDE.md

### Challenge 2: Import.meta.env vs cloudflare:workers
**Solution**: Use `env.R2_PUBLIC_URL` from Workers binding for CDN URLs
**Risk**: Different URL patterns for local vs production
**Mitigation**: Set R2_PUBLIC_URL in wrangler.toml vars