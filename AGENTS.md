# AGENTS.md

> 本文件是 AI agent 的开发规范入口。所有 AI coding agents 应遵循此文件。

## 本地知识库 (必须先加载)

**按顺序加载，再写任何代码：**

```
1. ~/.claude/rules/testing.md    - 测试策略
2. ~/.claude/rules/security.md   - 安全基线
3. ~/.claude/rules/code-quality.md - 代码质量
4. ~/.claude/rules/ts.md         - TypeScript 规范
5. ~/.claude/rules/ui.md         - UI 规范
6. ~/.claude/rules/d1.md        - D1/SQLite 规范
7. ~/.claude/rules/cloudflare-workers-pages.md - Cloudflare 部署
```

**禁止**: 直接用记忆写代码，不查本地或官方知识

---

## 验证触发词 (强制)

| 触发词 | 必须执行 |
|--------|----------|
| 已完成 / done / fixed / 好了 | 完整验证流程 |
| 进度如何 | 验证当前状态 |

**验证流程**:
```bash
1. pnpm build                                              # exit 0
2. npx wrangler dev dist/server/entry.mjs --local &      # 后台启动
3. sleep 15
4. curl localhost:8787/                                   # HTTP 200
5. curl localhost:8787/listing                            # HTTP 200
```

**禁止**: 未完成验证声称"完成"

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Astro | ^6.1.9 |
| Adapter | @astrojs/cloudflare | ^13.2.0 |
| Database | SQLite via libsql + Drizzle ORM | ^0.45.1 |
| Auth | better-auth + drizzle-adapter | ^1.5.3 |
| Styling | TailwindCSS v4 + @tailwindcss/vite | ^4.2.1 |
| UI Components | Pure Astro (.astro) + TailwindCSS | - |
| Icons | @lucide/astro | ^1.8.0 |
| Rich Text | TipTap | ^3.20.4 |
| State | Nanostores | ^1.0.0 |
| Validation | Zod v4 | ^4.3.6 |
| Deployment | Cloudflare Workers (Astro SSR + workerd) |
| Testing | Vitest + Playwright |

**All source code uses TypeScript (.ts/.tsx)** - No JavaScript files in src/.

---

## Commands

```bash
# Local Development (D1/R2 访问)
npx wrangler dev dist/server/entry.mjs --local --persist-to=.wrangler/state

# Local D1 Explorer
http://localhost:8787/__wrangler_local_explorer__

# Build
pnpm build                            # Build SSR + 静态页面

# Testing
pnpm test                             # Vitest unit tests
pnpm test:e2e                         # Playwright E2E
pnpm test:all                         # Full suite

# Database
npx drizzle-kit push                  # Push schema to local D1
npx drizzle-kit studio                # Drizzle Studio

# CI/CD (自动部署)
git push                              # GitHub Actions 自动部署到 Workers
```

---

## Code Standards

### TypeScript
- **Strict mode** required
- **No `any`** - use `unknown` + type guards
- **ESM only** - import/export

### Security
- **All user input** must be Zod-validated
- **XSS prevention**: DOM manipulation or `escapeHtml()` - NEVER `innerHTML`
- **SQL injection**: Use ORM/drizzle parameterized queries
- **Secrets**: Never hardcode, use env vars

### UI Components
- **Pure Astro** - no React/shadcn
- **TailwindCSS v4** - CSS-based config in `globals.css`
- **Mobile first** responsive design

### Database
- **Drizzle ORM** with D1/SQLite
- **Schema**: `src/db/schema/`
- **Local dev**: `./local.db`

---

## Project Structure

```
src/
├── pages/
│   ├── api/              # API endpoints
│   ├── business/          # Business pages
│   ├── organization/     # Gov/NGO pages
│   ├── admin/            # Admin dashboard
│   └── listing/           # Listing pages
├── components/
│   ├── ui/               # UI components (pure Astro)
│   └── business/          # Business components
├── layouts/              # Astro layouts
├── db/
│   └── schema/           # Drizzle schema
└── lib/                  # Utilities
```

---

## Testing Requirements

### Unit Tests
- Lib utilities: `src/lib/*.test.ts`
- Run: `pnpm test`

### E2E Tests
- Critical flows: registration, login, create listing
- Run: `pnpm test:e2e`

### Coverage Targets
- Unit: 95%
- Integration: 90%
- E2E: 100% of AC scenarios

---

## Entity Types

| Type | Route | Features |
|------|-------|----------|
| `business` | `/business/[slug]` | Products, reviews, hours, ratings |
| `government` | `/govs/[slug]` | Simplified (info + contact) |
| `nonprofit` | `/ngos/[slug]` | Simplified (info + contact) |

---

## Pages

| Page | Route | SSR |
|------|-------|-----|
| Homepage | `/` | ✅ |
| Directory | `/listing` | ✅ |
| Products | `/products-services` | ✅ |
| Business Detail | `/business/[slug]` | ✅ |
| Product Detail | `/business/[slug]/product/[id]` | ✅ |

---

## Claude Code

Claude Code 使用 `CLAUDE.md` 获取 SpecWeave 工作流配置：

- `/sw:increment` - 创建新功能
- `/sw:do` - 执行实现
- `/sw:done` - 关闭功能
- `/sw:validate` - 质量检查

**See `CLAUDE.md` for SpecWeave workflow details.**

---

## Notes

- 本项目使用 **SpecWeave** 管理功能开发流程
- 所有功能开发应通过 increment 进行
- 遵循 TDD 模式 (RED→GREEN→REFACTOR)
- 提交前必须运行测试
