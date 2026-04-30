# 版本日志

> 每次项目开发前检查并更新此文件

## 2026-04-30

### Astro 6 Hybrid Mode

| 变更 | 说明 |
|------|------|
| `output: 'server'` | 默认 SSR 模式 |
| `prerender = true` | 静态页面在构建时预渲染 |
| 静态页面 | pricing, faq, privacy, terms, 404 |

### 本地开发 D1/R2 访问

| 变更 | 说明 |
|------|------|
| wrangler dev | 使用 workerd 运行时 |
| `--persist-to` | 持久化本地数据 |
| `cloudflare:workers` | 直接访问 D1/R2 绑定 |

**命令**:
```bash
npx wrangler dev dist/server/entry.mjs --local --persist-to=.wrangler/state
```

### 更新的文档

| 文件 | 更新内容 |
|------|----------|
| `CLAUDE.md` | 添加本地开发 section |
| `AGENTS.md` | 更新验证流程和命令 |
| `README.md` | 添加本地开发命令 |
| `docs/ARCHITECTURE.md` | 添加 Hybrid Mode 章节 |
| `docs/project-context.md` | 添加本地开发章节 |
| `@memory/cloudflare/d1.md` | 添加 wrangler dev 说明 |
| `@memory/astro/index.md` | 添加 D1/R2 访问说明 |

---

## 2026-04-29

### 完整测试套件

| 测试类型 | 数量 | 状态 |
|----------|------|------|
| 单元测试 | 182 | ✅ |
| E2E 用户流程 | 20 | ✅ |
| E2E 页面渲染 | 43 | ✅ |
| E2E 安全测试 | 40 | ✅ |
| E2E SEO 验证 | 15 | ✅ |
| E2E 并发测试 | 11 | ✅ |
| E2E 错误页面 | 14 | ✅ |
| E2E API 边界 | 45 | ✅ |
| E2E 移动端 | 23 | ✅ |
| E2E 性能测试 | 28 | ✅ |
| E2E Auth 边界 | 22 | ✅ |
| **总计** | **443+** | ✅ |

### 安全修复

| 问题 | 修复 | 状态 |
|------|------|------|
| XSS 防护 | search.astro 添加 escapeHtml() | ✅ |
| Auth Bypass | 5个 Admin API 添加鉴权 | ✅ |
| Open Redirect | login.astro 添加 URL 验证 | ✅ |

### 新增测试文件

| 文件 | 测试数 |
|------|--------|
| e2e/security.spec.ts | 40 |
| e2e/seo.spec.ts | 15 |
| e2e/concurrent.spec.ts | 11 |
| e2e/error-pages.spec.ts | 14 |
| e2e/api-boundary.spec.ts | 45 |
| e2e/mobile.spec.ts | 23 |
| e2e/performance.spec.ts | 28 |
| e2e/auth-edge.spec.ts | 22 |
| e2e/user-flows.spec.ts | 20 |
| e2e/homepage.spec.ts | 14 |
| e2e/listing.spec.ts | 15 |
| e2e/business-detail.spec.ts | 14 |

### Agent Skills 配置

| 配置 | 值 |
|------|-----|
| Issue Tracker | GitHub Issues |
| Triage Labels | needs-triage, needs-info, ready-for-agent, in-progress, wontfix |
| Domain Docs | .specweave/docs/internal/ |

### Husky Hooks 修复

修复 .husky/_/ 目录下的 executable 权限。

---

## 2026-04-28

### Polish 修复

| 项目 | 变更 | 状态 |
|------|------|------|
| Star Rating A11y | 添加 sr-only + aria-hidden 到所有星级评分 | ✅ |
| Design Context | 添加 .impeccable.md 设计上下文文件 | ✅ |
| 屏幕阅读器 | 评分图标对屏幕阅读器友好 | ✅ |

### 设计系统

- **品牌色**: Yellow #FFD150 on Cream #FDFBF7
- **字体**: Inter (body) + Oswald (headings)
- **Icons**: Lucide SVG (inline)
- **无障碍**: WCAG AA, prefers-reduced-motion 支持

---

## 2026-04-27

### UI/UX 优化

| 项目 | 变更 | 状态 |
|------|------|------|
| Global CSS | 添加 `prefers-reduced-motion` 媒体查询 | ✅ |
| Focus States | 添加 `focus-visible:ring-2` 到所有交互元素 | ✅ |
| cursor-pointer | 添加到所有可点击卡片和按钮 | ✅ |
| Emoji → Lucide SVG | 替换所有 emoji 图标为 Lucide SVG | ✅ |
| Toast Icons | 替换 ✓✕ℹ⚠ 为 SVG icons | ✅ |
| Star Ratings | 替换 ★ emoji 为 SVG star | ✅ |
| Category Icons | 每个分类渲染正确的 Lucide icon | ✅ |
| Skeleton Loaders | 添加 BusinessCardSkeleton, ProductCardSkeleton | ✅ |
| Hero Button | 修复 outline 按钮在 amber 背景不可见问题 | ✅ |

