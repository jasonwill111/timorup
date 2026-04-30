# Astro Knowledge (timorlist)

> v6.1.9 | Node 20+ | Cloudflare Workers | Drizzle ORM | TailwindCSS v4

## Quick Commands

```bash
pnpm dev        # Static dev (no D1/R2)
pnpm dev:cf     # Cloudflare dev (D1/R2 access)
pnpm build      # Build for production
pnpm preview:cf # Preview with wrangler
pnpm db:push    # Push schema to D1
```

## SSR + Cloudflare Workers

**正确开发方式**:
```bash
# 1. Build first
pnpm build

# 2. Start wrangler dev (local D1/R2)
npx wrangler dev dist/server/entry.mjs --local --persist-to=.wrangler/state

# 3. Access at localhost:8787
```

**错误方式**: `pnpm dev` (无 D1/R2 访问)

## D1 访问模式

```typescript
// ✅ Astro v6 正确模式
import { env as cfEnv } from 'cloudflare:workers';

const dbBinding = (cfEnv as any).carsevs_db;
if (dbBinding) {
  const { drizzle } = await import('drizzle-orm/d1');
  const db = drizzle(dbBinding);
}
```

## output 模式

| 模式 | 说明 |
|------|------|
| `output: 'static'` | 静态生成 |
| `output: 'server'` | SSR (Workers 必须) |

## 环境变量

| 环境 | 写法 |
|------|------|
| 本地 | `import.meta.env.KEY` |
| Workers | `env from 'cloudflare:workers'` |

## Project Structure

```
src/
├── pages/          # 路由 (SSR 需要 export const prerender = false)
│   ├── api/        # API 端点
│   ├── account/    # 账户页面
│   └── business/   # 业务页面
├── components/     # Astro/React 组件
├── lib/            # 工具函数 (db, auth)
├── db/             # Drizzle schema
├── layouts/        # Layout 组件
└── actions/        # Astro Actions
```

## API Routes

```typescript
// src/pages/api/businesses/index.ts
export const prerender = false;

export async function GET({ request }: { request: Request }) {
  // SSR 逻辑
}
```

## Middleware

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  // 缓存等逻辑
  return response;
});
```

## Build Output

```bash
pnpm build  # 输出到 dist/
├── client/  # 静态资源
└── server/  # Workers bundle
```

## Cloudflare 特定

| 功能 | 配置 |
|------|------|
| D1 | `wrangler.toml` bindings |
| R2 | `wrangler.toml` bindings |
| KV | `wrangler.toml` bindings |
| 路由 | `public/_routes.json` |

## Zod v4

```typescript
import * as z from 'zod';

// ✅ v4 方式
const schema = z.object({
  email: z.email({ error: 'Invalid email' }),
  name: z.string().min(1),
});

// ❌ 旧方式 (已废弃)
// z.string().email() → z.email()
```
