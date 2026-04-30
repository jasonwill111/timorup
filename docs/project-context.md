---
project_name: timorlist
user_name: Nick
date: 2026-04-30
sections_completed: ['technology_stack', 'implementation_rules', 'ui_requirements', 'development_workflow', 'ux_patterns', 'component_strategy', 'responsive_design', 'testing', 'deployment', 'performance_optimization']
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## 1. Technology Stack & Versions

### Core Technologies

| Component | Technology | Version | Notes |
|-----------|------------|---------|-------|
| **Frontend** | Astro | 6.1.10 | SSR mode, pure .astro |
| **API Framework** | Astro API Routes | - | src/pages/api/* |
| **Database** | D1 (SQLite) | - | Cloudflare D1 |
| **ORM** | Drizzle ORM | 0.45.2 | Type-safe |
| **Authentication** | Better Auth | 1.6.9 | OAuth support, cache enabled |
| **UI Components** | Pure Astro + TailwindCSS | - | No React/shadcn |
| **Styling** | Tailwind CSS | 4.2.4 | @theme config |
| **Rich Text Editor** | TipTap | 3.22.5 | Notion-like editing |
| **Validation** | Zod | 4.4.1 | Schema validation, z.file() |
| **Media Storage** | Cloudflare R2 | - | S3-compatible |
| **Maps** | Leaflet + OpenStreetMap | - | Free, open source |
| **AI** | Mastra | 1.29.1 | AI agent framework |
| **Cloudflare** | Wrangler | 4.86.0 | Workers deployment |
| **AWS SDK** | @aws-sdk/* | 3.1039.0 | R2 operations |
| **Package Manager** | pnpm | 9.15.0 | REQUIRED |
| **Language** | TypeScript | 6.0.3 | .ts files only |

---

## 2. Critical Implementation Rules

### 2.1 Package Manager & TypeScript

- **ALWAYS use pnpm** - Never use npm or yarn
- **Use .ts files only** - No .tsx for configuration files
- All configuration files must be TypeScript

### 2.2 Project Structure

```
timorlist/
├── src/
│   ├── components/     # UI components (pure Astro + TailwindCSS)
│   ├── layouts/       # Astro layouts
│   ├── pages/         # Astro pages + API routes (src/pages/api/*)
│   ├── lib/           # Utilities (auth, db, email, media)
│   ├── db/            # Drizzle schema
│   │   └── schema/    # Table definitions
│   └── styles/        # Global styles (TailwindCSS v4 @theme)
├── public/            # Static assets
├── wrangler.toml
├── astro.config.mjs
└── package.json
```

### 2.3 Development Mode

- **Development**: No caching, real-time updates
- **Production**: Caching enabled, performance optimized

---

## 3. UI/UX Requirements

### 3.1 Layout & Container

- **Content container**: Centered with Tailwind container
- **Max width**: `max-w-6xl` for all content
- **Responsive breakpoints**:
  - Mobile: `grid-cols-1`
  - Tablet: `grid-cols-2`
  - Desktop: `grid-cols-4`

### 3.2 Color Scheme (Light/Dark Mode) - YELLOW THEME

#### Brand Colors (Yellow)
```
brand-50:  #fffbeb
brand-100:  #fef3c7
brand-200:  #fde68a
brand-300:  #fcd34d
brand-400:  #fbbf24
brand-500:  #FFD150 (MAIN YELLOW - primary brand color)
brand-600:  #e6b847
brand-700:  #cc9f3d
brand-800:  #b38733
brand-900:  #996e29
brand-950:  #4d3715
```

#### Light Mode
- Background: Cream/Off-white (`#FDFBF7`)
- Card background: White (`#ffffff`)
- Text: Dark gray (`#1a1a1a`)
- Primary: Yellow (`#FFD150`)

#### Dark Mode
- Background: Dark blue-black (`#0A0F1A`)
- Card background: Dark (`#151C28`)
- Text: Light gray (`#f1f5f9`)
- Primary: Bright yellow (`#FFD150`)

### 3.3 Navigation

- **Desktop**: Horizontal nav menu in header
- **Mobile**: Hamburger menu icon on RIGHT side of header
- **Mobile menu**: Slide-out or dropdown from right
- **Theme toggle**: Moon/Sun icon on LEFT side of mobile header

### 3.4 Typography

- **Local fonts**: Oswald for headings, Inter for body
- **Font files** in `public/fonts/`

### 3.5 Section Spacing (IMPORTANT)

All sections should have vertical margins EXCEPT:
- **Top notification bar**: `mb-0 mt-0`
- **Footer**: `mb-0`

All other sections:
```html
<section class="mb-6 mt-6">...</section>
```

### 3.6 Responsive Layout - Card Grid

| Breakpoint | Width | Cards Per Row |
|------------|-------|---------------|
| Mobile (sm) | < 640px | **2 columns** |
| Tablet (md) | 640-767px | **2 columns** |
| Desktop (lg) | 768-1023px | 3 columns |
| XL Desktop (xl) | ≥ 1024px | 4 columns |

**Business listing and Product listing both use 2 columns on mobile.**

### 3.7 Astro UI Components

**Pure Astro + TailwindCSS** — No React, No shadcn/ui.

**Core components** (`src/components/ui/`):
- Button, Input, Select, Textarea
- Card, Badge, Label, Skeleton
- Avatar, Accordion, Tabs
- Dialog (native `<dialog>`), Toast (Sonner)

**Custom components** (`src/components/`):
- BusinessCard, ProductCard
- WhatsAppButton, CategoryPill
- RichTextEditor (TipTap)

### 3.8 UI Consistency Patterns

**Button Hierarchy:**
| Type | Style | Usage |
|------|-------|-------|
| Primary | Yellow bg (#FFD150), black text | Main CTAs |
| Secondary | White bg + gray border | Secondary actions |
| WhatsApp | Green bg (#00C853), white | Direct contact |

**Form Patterns:**
- Input: 8px radius, gray border
- Label: Bold, small text above
- Error: Red border + error message below
- Required: Asterisk mark

**Card Design:**
- Border radius: 12px
- Shadow: Subtle (default Tailwind)
- Padding: 16px internal

**Feedback:**
- Success: Green (#4CAF50) checkmark icon + Toast
- Error: Red border on input + message
- Loading: Skeleton component

---

## 4. Page Routes

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with featured businesses |
| Businesses | `/businesses` | Business directory with search/filter |
| Business Detail | `/business/[slug]` | Single business page |
| Product Detail | `/business/[slug]/product/[id]` | Product/service detail |
| Create Product | `/business/[slug]/product/new` | Create new product |
| Edit Product | `/business/[slug]/product/[id]/edit` | Edit product |
| Account | `/account` | User dashboard (frontend) |
| Admin | `/admin` | CMS backend (admin only) |
| Create Business | `/create-business-page` | Create new business |
| Edit Business | `/edit-business-page/[id]` | Edit business |
| Login | `/login` | User login |
| Register | `/register` | User registration |
| Search | `/search` | Search results |
| Pricing | `/pricing` | Subscription plans |
| Subscribe | `/subscribe` | Subscribe page |
| Forgot Password | `/forgot-password` | Password recovery |
| Reset Password | `/reset-password` | Reset password |
| Verify Email | `/verify` | Email verification |

---

## 5. User Roles & Permissions

| Role | Access |
|------|--------|
| User | Frontend only, can create 1 business page, access `/account` |
| Editor | Backend access via `/admin`, no delete permissions |
| Admin | Full access via `/admin` |

### Account vs Admin

- **`/account`**: Frontend user dashboard for managing their own:
  - Profile information
  - Subscription status
  - Business page (create/edit)
  - Products/SKUs
  - Media

- **`/admin`**: CMS backend for admins to manage:
  - All users
  - All business pages
  - All orders/subscriptions
  - All products
  - Posts (blog/news)
  - Site settings
  - Ad banners

---

## 6. Business Logic

### 6.1 Subscription Plans

| Plan | Price | SKU Limit |
|------|-------|-----------|
| Monthly | $39/month | 10 |
| Yearly | $390/year | 10 |
| Mid-tier (future) | $69/month or $690/year | 30 |
| Premium (future) | $99/month or $990/year | 60 |

### 6.2 Payment Flow

- **Offline payment only**: QR code, cash, bank transfer
- **WhatsApp confirmation**: User contacts admin
- **Manual activation**: Admin confirms in backend

### 6.3 Trial Period

- 3 days free trial after publishing
- Trial ends → Show basic info only
- After 30 days expired → Auto-delete

### 6.4 Media Quotas

| Type | Limit |
|------|-------|
| Business images | 12 max |
| Product images | 4 per product |
| Videos | 6 max |

### 6.5 Categories

12一级分类，每个3-5个二级分类（见 PRD）

---

## 7. TipTap Rich Text Editor

TipTap 3.x 用于:
- **前端用户**: 创建/编辑商业页面内容（About Us, Latest Updates）
- **Admin/Editor**: 创建 Posts (博客/新闻), 管理内容

特点:
- Notion-like 块编辑体验
- 支持富文本（标题、列表、链接、图片等）
- 移动端友好
- 框架无关 (vanilla JS 集成)

---

## 8. Environment Variables

Required in `.env`:
```
# Cloudflare (will be provided later)
CF_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Auth
BETTER_AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# App
APP_URL=http://localhost:8788
```

---

## 9. Testing

### Unit Tests (Vitest)
- Location: `src/lib/*.test.ts`
- Run: `pnpm test`
- Coverage: Utils, Media, Database Schema

### E2E Tests (Playwright)
- Location: `e2e/*.spec.ts`
- Run: `pnpm test:e2e`
- Coverage: All pages, API endpoints, Business flows

### Test Files
| File | Tests |
|------|-------|
| `e2e/business-flow.spec.ts` | 10 (Complete business flow) |
| `e2e/all-pages.spec.ts` | 104 (All pages) |
| `e2e/api.spec.ts` | 30+ (API endpoints) |
| `src/lib/media.test.ts` | 28 (Media utils) |
| `src/lib/utils.test.ts` | 7 (Utility functions) |

---

## 10. Related Documents

- **UX Design Specification**: `_bmad-output/planning-artifacts/ux-design-specification.md`
- **Architecture**: `_bmad-output/planning-artifacts/architecture.md`
- **Epics**: `_bmad-output/planning-artifacts/epics.md`
- **PRD**: `_bmad-output/planning-artifacts/prd.md`

---

**Last Updated**: 2026-04-30
**Development Status**: ✅ SSR + Hybrid Mode 已实现 | TipTap 编辑器 | 产品详情页 | WhatsApp 品牌色 | 紧凑 UI 布局 | 本地 D1/R2 访问

---

## 11. Local Development (2026-04-30)

### 11.1 本地开发命令

```bash
# 1. 初始化本地数据库（如首次）
npx drizzle-kit push

# 2. 启动 workerd 开发服务器（支持 D1/R2）
npx wrangler dev dist/server/entry.mjs --local --persist-to=.wrangler/state

# 3. 访问
# http://localhost:8787/
# http://localhost:8787/__wrangler_local_explorer__  # D1/KV/R2 GUI
```

### 11.2 为什么不用 `astro dev`

- `astro dev` 使用 Node adapter
- Node 不支持 `cloudflare:workers` 模块
- 需要 `wrangler dev` + workerd 运行时

### 11.3 构建

```bash
# 构建 SSR + 静态页面
pnpm build

# 构建产物
# dist/client/  → 静态资源
# dist/server/  → SSR entry + chunks
```
