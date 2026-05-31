# Implementation Plan: XSS Sanitization & Accessibility

## Overview

Add DOMPurify sanitization to user-generated content and fix accessibility issues with images.

## Design

### 1. XSS Sanitization

**Pattern**:
```typescript
import DOMPurify from 'dompurify';

// Sanitize user content before storing
const sanitizedContent = DOMPurify.sanitize(input.content, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'target'],
});
```

**Files to modify**:
- `src/actions/business/updates.ts` - sanitize content field
- `src/actions/admin/blogs.ts` - sanitize content field
- `src/actions/reviews/create.ts` - sanitize comment field

### 2. Accessibility

**Pattern**:
```astro
<!-- Decorative image -->
<img src="..." aria-hidden="true" alt="" />

<!-- Meaningful image -->
<img src="..." alt="Description of image" />
```

**Files to modify**:
- `src/pages/business/[slug].astro` - fix banner image
- `src/pages/non-profit/[slug].astro` - fix banner image
- `src/pages/public-sector/[slug].astro` - fix banner image

## Technology Stack

- **Library**: DOMPurify for HTML sanitization
- **Framework**: Astro for SSR
- **Testing**: Vitest with security tests

## Implementation Phases

### Phase 1: Install DOMPurify
1. `pnpm add dompurify`
2. `pnpm add -D @types/dompurify`

### Phase 2: XSS Sanitization
1. Add sanitization to business updates
2. Add sanitization to blogs
3. Add sanitization to reviews

### Phase 3: Accessibility Fixes
1. Fix business detail page images
2. Fix non-profit detail page images
3. Fix public sector detail page images

## Testing Strategy

| Component | Test Type |
|-----------|-----------|
| DOMPurify sanitization | Unit - verify script removal |
| Image alt attributes | Manual - browser inspection |