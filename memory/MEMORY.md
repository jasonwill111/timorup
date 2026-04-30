# TimorList Memory Index

> 按 Tech Stack 分类，文件只在被引用时加载

## 核心 Tech

| Tech | 文件 | 说明 |
|------|------|------|
| Astro | [astro/index.md](astro/index.md) | SSR + Cloudflare Workers |
| Cloudflare | [cloudflare/index.md](cloudflare/index.md) | Workers, D1, R2, KV |
| better-auth | [better-auth/index.md](better-auth/index.md) | 认证 + Session |
| Drizzle | [drizzle/index.md](drizzle/index.md) | ORM + SQLite/D1 |
| TailwindCSS | [tailwindcss/index.md](tailwindcss/index.md) | v4 CSS-based config |
| Zod | [zod/index.md](zod/index.md) | v4 Schema validation |
| Mastra | [mastra/index.md](mastra/index.md) | AI Agent |
| Playwright | [playwright/index.md](playwright/index.md) | E2E Testing |
| Testing | [testing/index.md](testing/index.md) | 测试策略 |

## 快速加载

```bash
# 开发命令
pnpm dev:cf        # Cloudflare 开发 (D1/R2 访问)
pnpm build          # 构建
pnpm db:push        # Push D1 schema
pnpm test           # Vitest
pnpm test:e2e       # Playwright
```

## Tech Stack Summary (2026-04-30)

| Component | Version |
|-----------|---------|
| Astro | 6.1.10 |
| better-auth | 1.6.9 |
| drizzle-orm | 0.45.2 |
| zod | 4.4.1 |
| tailwindcss | 4.2.4 |
| @mastra/core | 1.29.1 |
| wrangler | 4.86.0 |
| playwright | 1.59.1 |

## 基础设施

- **D1**: timorlist-db (e7e1e025-7ba2-4106-a905-bbcd8038b3e4)
- **KV**: SESSION (3e9ae14a105b4aa48316eaa029f5bc5f)
- **R2**: timorlist-media
- **Workers**: https://timorlist.jasonwill.workers.dev

## Admin API 端点

| Endpoint | Auth | Description |
|----------|------|-------------|
| `/api/admin/stats` | Required | 统计数据 |
| `/api/admin/reviews` | Admin | 评论管理 |
| `/api/admin/businesses` | Admin | 商家列表 |
| `/api/admin/orders` | Admin | 订单列表 |
| `/api/admin/users` | Admin | 用户列表 |
| `/api/admin/categories` | Admin | 分类管理 |
| `/api/admin/listing/*` | Admin | 列表管理 |
| `/api/admin/skus` | Admin | SKU管理 |
| `/api/admin/blogs` | Admin | 博客管理 |
| `/api/admin/settings` | Admin | 设置管理 |
