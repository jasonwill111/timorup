# Operations Documentation

## Monitoring

| Resource | Endpoint | Threshold |
|----------|----------|-----------|
| Workers | Cloudflare Dashboard | Error rate > 1% |
| D1 | Cloudflare D1 | Query latency > 500ms |
| R2 | Cloudflare R2 | Upload failures |

## Health Checks

```bash
# Check workers health
curl -I https://timorlist.jasonwill.workers.dev

# Check API
curl https://timorlist.jasonwill.workers.dev/api/products
```

## Scheduled Tasks

### Weekly Cleanup (Sunday 3:00 AM UTC)

| Task | Cron | Purpose |
|------|------|---------|
| `_cleanup.ts` | `0 3 * * 0` | Delete expired businesses (60+ days), removes R2 folders + D1 records |
| `_cleanup-orphan-media.ts` | `0 3 * * 0` | Delete orphan R2 files (files without D1 metadata) |

### Cost Optimization

| Resource | Monthly Cost (est.) |
|----------|---------------------|
| D1 | ~$0 (free tier) |
| R2 (50GB) | ~$0.80 |
| Workers (10M requests) | ~$5 |
| KV (sessions) | ~$0 |
| **Total** | **~$6/month** |

### File Upload Limits

| Type | Max Size | Format |
|------|----------|--------|
| Image | 2 MB | WebP (auto-converted) |
| Video | 8 MB | Original format |

## Common Issues

### Local D1 not syncing

```bash
# Push schema to local D1
npx drizzle-kit push

# Or sync with production
npx wrangler d1 execute timorlist-db --remote --command "SELECT 1"
```

### Wrangler port conflict

```bash
# Kill existing wrangler process
pkill -f wrangler

# Use different port
npx wrangler dev --port 8789
```

## Rollback

If deployment fails:
1. Check CI logs for error
2. Revert to previous commit if needed
3. Push fixed version

---
*Updated 2026-05-01*