# Tasks: Media Upload Optimization

## Task Notation

- `T-###`: Task ID
- `[P]`: Parallelizable
- `Model`: haiku (simple), sonnet (medium), opus (complex)

## Phase 1: Module Refactor

### T-001: Create media types module
**Model**: sonnet
**Test**: Given media upload params → When buildR2Key called → Then returns correct path

```typescript
// src/lib/media/types.ts
export interface MediaUploadParams {
  entityType: 'business' | 'nonprofit' | 'blog' | 'page' | 'general';
  entityId: string;
  category: 'profile' | 'banner' | 'gallery' | 'sku' | 'updates' | 'hero' | 'content';
  filename: string;
}

export interface MediaRecord {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  hash: string;
  entityType: string;
  entityId: string;
  category: string;
  r2Key: string;
  createdAt: Date;
}
```

**Status**: completed

---

### T-002: Create SHA256 hash utility
**Model**: haiku
**Test**: Given File object → When sha256 called → Then returns 64-char hex string

```typescript
// src/lib/media/hash.ts
export async function sha256(file: File | Blob): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

**Status**: completed

---

### T-003: Create Canvas compression utility
**Model**: sonnet
**Test**: Given 2MB JPEG File → When compressImage called → Then returns WebP Blob < 500KB

```typescript
// src/lib/media/compress.ts
export async function compressImage(
  file: File,
  options: { maxDim: number; quality: number } = { maxDim: 1920, quality: 0.85 }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      let { width, height } = img;
      if (width > options.maxDim || height > options.maxDim) {
        const ratio = Math.min(options.maxDim / width, options.maxDim / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Compression failed')),
        'image/webp',
        options.quality
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
```

**Status**: completed

---

### T-004: Create R2 operations module
**Model**: sonnet
**Test**: Given MediaUploadParams → When buildR2Key called → Then returns correct structure

```typescript
// src/lib/media/r2.ts
export function buildR2Key(params: MediaUploadParams): string {
  const { entityType, entityId, category, filename } = params;

  if (entityType === 'general') {
    return `general/${category}/${filename}`;
  }

  if (entityType === 'business' || entityType === 'nonprofit') {
    const folder = `listings/${entityType}/${entityId}`;
    if (category === 'sku') {
      return `${folder}/sku-${entityId}/${filename}`;
    }
    return `${folder}/${category}/${filename}`;
  }

  if (entityType === 'blog') {
    return `blogs/${entityId}/${filename}`;
  }

  return `pages/${entityId}/${filename}`;
}

export async function deleteByPrefix(prefix: string): Promise<void> {
  const bucket = getR2Bucket();
  let cursor: string | undefined;

  do {
    const result = await bucket.list({ prefix, cursor, limit: 1000 });
    for (const obj of result.objects ?? []) {
      if (obj.key) await bucket.delete(obj.key);
    }
    cursor = result.truncated ? result.cursor : undefined;
  } while (cursor);
}
```

**Status**: pending

---

### T-005: Update media module exports
**Model**: haiku
**Test**: Import all from index → Verify exports work

```typescript
// src/lib/media/index.ts
export * from './types';
export * from './hash';
export * from './compress';
export * from './r2';
```

**Status**: completed

---

## Phase 2: Schema & Migration

### T-006: Update media schema
**Model**: sonnet
**Test**: Given schema definition → When validated → Then has new fields

```typescript
// Add to src/db/schema/index.ts
export const media = sqliteTable('media', {
  // ... existing fields ...
  hash: text('hash').unique(),           // SHA256 for deduplication
  entityType: text('entity_type'),        // 'business' | 'nonprofit' | 'blog' | 'page' | 'general'
  entityId: text('entity_id'),            // business_id / sku_id / blog_id
  category: text('category'),             // 'profile' | 'banner' | 'gallery' | 'sku' | 'updates' | 'hero'
  r2Key: text('r2_key').unique(),        // Full R2 key path
});
```

**Status**: completed

---

### T-007: Create migration file
**Model**: haiku
**Test**: Given migration applied → When query media → Then has new columns

```sql
-- migrations/0004_add_media_structure.sql
ALTER TABLE media ADD COLUMN hash TEXT;
ALTER TABLE media ADD COLUMN entity_type TEXT;
ALTER TABLE media ADD COLUMN entity_id TEXT;
ALTER TABLE media ADD COLUMN category TEXT;
ALTER TABLE media ADD COLUMN r2_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS media_hash_idx ON media(hash);
CREATE INDEX IF NOT EXISTS media_entity_idx ON media(entity_type, entity_id);
```

**Status**: completed

---

### T-008: Update upload API endpoint
**Model**: opus
**Test**: Given compressed file + hash → When uploaded → Then stored with correct R2 key

```typescript
// src/pages/api/media/upload.ts
// Updates:
// 1. Accept hash in formData
// 2. Check for duplicate hash before upload
// 3. Build R2 key from entity params
// 4. Save all new fields to DB
```

**Status**: completed

---

## Phase 3: Admin Panel

### T-009: Create admin media page
**Model**: opus
**Test**: Given admin visits /admin/media → When page loads → Then shows all media with filters

```astro
<!-- src/pages/admin/media.astro -->
- Header with filters (entityType, entityId, category)
- Grid of media cards (thumbnail, filename, size, entity)
- Delete button per item
- Bulk delete by entity
```

**Status**: completed

---

### T-010: Add media list API endpoint
**Model**: sonnet
**Test**: Given GET /api/media?entityType=business&entityId=xxx → When called → Then returns filtered list

```typescript
// src/pages/api/media/index.ts
// Updates:
// 1. Support entityType, entityId, category query params
// 2. Return total count
```

**Status**: completed

---

## Phase 4: Frontend Integration

### T-011: Update upload form components
**Model**: opus
**Test**: Given user selects image → When uploads → Then shows compression progress

```typescript
// Client-side upload flow:
// 1. File selected
// 2. Calculate SHA256 hash
// 3. Compress with Canvas (if image)
// 4. Check size limit
// 5. Upload with hash + entity params
// 6. Show result
```

**Status**: pending

---

## Phase 5: Testing

### T-012: Write unit tests
**Model**: sonnet
**Test**: Run vitest → Verify all tests pass

```typescript
// src/lib/media/*.test.ts
// Test suites:
// - compress.test.ts: Image compression
// - hash.test.ts: SHA256 calculation
// - r2.test.ts: Key building
```

**Status**: completed

---

### T-013: Write E2E tests
**Model**: sonnet
**Test**: Run Playwright → Verify upload flow works

```typescript
// e2e/media-upload.spec.ts
// Scenarios:
// - Upload image to business
// - Upload duplicate image (should reuse)
// - Upload video
// - Reject oversized file
```

**Status**: deferred (manual testing done)

---

## Dependencies

| Task | Depends on |
|------|------------|
| T-002, T-003 | T-001 |
| T-004 | T-001 |
| T-005 | T-002, T-003, T-004 |
| T-006 | T-005 |
| T-007 | T-006 |
| T-008 | T-005, T-007 |
| T-009 | T-008 |
| T-010 | T-008 |
| T-011 | T-005, T-008 |
| T-012 | T-001, T-002, T-003, T-004 |
| T-013 | T-008, T-009, T-010, T-011 |

## Model Assignment Summary

| Phase | Tasks | Model |
|-------|-------|-------|
| Phase 1 | T-001 to T-005 | sonnet |
| Phase 2 | T-006 to T-008 | sonnet/opus |
| Phase 3 | T-009 to T-010 | opus |
| Phase 4 | T-011 | opus |
| Phase 5 | T-012 to T-013 | sonnet |
