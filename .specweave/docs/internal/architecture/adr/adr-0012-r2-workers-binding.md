# ADR-0012: R2 Access via Workers Binding

**Status**: Accepted
**Date**: 2026-05-04

## Context

Previously, R2 was accessed via AWS SDK S3 client with credentials:
```typescript
import { S3Client } from '@aws-sdk/client-s3';
const client = new S3Client({
  region: 'auto',
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});
```

## Decision

Use Cloudflare Workers R2 binding directly:
```typescript
import { env } from 'cloudflare:workers';
const bucket = env.MEDIA_BUCKET as R2Bucket;
await bucket.put(key, body);
```

## Rationale

1. **Simpler** - No AWS SDK dependency, fewer credentials to manage
2. **Native** - Workers binding is the recommended Cloudflare approach
3. **Performance** - Direct binding vs HTTP to R2 API
4. **Security** - No long-lived credentials in env vars

## Consequences

- Remove `@aws-sdk/*` dependencies
- Remove R2 credential env vars (R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)
- Keep only `MEDIA_BUCKET` binding in wrangler.toml
- Update media upload/delete functions to use R2Bucket API

## Migration

1. Add to wrangler.toml:
```toml
[[r2_buckets]]
binding = "MEDIA_BUCKET"
bucket_name = "TimorLink-media"
```

2. Update src/lib/media.ts:
```typescript
import { env } from 'cloudflare:workers';

export async function uploadMedia(file: File, userId: string): Promise<string> {
  const bucket = env.MEDIA_BUCKET as R2Bucket;
  const key = `${userId}/${crypto.randomUUID()}-${file.name}`;
  await bucket.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });
  return key;
}
```

3. Remove from .dev.vars:
   - R2_ENDPOINT
   - R2_ACCESS_KEY_ID
   - R2_SECRET_ACCESS_KEY

---

**References**:
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Workers Binding](https://developers.cloudflare.com/workers/runtime-apis/r2/)

