# Plan: Type Refactor (0036)

## Overview

Replace 84 `any` usages with proper types following knowledge base TypeScript rules. Incremental file-by-file approach from simple to complex.

## Architecture

### Type Resolution Patterns

| Pattern | Solution |
|---------|----------|
| `data.map((x: any) =>` | Define TypeScript interface matching data structure |
| `let arr: any[]` | Use Drizzle `typeof table.$inferSelect` or explicit interface |
| `(window as any)` | Extend `Window` interface in global.d.ts |
| `as any` cast | Find underlying type or use `unknown` + type guard |

### Files by Complexity

**Phase 1 — Isolated (9 files, 14 any)**
- components/islands/CategoryFilter.astro (1)
- components/ui/MediaGallery.astro (1)
- layouts/AdminLayout.astro (2)
- pages/search.astro (1)
- pages/admin/heroes.astro (5)
- pages/admin/plans.astro (1)
- pages/admin/index.astro (1)
- pages/business/[slug]/products.astro (2)

**Phase 2 — Medium (6 files, 46 any)**
- pages/admin/categories.astro (13)
- pages/admin/skus.astro (6)
- pages/admin/blogs.astro (4)
- pages/admin/users.astro (4)
- pages/admin/reviews.astro (1)
- pages/admin/subscriptions.astro (3)

**Phase 3 — Complex (3 files, 24 any)**
- pages/business/[slug]/edit/index.astro (14)
- pages/business/[slug]/product/new/index.astro (2)
- pages/business/[slug]/product/[id]/edit/index.astro (5)

**Phase 4 — Admin (2 files, 18 any)**
- pages/admin/media.astro (4)
- pages/admin/ai-tools.astro (9)

## Technology Stack

- **Language**: TypeScript 6.0.3 with strict mode
- **Type System**: Drizzle $inferSelect types + explicit interfaces
- **Validation**: Zod 4

## Design Decisions

1. **Drizzle inference first** — Use `typeof table.$inferSelect` for DB-derived types
2. **Explicit interfaces second** — Define interfaces for non-DB data structures
3. **Window interface via global.d.ts** — Avoid `as any` for global function access

## Testing Strategy

Run `pnpm build` after each phase to verify TypeScript errors are resolved.

## Verification

```bash
# Count remaining any usages (should be 0)
grep -rn ": any\| as any" src/ \
  --include="*.ts" --include="*.tsx" --include="*.astro" \
  | grep -v ".test." | grep -v "node_modules" | wc -l
```