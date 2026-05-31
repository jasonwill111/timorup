# components

**Path**: `src/components`

## Purpose

Astro components and UI elements. Includes business cards, product cards, CSS animations, and islands.

## Directory Structure

```
src/components/
├── ui/
│   ├── CSSAnimations.astro   # CSS-based animations (Tailwind-first)
│   ├── LucideIcon.astro     # Unified Lucide icon component
│   ├── ThemeToggle.astro    # Dark/light mode toggle
│   ├── ToastContainer.astro  # Toast notifications
│   ├── BusinessCard.astro   # Business listing card
│   ├── ProductCard.astro    # Product/SKU card
│   ├── FileUpload.astro    # Media upload component
│   ├── CarouselBanner.astro # Banner carousel component
│   └── TiptapEditor.astro  # Rich text editor
├── islands/                  # Astro Islands (hydrated)
│   ├── HomepageContent.astro # Homepage dynamic content
│   └── ListingContent.astro  # Listings dynamic content
└── Header.astro              # Site header
    Footer.astro              # Site footer
```

## CSS Animations (Tailwind-first)

**Priority**: Tailwind CSS utilities → Pure CSS for complex cases

Uses Tailwind's transition utilities by default. Pure CSS only for complex keyframes and selectors.

### CSS Classes Available

| Class | Purpose |
|-------|---------|
| `.reveal-on-scroll` | Fade in on scroll (IntersectionObserver) |
| `.card-hover` | Card hover lift effect |
| `.card-glow` | Card border glow on hover |
| `.stagger-children` | Staggered children animation |
| `.skeleton` | Loading skeleton with shimmer |
| `.ripple` | Button ripple effect |
| `.dropdown-enter/exit` | Dropdown animations |

### JavaScript Utilities

`src/lib/css-animations.ts` provides JS functions for:

| Function | Purpose |
|---------|---------|
| `initCSSAnimations()` | Initialize all CSS animations |
| `initScrollReveal()` | Scroll-based reveal |
| `initLazyLoad()` | Lazy load images with fade |
| `initParallax()` | Parallax scroll effect |
| `initScrollProgress()` | Scroll progress bar |
| `animateCounterJS()` | Number counter animation |

### Usage

```astro
<script>
  import { initCSSAnimations } from '@/lib/css-animations';

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card').forEach(el => {
      el.classList.add('reveal-on-scroll', 'card-hover');
    });
    initCSSAnimations();
  });
</script>
```

### Animation Principles

1. **Tailwind First**: Use `transition-*`, `hover:*`, `animate-*` utilities
2. **CSS for Complex**: Keyframes, complex selectors in CSSAnimations.astro
3. **JS for Triggers**: IntersectionObserver, scroll events
4. **Reduced Motion**: All animations respect `prefers-reduced-motion`

### Motion.js Removed (2026-05-31)

| Removed | Status |
|---------|--------|
| `motion` dependency | DELETED |
| `MotionAnimations.astro` | DELETED |
| `motion-utils.ts` | DELETED |
| `CSSAnimations.astro` | CREATED |
| `css-animations.ts` | CREATED |

## LucideIcon Component

```astro
<LucideIcon name="User" size={24} class="text-muted" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | required | Lucide icon name |
| size | number | 24 | Icon size in px |
| class | string | - | Additional CSS classes |
| strokeWidth | number | 2 | Stroke width |

## CarouselBanner Component

Reusable banner carousel used across multiple pages.

### Usage

```astro
<CarouselBanner position="homepage" class="rounded-none shadow-none" />
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| position | 'homepage' \| 'businesses' \| 'listings' \| 'products-services' | Yes | Unique identifier for carousel instance |
| class | string | No | Additional CSS classes |

### Pages Using CarouselBanner

| Page | Path |
|------|------|
| Homepage | `/` |
| Businesses | `/businesses` |
| Listings | `/listings` |
| Products & Services | `/products-services` |

### CSS Structure

```css
.carousel-banner { /* container */ }
.carousel-track-wrapper {
  position: relative;
  overflow: hidden;
}
.carousel-track {
  position: absolute;
  top: 0; left: 0;
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

Navigation arrows use inline styles for reliable positioning:

```astro
<button style="position: absolute; left: 0.5rem; top: 50%; transform: translateY(-50%);">
```

### Slide Positioning

Each slide is positioned using inline `left` style:

```astro
<div style={`left: ${index * 100}%`}>
```

### JavaScript API

| Function | Description |
|----------|-------------|
| `goToSlide(index)` | Navigate to specific slide |
| `nextSlide()` | Go to next slide |
| `prevSlide()` | Go to previous slide |

### Responsive Height

```css
/* Responsive height classes */
.h-56 sm:h-72 md:h-80 lg:h-96 xl:h-[500px]
```

### Animation Notes

- Track transform handles horizontal sliding
- Arrows stay vertically centered via `top: 50% + translateY(-50%)`
- Arrows are inside wrapper to maintain proper stacking context

## Analysis Summary

- **Files Analyzed**: 61
- **Source Files**: 61
- **Test Files**: 0
- **Documentation Coverage**: 75%

---
*Analysis updated on 2026-05-31*
