# Implementation Plan: Admin Media Upload UI

## Overview

Add image upload UI to Admin Categories and Heroes pages, replacing text inputs with drag-and-drop upload zones.

## Architecture

### Components
- **Upload Dropzone**: Border-dashed clickable area, triggers file input
- **Hidden File Input**: `type="file" accept="image/*"`
- **Preview Area**: Shows uploaded image with remove button
- **Hidden Media ID Input**: Stores media ID for form submission

### Files Modified
| File | Change |
|------|--------|
| `src/pages/admin/categories.astro` | Replace image URL text input with upload UI |
| `src/pages/admin/heroes.astro` | Replace image URL text input with upload UI |

### API Contract
- `POST /api/media/upload`: Upload file (folder: `category` or `hero`)
- `GET /api/media/{id}`: Retrieve media file

## Technology Stack

- **Framework**: Astro (SSR mode)
- **Upload API**: Existing `/api/media/upload`
- **Pattern**: Follow existing `admin/blogs.astro` single-image pattern

## Implementation Phases

### Phase 1: Categories Page
1. Replace image URL input with upload UI
2. Add upload/remove handlers
3. Update form submission
4. Handle edit mode

### Phase 2: Heroes Page
1. Replace image URL input with upload UI
2. Add upload/remove handlers
3. Handle edit mode

## Testing Strategy

- Manual verification via admin UI
- Build verification: `pnpm build`