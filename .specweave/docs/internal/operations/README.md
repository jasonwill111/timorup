# Operations Documentation

## Health Checks

```bash
# Check workers health
curl https://timorup.jasonwill.workers.dev/api/health

# Check API
curl https://timorup.jasonwill.workers.dev/api/businesses
```

## Scheduled Tasks

### Daily Cleanup (Sunday 3:00 AM UTC)

| Task | Cron | Purpose |
|------|------|---------|
| `_cleanup.ts` | `0 3 * * 0` | Delete expired listings (7+ days), removes R2 folders + D1 records |
| `_mark-expired.ts` | Daily | Mark subscriptions as expired |
| `_cleanup-orphan-media.ts` | Daily | Delete orphan R2 files |

### Cleanup Rate Limit

| Endpoint | Limit | Window |
|----------|-------|---------|
| `/api/scheduled/cleanup-rate-limit` | 1 request | Per day |

## Cost Optimization

| Resource | Monthly Cost (est.) |
|----------|---------------------|
| D1 | ~$0 (free tier) |
| R2 (50GB) | ~$0.80 |
| Workers (10M requests) | ~$5 |
| KV (sessions) | ~$0 |
| **Total** | **~$6/month** |

## File Upload Limits

| Type | Max Size | Format |
|------|----------|--------|
| Image | 2 MB | WebP (auto-converted) |
| Video | 8 MB | Original format |

## Common Issues

### Wrangler port conflict

```bash
# Kill existing wrangler process
pkill -f wrangler

# Use different port
npx wrangler dev --port 8789
```

### Local D1 not syncing

```bash
# Push schema to local D1
pnpm db:push

# Or sync with production
npx wrangler d1 execute TimorUp-db --remote --file=src/db/seed.sql
```

### Auth failing (503 errors)

**Cause**: better-auth exceeds 10ms CPU limit on Free Plan

**Solution**: Use light-auth actions instead:
```typescript
const result = await actions.auth.lightSignIn({ email, password });
```

## Deployment

| Environment | Command |
|-------------|---------|
| Preview | `wrangler deploy --dry-run` |
| Production | `git push` (CI/CD) |

### CI/CD Pipeline

1. Build: `pnpm build`
2. Test: `pnpm test` + `pnpm test:e2e`
3. Deploy: Cloudflare Workers

---
*Updated 2026-05-30*
