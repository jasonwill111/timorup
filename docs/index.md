---
project_name: timorlist
documentation_date: 2026-02-26
scan_level: exhaustive
---

# TimorBiz 项目文档索引

## 项目概述

- **项目名称**: TimorBiz (东帝汶商业目录平台)
- **项目类型**: Web 应用 (Astro SSR)
- **架构**: Monolithic (单体应用)
- **部署平台**: Cloudflare Workers (SSR) | 未来支持: 静态 + SSR 混合模式

## 技术栈

| 组件 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Astro | 6.x |
| UI 组件 | 纯 Astro | - |
| 数据库 | D1 (SQLite) | - |
| ORM | Drizzle ORM | 0.45.x |
| 认证 | Better Auth | 1.5.x |
| 样式 | Tailwind CSS | 4.x |
| 富文本编辑器 | TipTap | 3.x |
| 验证 | Zod | 4.x |
| 媒体存储 | Cloudflare R2 | - |
| 地图 | Leaflet + OpenStreetMap | - |
| 包管理器 | pnpm | 9.15.x |

## 快速参考

- **入口点**: `src/pages/index.astro`
- **API 入口**: `src/pages/api/`
- **数据库 Schema**: `src/db/schema/`
- **主要组件**: `src/components/`
- **样式**: `src/styles/globals.css`

## 目录结构

```
timorlist/
├── src/
│   ├── components/           # UI 组件
│   │   ├── ui/              # Astro UI 组件
│   │   ├── business/        # 商业相关组件
│   │   └── reviews/         # 评论组件
│   ├── layouts/             # Astro 布局
│   ├── lib/                 # 工具函数
│   ├── pages/               # 页面和 API
│   │   └── api/             # Astro API 端点
│   ├── db/                  # 数据库
│   │   └── schema/          # 表定义
│   └── styles/              # 样式
├── docs/                    # 文档
├── public/                  # 静态资源
└── package.json
```

## API 路由

| 路由 | 文件 | 描述 |
|------|------|------|
| `/api/auth/*` | `src/pages/api/auth/` | 认证 |
| `/api/account/*` | `src/pages/api/account/` | 用户账户 (profile, businesses, subscription) |
| `/api/businesses/*` | `src/pages/api/businesses/` | 商家管理 |
| `/api/products/*` | `src/pages/api/products/` | 产品管理 |
| `/api/reviews/*` | `src/pages/api/reviews/` | 评论管理 |
| `/api/media/*` | `src/pages/api/media/` | 媒体上传 |
| `/api/categories/*` | `src/pages/api/categories/` | 分类 |
| `/api/orders/*` | `src/pages/api/orders/` | 订单 |
| `/api/admin/listing` | `src/pages/api/admin/listing/` | Admin Listing 管理 |
| `/api/admin/skus` | `src/pages/api/admin/skus/` | Admin SKU 管理 |
| `/api/admin/blogs` | `src/pages/api/admin/blogs/` | Admin Blog 管理 |
| `/api/admin/ai-generate` | `src/pages/api/admin/ai-generate.ts` | AI 内容生成 |
| `/api/admin/settings` | `src/pages/api/admin/settings/` | Admin Settings |
| `/api/blogs/*` | `src/pages/api/blogs/` | 博客 CRUD |
| `/api/banners/*` | `src/pages/api/banners/` | 横幅管理 |

## 实体类型

| 类型 | 路由 | 特点 |
|------|------|------|
| `business` | `/business/[slug]` | 产品、评论、评分、行业分类 |
| `government` | `/govs/[slug]` | 简化页面（信息+联系方式） |
| `nonprofit` | `/ngos/[slug]` | 简化页面（信息+联系方式） |
| `organization` | `/organization/[slug]` | 政府/NGO/Nonprofit 统一入口 |

## 导航结构

| 导航项 | 路由 | 描述 |
|--------|------|------|
| Directory | `/listing` | 统一目录页，含 Businesses/Govs/NGOs 三个标签页 |
| Products & Services | `/products-services` | 所有 SKU 的汇总展示页面 |
| Pricing | `/pricing` | 定价页面 |
| + Create | `/listing/create` | 创建 listing（Business 需订阅，Gov/NGO 免费） |

## 订阅流程

