# Implementation Plan: Astro Server Islands 性能优化

---

## Design

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────�?�?                    Request Flow                           �?├─────────────────────────────────────────────────────────────�?�?                                                            �?�? 1. CDN Check                                               �?�?    ├─ Cache HIT �?Return static HTML immediately           �?�?    └─ Cache MISS �?Continue to Workers                      �?�?                                                            �?�? 2. Workers (SSR + Server Islands)                          �?�?    ├─ Pre-render static shell (hero, cards)               �?�?    └─ Defer HomepageContent until client request           �?�?                                                            �?�? 3. Island Loading                                          �?�?    └─ Client requests island �?Workers renders �?Returns  �?�?                                                            �?└─────────────────────────────────────────────────────────────�?```

### Implementation Plan

#### Phase 1: Enable Server Islands

1. **Modify `src/pages/index.astro`**
   ```astro
   <HomepageContent server:defer>
     <div slot="fallback" class="animate-pulse p-8">
       <div class="grid grid-cols-6 gap-3">
         {[...Array(6)].map(() => (
           <div class="h-32 bg-muted rounded-xl"></div>
         ))}
       </div>
     </div>
   </HomepageContent>
   ```

2. **Update `HomepageContent.astro`**
   - Add fallback slot for loading state
   - Add error boundary for graceful degradation

3. **Add cache headers**
   ```typescript
   // middleware/index.ts
   if (pathname === '/') {
     response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
   }
   ```

#### Phase 2: Middleware Cleanup

1. **Audit middleware responsibilities**
   - `src/middleware/index.ts` �?Admin authentication (Better Auth)
   - `src/middleware.ts` �???? (read and determine)

2. **Merge or remove duplicate logic**

3. **Verify auth flow still works**

#### Phase 3: Testing & Validation

1. Run `pnpm dev` and test locally
2. Verify CDN cache headers are set
3. Lighthouse audit for performance score

### Key Files to Modify

| File | Change | Risk |
|------|--------|------|
| `src/pages/index.astro` | Add server:defer | LOW |
| `src/components/islands/HomepageContent.astro` | Add fallback slot | LOW |
| `src/middleware/index.ts` | Add cache headers | LOW |
| `src/middleware.ts` | Review and potentially remove | MEDIUM |

### Testing Strategy

```bash
# 1. Local testing
pnpm dev
# Navigate to http://localhost:8787
# Check DevTools Network tab for cache headers

# 2. Lighthouse audit
# - Performance �?90
# - LCP < 2.5s
# - TTFB < 200ms

# 3. CDN cache verification
curl -I https://TimorLink.com | grep -E "Cache-Control|Cf-Cache-Status"
```

---

## Rationale

### Why Server Islands?

1. **Performance**: Static HTML can be cached at CDN edge, reducing TTFB
2. **Scalability**: Database queries only happen when island is requested
3. **User Experience**: Skeleton loading provides perceived performance

### Why Not Full SSR?

- Current HomepageContent has no personalization (same for all users)
- Dynamic content (featured businesses) changes infrequently (5min TTL sufficient)
- Full SSR would hit DB on every request regardless of content staleness

### Fallback UI Rationale

Skeleton UI is preferred over empty state because:
- Maintains layout stability (no CLS)
- Provides visual feedback that content is loading
- Reduces perceived wait time

### Middleware Decision

Keeping both middleware files is acceptable if they serve different purposes:
- `middleware/index.ts` �?Admin routes only (RBAC)
- `middleware.ts` �?Could be for non-admin routes or static asset handling

If they overlap, consolidate into single file with clear comment blocks.

---

## Dependencies

- Astro 6.3+ (already installed)
- @astrojs/cloudflare adapter (already configured)

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Island fails to load | LOW | MEDIUM | Add error boundary and fallback UI |
| Middleware conflict | LOW | HIGH | Test all admin routes after changes |
| Cache invalidation issues | MEDIUM | LOW | Clear cache via Wrangler on deploy |

## Timeline

- Phase 1 (Server Islands): 30 min
- Phase 2 (Middleware): 20 min
- Phase 3 (Testing): 30 min
- **Total estimated**: ~1.5 hours

