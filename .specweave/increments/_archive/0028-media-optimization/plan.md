# Implementation Plan: Media Upload Optimization

## Overview

Refactor media upload to use client-side Canvas compression, SHA256 deduplication, and hierarchical R2 folder structure. Replace existing Sharp-based server-side processing with lightweight client-side approach.

## Architecture

### Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `lib/media/` | Media utilities module | `src/lib/media/` |
| `lib/media/r2.ts` | R2 operations | `src/lib/media/r2.ts` |
| `lib/media/compress.ts` | Canvas compression | `src/lib/media/compress.ts` |
| `lib/media/hash.ts` | SHA256 deduplication | `src/lib/media/hash.ts` |
| `lib/media/types.ts` | Type definitions | `src/lib/media/types.ts` |
| `lib/media/index.ts` | Module exports | `src/lib/media/index.ts` |
| `/admin/media` | Admin panel | `src/pages/admin/media.astro` |
| `/api/media/upload` | Upload endpoint | `src/pages/api/media/upload.ts` |

### Data Model

```typescript
// media table schema updates
interface Media {
  id: string;
  url: string;                    // Public URL
  filename: string;              // Original filename
  mimeType: string;              // Original or WebP
  size: number;                  // Compressed size
  width?: number;
  height?: number;
  alt?: string;
  type: 'image' | 'video' | 'document';
  businessId?: string;           // Keep for backward compat
  createdById?: string;
  // New fields
  hash: string;                  // SHA256 for deduplication
  entityType: 'business' | 'nonprofit' | 'blog' | 'page' | 'general';
  entityId: string;             // business_id / sku_id / blog_id
  category: 'profile' | 'banner' | 'gallery' | 'sku' | 'updates' | 'hero' | 'content';
  r2Key: string;                // Full R2 key path
  createdAt: Date;
}
```

### API Contracts

#### POST /api/media/upload
```typescript
// Request
{
  file: Blob;                    // Compressed file
  hash: string;                  // SHA256 for deduplication
  entityType: string;
  entityId: string;
  category: string;
  filename?: string;
  alt?: string;
}

// Response (success)
{
  success: true;
  media: Media;
  isDuplicate: boolean;         // true if hash matched
}

// Response (error)
{
  success: false;
  error: string;
}
```

#### GET /api/media?entityType=&entityId=&category=
```typescript
// Response
{
  success: true;
  media: Media[];
  total: number;
}
```

#### DELETE /api/media/:id
```typescript
// Response
{
  success: true;
}
```

## Technology Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Compression | Canvas API | Native, fast, no deps |
| Hashing | Web Crypto API | Native SHA256 |
| Storage | R2 Workers Binding | Existing setup |
| Framework | Astro SSR | Existing setup |

## Design

### Client-Side Compression Flow

```typescript
// compress.ts
export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // Calculate dimensions
      let { width, height } = img;
      const maxDim = 1920;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Compression failed')),
        'image/webp',
        0.85
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
```

### SHA256 Hash Flow

```typescript
// hash.ts
export async function sha256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

### R2 Key Generation

```typescript
// r2.ts
export function buildR2Key(params: {
  entityType: string;
  entityId: string;
  category: string;
  filename: string;
}): string {
  const { entityType, entityId, category, filename } = params;

  // General files
  if (entityType === 'general') {
    return `general/${category}/${filename}`;
  }

  // Listings
  if (['business', 'nonprofit'].includes(entityType)) {
    const folder = `listings/${entityType}/${entityId}`;
    if (category === 'sku') {
      // SKU images: listings/business/{id}/sku-{sku_id}/file
      return `${folder}/sku-${entityId}/${filename}`;
    }
    return `${folder}/${category}/${filename}`;
  }

  // Blogs
  if (entityType === 'blog') {
    return `blogs/${entityId}/${filename}`;
  }

  // Pages
  return `pages/${entityId}/${filename}`;
}
```

### Upload Flow

```typescript
// upload.ts (API endpoint)
export async function POST({ request, env }) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const hash = formData.get('hash') as string;
  const entityType = formData.get('entityType') as string;
  const entityId = formData.get('entityId') as string;
  const category = formData.get('category') as string;

  // 1. Check size limits
  if (file.type.startsWith('image/') && file.size > 2 * 1024 * 1024) {
    return error('Image must be under 2MB');
  }
  if (file.type.startsWith('video/') && file.size > 5 * 1024 * 1024) {
    return error('Video must be under 5MB');
  }

  // 2. Check deduplication
  const existing = await db.findByHash(hash);
  if (existing) {
    return success({ media: existing, isDuplicate: true });
  }

  // 3. Build R2 key
  const r2Key = buildR2Key({ entityType, entityId, category, filename });

  // 4. Upload to R2
  await env.MEDIA_BUCKET.put(r2Key, file.stream(), {
    httpMetadata: { contentType: file.type }
  });

  // 5. Create DB record
  const media = await db.create({
    id: crypto.randomUUID(),
    url: `${getR2PublicUrl()}/${r2Key}`,
    hash,
    entityType,
    entityId,
    category,
    r2Key,
    ...
  });

  return success({ media, isDuplicate: false });
}
```

## Implementation Phases

### Phase 1: Module Refactor
1. Create `lib/media/types.ts`
2. Create `lib/media/hash.ts`
3. Create `lib/media/compress.ts`
4. Create `lib/media/r2.ts`
5. Update `lib/media/index.ts`

### Phase 2: API Updates
1. Update schema with new fields
2. Create migration
3. Update `/api/media/upload` endpoint
4. Add deduplication check

### Phase 3: Admin Panel
1. Create `/admin/media.astro`
2. Add filters (entityType, entityId, category)
3. Add delete functionality
4. Add bulk delete

### Phase 4: Frontend Integration
1. Update existing upload forms to use Canvas compression
2. Add hash calculation before upload
3. Update media display components

## Testing Strategy

| Layer | Tool | Coverage |
|-------|------|----------|
| Unit | Vitest | lib/media functions |
| Integration | Playwright | Upload flow |
| E2E | Playwright | Full upload scenario |

## Technical Challenges

### Challenge 1: Canvas Compression in Workers
**Problem**: Canvas API not available in Cloudflare Workers
**Solution**: Client-side compression only, Workers receives already-compressed data
**Risk**: Low - approach confirmed

### Challenge 2: Large File Upload to R2
**Problem**: Streaming large files through Workers
**Solution**: Stream directly to R2, no buffer in memory
**Risk**: Low - existing pattern works

### Challenge 3: Backward Compatibility
**Problem**: Existing media records have no hash/entityType
**Solution**: Migration adds defaults, existing code still works
**Risk**: Low - nullable fields