```
用户选套餐 (/pricing) → /subscribe?plan=xxx → 创建订单 → 线下支付 → Admin 确认 → 订阅生效

订阅过期 → /account 页面显示 "Expired" → 用户选择新套餐 → 创建新订单 → 重复上述流程
```

### 套餐 SKU 限制

| 套餐 | SKU 限额 | 价格 |
|------|----------|------|
| Basic | 10 | $29/月 或 $290/年 |
| Pro | 30 | $59/月 或 $590/年 |
| Max | 60 | $89/月 或 $890/年 |

### 订阅 API

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/admin/orders` | GET | 列出所有订单 |
| `/api/admin/orders/[id]` | GET | 获取订单详情 |
| `/api/admin/orders/[id]` | PUT | 更新订单（套餐/金额/状态/期限/备注） |
| `/api/admin/orders/[id]` | DELETE | 删除订单 |
| `/api/orders` | POST | 创建订单 |
| `/api/account/subscription/[uid]` | GET | 获取用户订阅信息 |

### SKU 管理 API

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/products` | GET | 列出产品 |
| `/api/products` | POST | 创建产品（带 SKU 限制检查） |
| `/api/products/[businessPageId]/sku-usage` | GET | 获取 SKU 使用情况 |

## 生成的文档

### 核心文档

- [产品需求文档 (PRD)](./PRD.md)
- [架构文档](./ARCHITECTURE.md)
- [项目上下文](./project-context.md)
- [史诗列表](./EPICS.md)
- [用户故事](./STORIES.md)
- [PRD 合规审计报告](./GAP_ANALYSIS.md)

### BMAD 工作流产出

- [UX 设计规范](../_bmad-output/planning-artifacts/ux-design-specification.md)
- [实施就绪报告](../_bmad-output/planning-artifacts/implementation-readiness-report-2026-02-26.md)

## 开始使用

### 开发环境

```bash
# 安装依赖
pnpm install

# 启动前端开发服务器（使用 Rust 编译器）
pnpm dev

# 构建（使用 Rust 编译器）
pnpm build
```

### 测试命令

| 命令 | 工具 | 用途 |
|------|------|------|
| `pnpm test` | Vitest | 单元/集成测试 |
| `pnpm test:e2e` | Playwright | E2E 自动化 |
| `pnpm test:quick` | playwright-cli | 快速页面检查 |
| `pnpm test:kuri` | kuri | 截图对比 |
| `pnpm test:agent` | browser-use | AI agent 流程测试 |
| `pnpm test:all` | 组合 | 完整测试套件 |

### 环境变量

参考 `src/env.ts` 或 `docs/project-context.md` 中的环境变量配置。

## 页面路由

| 页面 | 路由 | SSR |
|------|------|-----|
| 首页 | `/` | ✅ |
| Local Directory | `/listing` | ✅ |
| Create Listing | `/listing/create` | ✅ |
| Products & Services | `/products-services` | ✅ |
| 商家详情 | `/business/[slug]` | ✅ |
| SKU 详情 | `/business/[slug]/product/[id]` | ✅ |
| Govs 详情 | `/govs/[slug]` | ✅ |
| NGOs 详情 | `/ngos/[slug]` | ✅ |
| Organizations | `/organization/[slug]` | ✅ |
| 用户账户 | `/account` | - |
| 管理后台 | `/admin` | - |
| Admin Dashboard | `/admin` | ✅ |
| Admin Listings | `/admin/listing` | ✅ |
| Admin AI Tools | `/admin/ai-tools` | ✅ |
| Admin SKUs | `/admin/skus` | ✅ |
| Admin Blog Posts | `/admin/blogs` | ✅ |
| Admin Settings | `/admin/settings` | ✅ |
| 登录 | `/login` | - |
| 注册 | `/register` | - |
| FAQ | `/faq` | - |

## Admin 管理后台

### 页面列表

| 页面 | 功能 |
|------|------|
| `/admin` | Dashboard，统计数据概览 |
| `/admin/listing` | 统一管理 business/gov/nonprofit，支持类型/状态筛选 |
| `/admin/ai-tools` | AI 生成内容（Listing/SKU/Blog/Landing） |
| `/admin/skus` | 产品/服务管理，灵活定价 |
| `/admin/blogs` | 博客文章 CRUD，TipTap 富文本编辑 |
| `/admin/settings` | 站点设置（站点名称、联系方式、支付二维码） |

