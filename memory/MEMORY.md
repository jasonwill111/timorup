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

## Tech Stack Summary

- **Astro**: v6.1.9 (SSR + Cloudflare adapter)
- **Cloudflare**: Workers, D1, R2, KV
- **better-auth**: v1.5.3 (session-based auth)
- **Drizzle**: v0.45.1 (ORM)
- **TailwindCSS**: v4.2.1 (CSS config)
- **Zod**: v4.3.6 (validation)
- **Mastra**: v1.28.0 (AI agents)
- **Playwright**: v1.58.2 (E2E)
