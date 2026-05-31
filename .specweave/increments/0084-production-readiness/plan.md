# Production Readiness - Plan

## Design

### Phase 1: Monitoring (Critical)
1. **Sentry Integration** (`@sentry/cloudflare`)
   - Add to astro.config.mjs integration
   - Create src/lib/monitoring/sentry.ts wrapper
   - Configure DSN via environment variable

2. **Health Check Endpoint** (`src/pages/api/health.ts`)
   - Server Island pattern for Workers runtime
   - Check D1 DB connectivity
   - Check KV cache connectivity
   - Return JSON with status + timestamp

### Phase 2: Error Handling
- **Pattern**: Replace `throw new Error(msg)` with `return createErrorResponse(ErrorCode.X, msg)`
- **Files**: 45 action files across auth/business/admin/media/products/banners
- **Validation**: `z.any()` → `z.instanceof(File)` for file uploads

### Phase 3: CI/CD
- **ci.yml**: Add `needs: [test]` to build job
- **deploy.yml**: Add `/api/health` validation
- **audit**: Add `pnpm audit --audit-level=high`

### Phase 4: Environment
- **.env.example**: Add SENTRY_DSN, DATABASE_ID, SESSION_KV_ID
- **wrangler.jsonc**: Use `${DATABASE_ID}` env var pattern

### Phase 5: SEO/Accessibility
- **JSON-LD**: Add LocalBusiness schema to business/[slug].astro
- **JSON-LD**: Add Product schema to listing/[slug].astro
- **Alt text**: Fix empty alt attributes
- **compressHTML**: Investigate CI issue, enable

## Rationale

1. **Sentry first** - Production incidents without monitoring = blind flying
2. **Error handling second** - 70+ throw patterns break SSR error boundaries
3. **CI/CD third** - Prevent regressions from reaching production
4. **SEO last** - High value but lower risk than the above