### AI Tools 功能

| Tab | Generator | API |
|-----|-----------|-----|
| Listing Generator | business/gov/nonprofit | `POST /api/admin/ai-generate` |
| Product/SKU Generator | product/service/rental/food/accommodation/project | `POST /api/admin/ai-generate` |
| Blog Article Generator | local-highlight/how-to/tips/news/event | `POST /api/admin/ai-generate` |
| Landing Page Generator | promotion/event | `POST /api/admin/ai-generate` |

### Admin API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/admin/listing` | GET | 获取所有 listings |
| `/api/admin/skus` | GET | 获取所有 SKUs |
| `/api/admin/blogs` | GET | 获取所有博客文章 |
| `/api/admin/ai-generate` | POST | AI 生成内容 |
| `/api/admin/settings` | GET/POST | 站点设置 |

## 数据库表

| 表名 | 描述 |
|------|------|
| users | 用户 |
| sessions | 会话 |
| accounts | OAuth 账户 |
| business_pages | 商家页面（含 entityType: business/government/nonprofit） |
| products | 产品/SKU（含 serviceType: product/service/rental/food/accommodation/project） |
| reviews | 评论 |
| categories | 分类 |
| orders | 订单 |
| media | 媒体文件 |
| ad_banners | 广告横幅 |
| site_settings | 站点设置 |
| blog_posts | 博客文章 |

## 品牌颜色

- **主色 (黄色)**: #FFD150
- **浅色背景**: #FDFBF7
- **深色背景**: #0A0F1A

---

**文档版本**: 16.0
**最后更新**: 2026-04-28
**扫描级别**: Exhaustive (全面扫描)
**开发状态**: ✅ Admin 管理后台 | AI Tools | Organization 支持 | Admin API 重构 | SKUs 页面修复 | UI/UX 优化 | Polish

## Homepage Featured Sections

| Section | Cards | Query |
|---------|-------|-------|
| Featured Businesses | 12 | status='live', ordered by likes DESC |
| Featured Products & Services | 12 | products from live businesses, ordered by createdAt DESC |

### ProductCard Component

`src/components/business/ProductCard.astro`

- Thumbnail with gradient background (color by service type)
- Price badge overlay
- Title + business name
- Service type color coding (product/service/rental/food/accommodation/project)

## Business 详情页增强功能

| 功能 | 字段 | 说明 |
|------|------|------|
| 统计数据 | views, likes, saves | Icon下方显示数字 |
| 社交链接 | socialLinks | {facebook, instagram, tiktok} |
| 相册 | photoGallery | 3x2网格 + Lightbox弹窗 |
| 最新动态 | latestUpdate | Products上方, 每周更新限制 |
| 成立年份 | yearOfEstablishment | Est. YYYY 显示 |

### Gallery Lightbox

- 点击图片 → 全屏弹窗
- ← → 箭头/键盘切换
- ESC/点击空白关闭

## UI/UX 设计规范

### 交互设计

| 规范 | 描述 |
|------|------|
| `cursor-pointer` | 所有可点击卡片、按钮添加 |
| `focus-visible` | 所有键盘可聚焦元素添加 `focus-visible:ring-2 focus-visible:ring-ring` |
| `transition-colors` | 按钮/链接 hover 效果 |
| `transition-all duration-200` | 卡片 hover 效果 |

### 无障碍

| 规范 | 描述 |
|------|------|
| `prefers-reduced-motion` | 全局 CSS 媒体查询禁用动画 |
| 颜色对比 | 文本 ≥ 4.5:1 对比度 |
| Focus 可见 | 键盘导航时显示 focus ring |

### Icons

| 类型 | 来源 | 用途 |
|------|------|------|
| Lucide SVG | 内联 SVG paths | Category icons, Toast icons, Stars |
| Lucide SVG | `@lucide/astro` | Header, Footer, Components |

### 骨架屏

| 组件 | 文件 |
|------|------|
| BusinessCardSkeleton | `src/components/ui/Skeleton.astro` |
| ProductCardSkeleton | `src/components/ui/Skeleton.astro` |
| CategorySkeleton | `src/components/ui/Skeleton.astro` |
