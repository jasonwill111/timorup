# components

**Path**: `src/components`

## Purpose

Astro components and UI elements. Includes business cards, product cards, motion animations, and islands.

## Directory Structure

```
src/components/
├── ui/
│   ├── MotionAnimations.astro  # Motion.js animations
│   ├── BusinessCard.astro      # Business listing card
│   ├── ProductCard.astro       # Product/SKU card
│   └── ...
├── islands/                    # Astro Islands (hydrated)
│   ├── HomepageContent.astro   # Homepage dynamic content
│   └── ListingContent.astro     # Listings dynamic content
└── ...
```

## Motion Animations

Uses [Motion](https://motion.dev) library for animations.

### Available Functions

| Function | Purpose |
|----------|---------|
| `fadeInUp()` | Elements fade in + slide up |
| `slideInLeft/Right()` | Slide from left/right |
| `scaleIn()` | Scale from 0.9 to 1 |
| `staggerFadeIn()` | Staggered children animation |
| `addHoverLift()` | Card hover lift effect |
| `addCardGlow()` | Card border glow on hover |
| `addButtonFeedback()` | Button press feedback |
| `textReveal()` | Word-by-word text reveal |
| `animateCounter()` | Number counter animation |

### Auto-Initialized Effects

```typescript
// MotionAnimations.astro - auto-initializes on DOMContentLoaded
- Hero title text reveal
- Card hover lift + glow
- Filter tag click effects
- Button feedback
- Link underline animation
- Header slide-in (left/right sections)
- Listing card entrance
```

### Usage

```astro
<!-- In any .astro file -->
<script>
  import { fadeInUp, addHoverLift } from '@/components/ui/MotionAnimations.astro';

  // Manual call
  fadeInUp('.listing-card', 0.2);
  addHoverLift('.product-card');
</script>
```

## Business Components

### BusinessCard

```astro
<BusinessCard business={business} showActions={true} />
```

### ProductCard

```astro
<ProductCard product={product} />
```

## Islands (SSR Hydrated Components)

### HomepageContent

Server-rendered with client-side interactivity for dynamic sections.

### ListingContent

Handles listing grid with filters and pagination.

## Analysis Summary

- **Files Analyzed**: 42
- **Source Files**: 42
- **Test Files**: 0
- **Documentation Coverage**: 60%

---
*Analysis updated on 2026-05-06*