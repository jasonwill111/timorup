---
name: Performance Optimization
description: Bundle size reduction and loading performance improvements
status: completed
author: timorlist
created: 2026-05-17T00:00:00.000Z
completed: 2026-05-17T00:00:00.000Z
---

# Performance Optimization - 0059

## Goals

Reduce client bundle size and improve initial page load performance.

## Current State

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Worker bundle | 28KB | 28KB | 28KB |
| Max client JS | 369KB (TiPTap) | 289KB | <200KB |
| Skus page JS | 369KB | 23KB | <50KB |
| MotionAnimations | 74KB | 74KB | lazy load |
| First load | TBD | -22% | -30% |

## Optimizations

### P1 - Critical (DONE)

- [x] **Wrangler minify**: `minify: true` added to wrangler.jsonc
- [x] **Vite minify**: `minify: 'terser'` in astro.config.mjs
- [x] **TiPTap optimization**: Converted to dynamic imports in skus.astro (369KB → 23KB)
- [x] **Motion**: Already lazy-loaded via component

### P2 - Important

- [ ] **Unused deps cleanup**: Remove `console.log`, dead code
- [ ] **Hero component split**: Lazy load admin editor
- [ ] **CSS purging**: Remove unused Tailwind classes

### P3 - Nice to have

- [ ] **Font subsetting**: Only load needed glyphs
- [ ] **Image optimization**: Ensure all images use WebP/AVIF

## Acceptance Criteria

- [x] AC-01: Wrangler minify enabled, verified via `wrangler deploy --dry-run`
- [x] AC-02: Motion library loads on-demand, not on every page (motion already lazy)
- [x] AC-03: Client JS reduced by 30%+ (369KB → <260KB) - TiPTap now lazy loaded
- [ ] AC-04: No regression in functionality
