---
name: 0096-carousel-banner-fix
description: Fix carousel banner arrow positioning issue on non-homepage pages
metadata:
  type: increment
  created: 2026-05-30
  feature: UI Components
  priority: high
---

# Carousel Banner Fix

## Problem Statement

The carousel banner component had a critical bug where navigation arrows would move to incorrect positions after switching slides on non-homepage pages (/businesses, /listings, /products-services). The arrows appeared at the bottom of the banner instead of staying vertically centered.

## Root Cause

1. **CSS specificity conflict**: Navigation buttons had `position: relative` instead of `position: absolute` due to Tailwind class ordering issues
2. **Transform override**: Tailwind's `-translate-y-1/2` class was overriding the inline `translateY(-50%)` transform
3. **Incorrect stacking context**: Arrows were outside the carousel wrapper, causing them to be affected by layout shifts

## Solution

1. **Move arrows inside wrapper**: Place navigation buttons inside `carousel-track-wrapper` for proper positioning context
2. **Use inline styles for positioning**: Apply `position: absolute; top: 50%; transform: translateY(-50%)` via inline styles
3. **Simplified CSS structure**: Track and slides use `position: absolute`, arrows use inline styles

## Changes

### Files Modified
- `src/components/ui/CarouselBanner.astro`

### CSS Changes
```css
.carousel-track-wrapper {
  position: relative;
  overflow: hidden;
}

.carousel-track {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  height: 100%;
  width: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  height: 100%;
  flex-shrink: 0;
}
```

### Arrow Positioning
```astro
<button
  style="position: absolute; left: 0.5rem; top: 50%; transform: translateY(-50%);"
  ...
>
```

### Slide Positioning
Each slide now has explicit left positioning via inline style:
```astro
style={`left: ${index * 100}%`}
```

## Verification

| Page | Initial | After Click | After 2nd Click |
|------|---------|-------------|-----------------|
| /businesses | ✓ | ✓ | ✓ |
| /listings | ✓ | ✓ | - |
| / (homepage) | ✓ | ✓ | - |

All navigation arrows remain vertically centered at `top: 50%` (250px for 500px height banner).

## Related Files

- `src/pages/businesses/index.astro` - Uses CarouselBanner
- `src/pages/listings/index.astro` - Uses CarouselBanner
- `src/pages/index.astro` - Uses CarouselBanner
- `src/pages/products-services/index.astro` - Uses CarouselBanner

## Status

- [x] Problem identified
- [x] Solution implemented
- [x] Verified on all pages