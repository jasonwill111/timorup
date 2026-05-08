---
increment: 0028-media-optimization
title: "Media Upload Optimization"
generated: "2026-05-07"
source: manual
version: "1.0"
status: active
---

# Quality Contract: Media Upload Optimization

## Quality Gates

| Gate | Threshold | Measurement |
|------|-----------|-------------|
| Compression time | < 500ms | Performance mark |
| Bundle size increase | < 5 KB | No new deps |
| Test coverage | > 80% | vitest coverage |
| E2E pass rate | 100% | Playwright |

## Acceptance Criteria Checklist

### US-001: Image Upload with Compression
- [ ] AC-US1-01: Client compresses images using Canvas API
- [ ] AC-US1-02: Output format is WebP with 85% quality
- [ ] AC-US1-03: Images larger than 2MB rejected
- [ ] AC-US1-04: Compression < 500ms

### US-002: SHA256 Deduplication
- [ ] AC-US2-01: Calculate SHA256 client-side
- [ ] AC-US2-02: Check hash against DB
- [ ] AC-US2-03: Return existing ID for duplicates
- [ ] AC-US2-04: Hash field in schema

### US-003: Structured R2 Folders
- [ ] AC-US3-01: Business in `listings/business/{id}/`
- [ ] AC-US3-02: SKU in `listings/business/{id}/sku-{sku_id}/`
- [ ] AC-US3-03: Nonprofit in `listings/nonprofit/{id}/`
- [ ] AC-US3-04: Blog in `blogs/{id}/`
- [ ] AC-US3-05: General in `general/`

### US-004: Admin Media Management
- [ ] AC-US4-01: `/admin/media` page exists
- [ ] AC-US4-02: Filter by entity type
- [ ] AC-US4-03: Filter by entity
- [ ] AC-US4-04: Delete individual files
- [ ] AC-US4-05: Bulk delete by entity

### US-005: Video Upload
- [ ] AC-US5-01: Videos up to 5MB accepted
- [ ] AC-US5-02: Videos > 5MB rejected
- [ ] AC-US5-03: Videos stored in correct structure
- [ ] AC-US5-04: HTML5 video player used

## Code Quality Standards

| Rule | Standard |
|------|----------|
| Imports | Named exports, no default |
| Error handling | Typed errors with messages |
| Logging | console.error for failures only |
| Types | Strict mode, no `any` |
| Tests | BDD format (Given/When/Then) |

## Performance Budget

| Metric | Budget |
|--------|--------|
| Compression | < 500ms |
| Upload (2MB) | < 5s (network dependent) |
| API response | < 200ms |
| Bundle delta | < 5 KB |

## Rollback Plan

If issues arise:
1. Revert to Sharp-based server compression
2. Disable deduplication check
3. Keep existing R2 structure (backward compat)
