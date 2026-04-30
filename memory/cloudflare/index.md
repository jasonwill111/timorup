# Cloudflare Workers (timorlist)

> Wrangler v4.86.0 | compatibility_date: 2026-04-28

## 基础设施

| 资源 | Binding | ID |
|------|---------|-----|
| D1 | `DB` | timorlist-db (e7e1e025-7ba2-4106-a905-bbcd8038b3e4) |
| KV | `SESSION` | 3e9ae14a105b4aa48316eaa029f5bc5f |
| R2 | `MEDIA_BUCKET` | timorlist-media |
| Workers | - | https://timorlist.jasonwill.workers.dev |

## 开发命令

```bash
# 构建 + 启动 wrangler
pnpm build
npx wrangler dev dist/server/entry.mjs --local --persist-to=.wrangler/state

# 访问
# http://localhost:8787/
# http://localhost:8787/__wrangler_local_explorer__  # D1/KV/R2 GUI
```

## D1 操作

```bash
# 本地
npx wrangler d1 execute timorlist-db --local --persist-to=.wrangler/state --command="SELECT * FROM users"

# 远程
npx wrangler d1 execute timorlist-db --remote --command="SELECT * FROM users"

# Push schema
pnpm db:push
```

## 环境变量

```bash
# wrangler.jsonc 或 .dev.vars
BETTER_AUTH_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
APP_URL=http://localhost:8787
MINIMAX_API_KEY=xxx
```

## R2 文件操作

```typescript
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

// 上传
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
