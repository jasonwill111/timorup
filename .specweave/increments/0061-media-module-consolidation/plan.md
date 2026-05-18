# Implementation Plan: Media Module Consolidation

## Overview

Consolidate 4+ media/R2 utility files into single `src/lib/media.ts` module. Delete `media/index.ts`, `media/r2.ts`, and `pages/api/media/upload.ts`. Update all callers to use unified interface.

## Architecture

### Target Module: `src/lib/media.ts`

**Functions to consolidate** (from multiple sources):

| Function | Source | Status |
|----------|--------|--------|
| `getR2Bucket()` | r2.ts, media.ts | MERGE — throw variant |
| `getR2PublicUrl()` | r2.ts, media.ts | MERGE |
| `buildR2Key(params: MediaUploadParams)` | r2.ts | MERGE — standardize signature |
| `deleteFromR2(key: string)` | r2.ts, media.ts | MERGE |
| `deleteFolderFromR2(prefix: string)` | media.ts | KEEP |
| `listByPrefix(prefix: string)` | r2.ts | MERGE |
| `getPublicMediaUrl(key: string)` | r2.ts, media.ts | MERGE |
| `uploadToR2(data, key, mimeType)` | media.ts | KEEP |
| `uploadImageToR2(file, key)` | media.ts | KEEP |
| `isR2Available()` | media.ts | EXPORT |
| `isAllowedImageType/VideoType` | r2.ts | MERGE |

**Types to export**:
```typescript
export interface MediaUploadParams {
  entityType: EntityType;      // 'business' | 'non_profit' | 'public_sector' | 'listing'
  entityId: string;
  category: MediaCategory;     // 'logo' | 'cover' | 'gallery' | 'video' | 'document'
  filename: string;
}

export type EntityType = 'business' | 'non_profit' | 'public_sector' | 'listing';
export type MediaCategory = 'logo' | 'cover' | 'gallery' | 'video' | 'document';
export type MediaType = 'image' | 'video' | 'document';

export interface UploadResult {
  key: string;
  url: string;
  hash: string;
  isDuplicate: boolean;
}

export interface CompressionOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}
```

**Keep separate** (not R2 utilities):
- S3 client functions: `createS3Client`, `getS3Client`, `resetS3Client` (for legacy compatibility)
- Sharp image processing: `compressImage`, `validateFileSize`, `isImage`, `isVideo`
- Hash utilities: `sha256`, `sha256FromBuffer`

### Files to Modify

| File | Action |
|------|--------|
| `src/lib/media.ts` | ENHANCE — add functions from r2.ts |
| `src/actions/media/upload.ts` | UPDATE imports |
| `src/actions/media/delete.ts` | UPDATE imports |
| `src/pages/api/scheduled/_cleanup.ts` | UPDATE imports |
| `src/pages/api/scheduled/_cleanup-orphan-media.ts` | UPDATE imports |
| `src/lib/media/test.ts` | UPDATE imports |
| `src/lib/media/index.ts` | DELETE |
| `src/lib/media/r2.ts` | DELETE |
| `src/pages/api/media/upload.ts` | DELETE |

### Interface Changes Required

1. **`buildR2Key` signature unification**:
   - Current r2.ts: `buildR2Key(params: MediaUploadParams)`
   - Current actions: `{type, typeId, filename, timestamp, id}`
   - Target: Use `MediaUploadParams` everywhere

2. **Naming consistency**:
   - `deleteByPrefix` (r2.ts) → `deleteFolderFromR2` (media.ts style)
   - Standardize on media.ts naming

## Technology Stack

- **Language**: TypeScript
- **Platform**: Cloudflare Workers
- **Storage**: R2Bucket binding
- **Testing**: Vitest with `cloudflare:workers` mock

## Implementation Phases

### Phase 1: Enhance `src/lib/media.ts`
1. Add `buildR2Key(params: MediaUploadParams)` from r2.ts
2. Add `listByPrefix(prefix: string, limit?)` from r2.ts
3. Add `isAllowedImageType/VideoType` exports from r2.ts
4. Ensure `isR2Available()` exported
5. Update `getPublicMediaUrl` to handle all cases

### Phase 2: Update Callers
1. Update `src/actions/media/upload.ts` imports
2. Update `src/actions/media/delete.ts` imports
3. Update scheduled cleanup endpoints

### Phase 3: Delete Deprecated Files
1. Delete `src/lib/media/index.ts`
2. Delete `src/lib/media/r2.ts`
3. Delete `src/pages/api/media/upload.ts`
4. Update tests in `src/lib/media/test.ts`

## Testing Strategy

1. **Unit tests** for `buildR2Key` key generation
2. **Integration tests** for upload/delete flows (existing)
3. **Import verification** — no remaining imports from deleted files

## Technical Challenges

### Challenge 1: Signature mismatch in `buildR2Key`
**Solution**: Normalize to `MediaUploadParams` interface. Update callers in actions to use structured params instead of flat object.
**Risk**: Low — callers are few and well-identified

### Challenge 2: Tests depend on specific file imports
**Solution**: Update test imports to point to `src/lib/media.ts` after consolidation
**Risk**: Low — tests use `@/lib/media` alias, will auto-resolve