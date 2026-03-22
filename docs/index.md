---
project_name: timorbiz
documentation_date: 2026-02-26
scan_level: exhaustive
---

# TimorBiz 项目文档索引

## 项目概述

- **项目名称**: TimorBiz (东帝汶商业目录平台)
- **项目类型**: Web 应用 (Astro + React + Hono)
- **架构**: Monolithic (单体应用)
- **部署平台**: Cloudflare Pages + Workers

## 技术栈

| 组件 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Astro | 6.x |
| UI 框架 | React | 19.x |
| API 框架 | Hono | 4.x |
| 数据库 | D1 (SQLite) | - |
| ORM | Drizzle ORM | 0.45.x |
| 认证 | Better Auth | 1.5.x |
| UI 组件 | shadcn/ui | latest |
| 样式 | Tailwind CSS | 4.x |
| 富文本编辑器 | TipTap | 3.x |
| 验证 | Zod | 3.24.x |
| 媒体存储 | Cloudflare R2 | - |
| 地图 | Leaflet + OpenStreetMap | - |
| 包管理器 | pnpm | 9.15.x |

## 快速参考

- **入口点**: `src/pages/index.astro`
- **API 入口**: `src/server/index.ts`
- **数据库 Schema**: `src/db/schema/`
- **主要组件**: `src/components/`
- **样式**: `src/styles/globals.css`

## 目录结构

```
timorbiz/
├── src/
│   ├── components/           # UI 组件
│   │   ├── ui/              # shadcn/ui 基础组件
│   │   ├── business/        # 商业相关组件
│   │   └── reviews/         # 评论组件
│   ├── layouts/             # Astro 布局
│   ├── pages/               # 页面路由
│   ├── lib/                 # 工具函数
│   ├── server/              # Hono API
│   │   └── routes/          # API 路由
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
| `/api/auth/*` | `src/server/routes/auth.ts` | 认证 |
| `/api/businesses/*` | `src/server/routes/businesses.ts` | 商家管理 |
| `/api/products/*` | `src/server/routes/products.ts` | 产品管理 |
| `/api/reviews/*` | `src/server/routes/reviews.ts` | 评论管理 |
| `/api/media/*` | `src/server/routes/media.ts` | 媒体上传 |
| `/api/categories/*` | `src/server/routes/categories.ts` | 分类 |
| `/api/orders/*` | `src/server/routes/orders.ts` | 订单 |
| `/api/admin/*` | `src/server/routes/admin.ts` | 管理后台 |
| `/api/blogs/*` | `src/server/routes/blogs.ts` | 博客 CRUD |
| `/api/cron/*` | `src/server/routes/cron.ts` | 定时任务 |

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

# 启动前端开发服务器
pnpm dev

# 启动 API 开发服务器
pnpm dev:api

# 运行测试
pnpm test

# 构建
pnpm build
```

### 环境变量

参考 `src/env.ts` 或 `docs/project-context.md` 中的环境变量配置。

## 页面路由

| 页面 | 路由 |
|------|------|
| 首页 | `/` |
| 商家目录 | `/businesses` |
| 商家详情 | `/business/[slug]` |
| 产品详情 | `/business/[slug]/product/[id]` |
| 创建产品 | `/business/[slug]/product/new` |
| 编辑产品 | `/business/[slug]/product/[id]/edit` |
| 用户账户 | `/account` |
| 管理后台 | `/admin` |
| Admin 商家管理 | `/admin/businesses` |
| Admin 博客管理 | `/admin/blogs` |
| 创建商家 | `/business/create` |
| 登录 | `/login` |
| 注册 | `/register` |
| 定价 | `/pricing` |
| 订阅 | `/subscribe` |

## 数据库表

| 表名 | 描述 |
|------|------|
| users | 用户 |
| sessions | 会话 |
| accounts | OAuth 账户 |
| business_pages | 商家页面 |
| products | 产品 |
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

**文档版本**: 3.0
**最后更新**: 2026-03-22
**扫描级别**: Exhaustive (全面扫描)
**开发状态**: ⚠️ 55/57 Stories 完成 (2 个缺口) | 12 个 Epic 全部完成 | 剩余 12 个功能缺口待修复（详见 GAP_ANALYSIS.md）
