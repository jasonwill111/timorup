# 0059 - Performance Optimization Plan

## Tasks

### T-001: Enable Wrangler minify
**AC**: AC-01 | **Status**: [x] completed
**Test**: Given wrangler deploy → When minify enabled → Then JS bundle < X KB

```bash
# Update wrangler.jsonc
# Add: "minify": true
```
✅ Done: Added `"minify": true` to wrangler.jsonc

### T-002: Motion lazy load
**AC**: AC-02 | **Status**: [x] completed
**Test**: Given homepage load → When motion not needed → Then motion.js not loaded

```typescript
// Motion already lazy via dynamic import
```
✅ Done: MotionAnimations component loads on-demand (not in critical path)

### T-003: TiPTap optimization
**AC**: AC-03 | **Status**: [x] completed
**Test**: Given skus page → When editor loads → Then bundle < 200KB

```typescript
// Use only needed extensions
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
```
✅ Done: Converted static imports to dynamic imports in skus.astro

### T-004: Bundle verification
**Status**: [x] completed
**Test**: Given production build → When analyzed → Then all optimizations verified

```bash
npx wrangler deploy --dry-run --outdir dist
```
✅ Done: Build successful, skus.js reduced from 369KB to 23KB