### 优化的文件

| 文件 | 变更 |
|------|------|
| `src/styles/globals.css` | prefers-reduced-motion, focus-visible, scroll-behavior |
| `src/lib/icons.ts` | Lucide SVG paths 映射表 |
| `src/components/ui/ToastContainer.astro` | SVG icons |
| `src/components/ui/Skeleton.astro` | 骨架屏变体 |
| `src/components/ui/Accordion.astro` | focus-visible |
| `src/components/Header.astro` | focus-visible, cursor-pointer |
| `src/components/Footer.astro` | focus-visible |
| `src/components/business/BusinessCard.astro` | cursor-pointer, SVG stars |
| `src/components/business/ProductCard.astro` | cursor-pointer |
| `src/pages/index.astro` | cursor-pointer, focus-visible, Lucide icons, button fix |
| `src/pages/listing/index.astro` | cursor-pointer, focus-visible, SVG stars |
| `src/pages/categories/index.astro` | cursor-pointer, focus-visible |
| `src/pages/businesses/index.astro` | cursor-pointer, SVG stars |
| `src/pages/products-services/index.astro` | cursor-pointer |

### 验证结果

| 验证项 | 结果 |
|--------|------|
| `pnpm build` | ✅ Exit 0 |
| `cursor-pointer` | ✅ 35 处 |
| `focus-visible` | ✅ 31 处 |
| Emoji in HTML | ✅ 0 个 |
| Unique category icons | ✅ 不同 SVG paths |

---

## 2026-04-26

### 重大更新

| 项目 | 变更 | 状态 |
|------|------|------|
| Admin API 重构 | `/api/admin/skus`, `/api/admin/blogs` 端点 | ✅ |
| Admin Listing 管理 | `/admin/listing` 统一管理 business/gov/nonprofit | ✅ |
| AI Tools | `/admin/ai-tools` 4个Tab（Listing/SKU/Blog/Landing） | ✅ |
| Organization 支持 | 政府/NGO/Nonprofit 实体类型 | ✅ |
| Admin Settings | 站点设置保存功能修复 | ✅ |
| SKUs 页面修复 | 修复 `<script define:vars>` 与 module import 冲突 | ✅ |

### 测试结果

| 页面 | 工具 | 结果 |
|------|------|------|
| `/admin/skus` | agent-browser | ✅ 128产品正常加载 |
| `/admin/blogs` | agent-browser | ✅ 正常显示 |
| `/admin/ai-tools` | agent-browser | ✅ 4个Tab正常 |
| `/admin/listing` | agent-browser | ✅ 统计显示30 Total |
| `/admin/settings` | agent-browser | ✅ 表单正常 |

---

## 2026-04-25

### 重大更新

| 项目 | 变更 | 状态 |
|------|------|------|
| 项目重命名 | `timorbiz` → `timorlist` | ✅ |
| Rust 编译器 | 启用 `@astrojs/compiler-rs` | ✅ |
| 测试工具 | 新增 kuri, playwright-cli, browser-use | ✅ |
| XSS 防护 | DOM 操作 + textContent | ✅ |
| Account API | 新增 profile/businesses/subscription 端点 | ✅ |
| 混合模式 | 延期，暂用全 SSR | ⏳ |
| TipTap 编辑器 | 产品描述富文本编辑 | ✅ |
| 产品卡片 | 网格布局，4:3 高宽比，可点击 | ✅ |
| 产品详情页 | SSR + 图片轮播 + WhatsApp 询价 | ✅ |
| 种子数据 | 23 商家，128 产品，37 评论 | ✅ |

### Bug 修复

| 文件 | 问题 | 修复 |
|------|------|------|
| `login.astro:102` | Card 组件未闭合 | ✅ Rust 编译器发现 |
| `admin/index.astro` | 重复 Layout 标签 | ✅ Rust 编译器发现 |
| `edit-business-page/[id].astro` | 重复 Layout 标签 | ✅ Rust 编译器发现 |

### 测试结果

| 测试类型 | 结果 |
|----------|------|
| `pnpm build` | ✅ 10s |
| `/business/[slug]` | ✅ HTTP 200 |
| `/business/[slug]/product/[id]` | ✅ HTTP 200 |

### UI 更新

| 组件 | 变更 |
|------|------|
| WhatsApp 按钮 | 品牌色 `#25D366` |
| Header | 紧凑化，about 显示完整 |
| SKU 卡片 | grid-cols-4, square, gap-3 |
| 产品详情图 | max-w-2xl, 4:3 比例 |
| Thumbnail | 可滚动 + 左右箭头 |
| Inquire 按钮 | "Ask for Price" |
| Icons | 全部改用 @lucide/astro |
| Location | 静态地图图片 (Yandex/OSM fallback) |

---

## 2026-03-22

| 依赖 | 旧版本 | 新版本 | 升级原因 | Breaking Changes | 验证结果 |
|------|--------|--------|---------|-----------------|---------|
| — | — | — | 初始化项目基准 | — | ✅ |
