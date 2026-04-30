# components

**Path**: `src/components`

## Purpose

Reusable UI components for Astro pages.

## Overview

The components module contains 25 files with approximately 1,600 lines of code.

## Key Components

| Component | Purpose |
|-----------|---------|
| `ImageUploader` | R2 media upload with progress |
| `LexicalEditor` | Rich text editor (TipTap) |
| `OptimizedImage` | Cloudflare Image optimization |
| `ReviewForm` | Review submission form |
| `StarRating` | Rating display/input |
| `ReviewsList` | Review list with pagination |
| `ToastContainer` | Toast notifications |

## Patterns Used

- Preact Islands for interactive components
- nanostores for state management
- TailwindCSS v4 for styling

## Analysis Summary

- **Source Files**: 25
- **Test Files**: 0
- **Total Exports**: 15+

## Dependencies

- `@lexical/react` (editor)
- `nanostores` (state)
- `@nanostores/react`

---
*Updated 2026-04-30*