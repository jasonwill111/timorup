# Cloudflare Workers (timorlist)

> Wrangler v4.84.1 | compatibility_date: 2026-04-28

## 核心服务

| 服务 | 用途 |
|------|------|
| **Workers** | Edge Functions (SSR) |
| **D1** | SQLite @ Edge |
| **R2** | 对象存储 (图片) |
| **KV** | Session 存储 |

## 开发命令

```bash
pnpm dev:cf        # Cloudflare 开发模式
pnpm preview:cf    # 本地预览
wrangler dev dist/server/entry.mjs --local --persist-to=.wrangler/state
```

## D1 操作

```bash
wrangler d1 execute timorlist-db --local --file=./drizzle/*.sql
wrangler d1 execute timorlist-db --remote --command="SELECT * FROM business_pages"
wrangler d1 dump timorlist-db --output dump.sql
```

## R2 操作

```bash
wrangler r2 bucket list
wrangler r2 object get timorlist-media/path/to/file
```

## 环境变量

```bash
# .dev.vars (本地 secrets)
JWT_SECRET=xxx
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx
```

## wrangler.toml

```toml
name = "timorlist"
main = "dist/server/entry.mjs"
compatibility_date = "2026-04-28"

[[d1_databases]]
binding = "carsevs_db"
database_name = "timorlist-db"
database_id = "e7e1e025-7ba2-4106-a905-bbcd8038b3e4"

[[kv_namespaces]]
binding = "SESSION"
id = "3e9ae14a105b4aa48316eaa029f5bc5f"

[[r2_buckets]]
binding = "MEDIA"
bucket_name = "timorlist-media"
```

## Workers KV Session

```typescript
import { env } from 'cloudflare:workers';

// 获取 KV
const kv = env.SESSION as KVNamespace;
await kv.get('session-token');
await kv.put('session-token', sessionData, { expirationTtl: 86400 });
```

## R2 文件上传

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/lib-storage';
import { Upload } from '@aws-sdk/lib-storage';

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

// 上传文件
const upload = new Upload({
  client,
  params: {
    Bucket: 'timorlist-media',
    Key: `uploads/${id}/${filename}`,
    Body: file,
    ContentType: file.type,
  },
});
await upload.done();
```
