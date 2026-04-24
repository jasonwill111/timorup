# TMBIZ - 架构设计文档

## 1. 系统架构总览

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Cloudflare                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐              │
│   │ Astro Pages │     │ Astro API  │     │   D1 DB     │              │
│   │  (前端 SSR) │ ←→  │ (Workers)  │ ←→  │  (SQLite)   │              │
│   └─────────────┘     └─────────────┘     └─────────────┘              │
│         ↓                     ↓                   ↓                       │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │                    Cloudflare CDN                            │      │
│   └─────────────────────────────────────────────────────────────┘      │
│                                    ↓                                    │
│   ┌─────────────┐                                   ┌─────────────┐   │
│   │  R2 Storage │ ←───────── 媒体上传 ───────────→  │  Workers    │   │
│   │ (媒体文件)  │                                   │  Cron       │   │
│   └─────────────┘                                   └─────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 技术架构分层

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  (Astro Pages + Pure Astro + TailwindCSS)                   │
├─────────────────────────────────────────────────────────────┤
│                    API Layer                                │
│  (Astro API Routes - src/pages/api/*)                     │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                     │
│  (Services / Hooks)                                        │
├─────────────────────────────────────────────────────────────┤
│                    Data Access Layer                        │
│  (Drizzle ORM + D1)                                       │
├─────────────────────────────────────────────────────────────┤
│                    Infrastructure                           │
│  (Cloudflare D1, R2, Workers, CDN)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. 目录结构

```
timorbiz/
├── src/
│   ├── components/
│   │   ├── ui/                    # Astro UI 组件
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── label.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── separator.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx          # 网站头部
│   │   │   ├── Footer.tsx          # 网站底部
│   │   │   ├── MobileNav.tsx       # 移动端导航
│   │   │   └── ThemeToggle.tsx     # 主题切换
│   │   ├── business/
│   │   │   ├── BusinessCard.tsx    # 商家卡片
│   │   │   ├── BusinessForm.tsx    # 商家表单
│   │   │   ├── BusinessDetails.tsx # 商家详情
│   │   │   ├── ProductCard.tsx     # 产品卡片
│   │   │   ├── ProductForm.tsx     # 产品表单
│   │   │   ├── MediaGallery.tsx    # 媒体画廊
│   │   │   ├── Map.tsx             # 地图组件
│   │   │   └── ...
│   │   ├── reviews/
│   │   │   ├── ReviewCard.tsx      # 评论卡片
│   │   │   ├── ReviewForm.tsx      # 评分表单
│   │   │   └── Rating.tsx          # 评分组件
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx       # 登录表单
│   │   │   ├── RegisterForm.tsx    # 注册表单
│   │   │   └── OAuthButton.tsx     # OAuth 按钮
│   │   └── editor/
│   │       ├── RichTextEditor.tsx   # TipTap 富文本编辑器（替换 Lexical）
│   │       └── plugins/            # 编辑器插件
│   │
│   ├── layouts/
│   │   ├── Layout.astro            # 基础布局
│   │   ├── AuthLayout.astro       # 认证页面布局
│   │   └── AdminLayout.astro      # 管理后台布局
│   │
│   ├── pages/
│   │   ├── index.astro             # 首页
│   │   ├── businesses/
│   │   │   ├── index.astro         # 商家目录
│   │   │   └── [slug].astro       # 商家详情
│   │   ├── account/
│   │   │   └── index.astro         # 用户账户
│   │   ├── admin/
│   │   │   ├── index.astro        # 管理后台首页
│   │   │   ├── users.astro        # 用户管理
│   │   │   ├── businesses.astro   # 商家管理
│   │   │   ├── products.astro     # 产品管理
│   │   │   ├── orders.astro      # 订单管理
│   │   │   ├── blogs.astro       # 博客管理（Admin CRUD）
│   │   │   └── settings.astro    # 站点设置
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── auth.ts                 # Better Auth 配置
│   │   ├── db.ts                   # Drizzle DB 实例
│   │   ├── r2.ts                   # R2 客户端
│   │   ├── map.ts                  # 地图工具
│   │   └── utils.ts                # 通用工具
│   │
│   ├── pages/api/
│   │   ├── admin/                   # Admin API routes
│   │   │   ├── auth/login.ts        # 登录
│   │   │   ├── businesses/index.ts   # 商家管理
│   │   │   ├── categories/index.ts  # 分类管理
│   │   │   ├── orders/index.ts      # 订单管理
│   │   │   ├── settings/index.ts    # 设置管理
│   │   │   ├── stats.ts             # 统计数据
│   │   │   └── users/index.ts      # 用户管理
│   │   ├── auth/[...all].ts         # Better Auth
│   │   ├── businesses/[slug].ts     # 商家 CRUD
│   │   ├── businesses/index.ts      # 商家列表
│   │   ├── products/index.ts        # 产品管理
│   │   ├── reviews/index.ts         # 评论管理
│   │   ├── media/index.ts           # 媒体上传
│   │   └── banners/index.ts         # 广告管理
│   │
│   ├── db/
│   │   ├── schema/
│   │   │   ├── index.ts             # Schema 导出
│   │   │   ├── users.ts             # 用户表
│   │   │   ├── sessions.ts          # 会话表
│   │   │   ├── accounts.ts          # OAuth 账户表
│   │   │   ├── media.ts             # 媒体表
│   │   │   ├── categories.ts        # 分类表
│   │   │   ├── business-pages.ts   # 商家表
│   │   │   ├── products.ts          # 产品表
│   │   │   ├── reviews.ts           # 评论表
│   │   │   ├── orders.ts            # 订单表
│   │   │   ├── ad-banners.ts        # 广告表
│   │   │   └── site-settings.ts     # 设置表
│   │   └── migrations/             # 数据库迁移
│   │
│   ├── hooks/
│   │   ├── useAuth.ts               # 认证 Hook
│   │   ├── useBusiness.ts           # 商家 Hook
│   │   ├── useProducts.ts           # 产品 Hook
│   │   └── ...
│   │
│   ├── stores/                      # 状态管理
│   │   └── ...
│   │
│   ├── styles/
│   │   └── globals.css              # 全局样式
│   │
│   └── utils/
│       ├── validation.ts            # Zod 验证
│       ├── constants.ts             # 常量定义
│       └── helpers.ts               # 辅助函数
│
├── public/
│   ├── fonts/                       # 本地字体
│   ├── images/                      # 静态图片
│   └── favicon.svg
│
├── wrangler.jsonc                    # Cloudflare 配置
├── astro.config.mjs
├── drizzle.config.ts
└── package.json
```

---

## 4. API 设计

### 4.1 API 路由结构

```
/api
├── /auth
│   ├── POST   /sign-in              # 登录
│   ├── POST   /sign-up              # 注册
│   ├── POST   /sign-out             # 登出
│   ├── GET    /session              # 获取当前会话
│   ├── POST   /forgot-password      # 忘记密码
│   ├── POST   /reset-password       # 重置密码
│   └── GET    /verify/:token       # 验证邮箱
│
├── /businesses
│   ├── GET    /                     # 获取商家列表
│   ├── GET    /:slug                # 获取商家详情
│   ├── POST   /                     # 创建商家
│   ├── PUT    /:id                  # 更新商家
│   ├── DELETE /:id                  # 删除商家
│   ├── POST   /:id/like             # 点赞
│   ├── POST   /:id/save             # 收藏
│   └── GET    /featured             # 获取精选商家
│
├── /products
│   ├── GET    /                     # 获取产品列表
│   ├── GET    /:id                  # 获取产品详情
│   ├── POST   /                     # 创建产品
│   ├── PUT    /:id                  # 更新产品
│   └── DELETE /:id                  # 删除产品
│
├── /reviews
│   ├── GET    /?businessPageId=     # 获取评论列表
│   ├── POST   /                     # 创建评论
│   ├── PUT    /:id                  # 更新评论
│   └── DELETE /:id                  # 删除评论
│
├── /media
│   ├── GET    /                     # 获取媒体列表
│   ├── POST   /upload               # 上传媒体
│   └── DELETE /:id                  # 删除媒体
│
├── /categories
│   ├── GET    /                     # 获取分类列表
│   └── ...
│
├── /orders
│   ├── GET    /                     # 获取订单列表
│   ├── GET    /:id                  # 获取订单详情
│   ├── POST   /                     # 创建订单
│   └── PUT    /:id/status           # 更新订单状态 (管理员)
│
└── /settings
    ├── GET    /                     # 获取站点设置
    └── PUT    /                     # 更新站点设置 (管理员)
```

### 4.2 API 响应格式

**成功响应：**
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

**错误响应：**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "错误描述",
    "details": { ... }
  }
}
```

### 4.3 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 5. 数据流

### 5.1 用户注册流程

```
用户 → RegisterForm → /api/auth/sign-up → Better Auth → D1 (users)
                                              ↓
                                    发送验证邮件
```

### 5.2 创建商业页面流程

```
用户 → BusinessForm → 验证 → /api/businesses → D1 (business_pages)
                                    ↓
                              媒体上传 → R2 → D1 (media)
```

### 5.3 订阅流程

```
用户 → 选择套餐 → /api/orders → 创建订单 → 显示支付信息
                                          ↓
                              用户通过 WhatsApp 联系管理员
                                          ↓
                              管理员确认支付 → /api/orders/:id/status
                                          ↓
                              更新订单状态 → 发送确认邮件
```

---

## 6. 认证流程

### 6.1 Better Auth 配置

```typescript
// 认证. 用户注册/流程
1登录 → Better Auth → 创建 Session
2. Session 存储在 D1 (sessions 表)
3. 客户端使用 Cookie 存储 Session Token
4. 每个请求通过 Middleware 验证 Session
```

### 6.2 权限检查

```typescript
// 中间件层级
Request → Auth Middleware → Role Middleware → Handler
                ↓                    ↓
         检查 Session          检查用户角色
```

---

## 7. 媒体处理

### 7.1 上传流程

```
用户选择文件 → 前端验证 (类型/大小) 
    ↓
POST /api/media/upload → 服务器验证
    ↓
上传到 R2 → 返回 URL
    ↓
保存到 D1 (media 表)
```

### 7.2 R2 存储结构

```
r2://timorbiz-media/
├── users/
│   └── {user-id}/
│       └── {filename}
├── businesses/
│   └── {business-id}/
│       ├── banner/
│       ├── profile/
│       ├── gallery/
│       └── updates/
├── products/
│   └── {product-id}/
│       └── {filename}
└── banners/
    └── {banner-id}/
        └── {filename}
```

---

## 8. 定时任务 (Cloudflare Workers Cron)

### 8.1 清理过期页面

```yaml
# wrangler.jsonc
[[triggers]] # wrangler.jsonc
crons = ["0 0 * * *"]  # 每天 UTC 0 点

# 任务内容
1. 查询 status = 'expired' 且 updatedAt > 30天前
2. 删除关联的媒体文件 (R2)
3. 删除 business_page 记录
4. 删除关联的 products, reviews
```

### 8.2 发送过期提醒

```yaml
[[triggers]] # wrangler.jsonc
crons = ["0 9 * * *"]  # 每天 UTC 9 点

# 任务内容
1. 查询 expiryDate 在 3 天后的 paid 订单
2. 发送邮件提醒
```

---

## 9. 安全考虑

### 9.1 CORS 配置

```typescript
// 只允许同源和已知的域名
const corsOrigins = [
  'http://localhost:8788',
  'https://timorbiz.pages.dev',
  // 生产域名
];
```

### 9.2 CSRF 防护

- Better Auth 内置 CSRF 防护
- 使用 SameSite Cookie

### 9.3 输入验证

- 所有输入使用 Zod 验证
- SQL 注入防护 (使用 Drizzle 参数化查询)
- XSS 防护 (React 默认转义)

---

## 10. 性能优化

### 10.1 前端优化

- Astro 静态生成 (SSG) 适用于内容页面
- SSR 适用于个性化页面
- 图片使用 R2 + Cloudflare Images
- 懒加载图片和组件

### 10.2 API 优化

- D1 查询优化 (索引)
- 分页 (Limit/Offset)
- 缓存策略 (Cache-Control)

### 10.3 数据库索引

```sql
-- business_pages 表索引
CREATE INDEX idx_business_status ON business_pages(status);
CREATE INDEX idx_business_slug ON business_pages(slug);
CREATE INDEX idx_business_owner ON business_pages(owner_id);
CREATE INDEX idx_business_category ON business_pages(category_id);

-- reviews 表索引
CREATE INDEX idx_reviews_business ON reviews(business_page_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
```

---

## 11. 环境变量

```env
# Cloudflare
CF_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=timorbiz
R2_PUBLIC_URL=your-public-url.r2.cloudflarestorage.com

# Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-chars-long!!

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

# App
APP_URL=http://localhost:8788
NODE_ENV=development
```

---

**文档版本**: 3.0
**最后更新**: 2026-03-22
**开发状态**: ✅ 架构已完成
