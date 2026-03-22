# TMBIZ - 产品需求文档 (PRD)

---
classification:
  domain: E-commerce / Business Directory
  projectType: web_app
  complexity: low
---

## 1. 项目概述

### 1.1 项目目标

构建一个面向中等规模市场（约1.x百万人口）的本地化在线商业目录和微型网站构建平台。该平台使本地商家、组织和个人能够快速创建"商业页面"来展示其产品和服务。

**重要说明：**
- 网站语言：英语
- 货币：美元
- 目标市场：无在线支付习惯，需支持线下支付方式（扫码转账、现金支付、银行转账）
- 用户凭证：电话和邮箱至少填写其一

### 1.2 目标用户

- 各类本地企业（餐厅、服务、零售等）
- 本地组织
- 想在线销售产品或服务的本地个人
- 搜索本地服务的消费者

### 1.3 核心价值主张

- **低门槛**：免费注册
- **实惠的迷你网站解决方案**：$39/月 或 $390/年
- **高曝光率**：商业目录展示、产品&服务列表、SEO优化
- **完整展示**：Banner主图、Logo/首字母、Business基本信息、联系信息(包括静态地图)、产品服务展示

---

## 1.4 成功标准 (Success Criteria)

| # | 成功指标 | 目标值 | 测量方法 |
|---|----------|--------|----------|
| SC-01 | 注册用户数 | 5,000+ (首年) | 数据库统计 |
| SC-02 | 活跃商家数 | 500+ (首年) | 商家状态统计 |
| SC-03 | 月页面浏览量 | 50,000+ | 分析工具 |
| SC-04 | 搜索使用率 | >30% 访客 | 搜索事件追踪 |
| SC-05 | 订阅转化率 | >5% 商家 | 订单统计 |
| SC-06 | 系统可用性 | 99.5% | 监控工具 |
| SC-07 | API响应时间 | <200ms (P95) | APM监控 |
| SC-08 | 页面加载时间 | <3s (移动端) | Lighthouse |

---

## 1.5 产品范围 (Product Scope)

### MVP (最低可行产品)
- 用户注册/登录 (邮箱/电话/Google/Facebook)
- 商家页面创建和管理
- 商家目录浏览和搜索
- 商家详情展示 (基本信息、联系方式、营业时间)
- 基础评论功能
- 免费试用 (3天)

### Growth (增长阶段)
- 产品/服务管理
- 高级搜索和筛选
- 商家评分系统
- 社交分享功能
- 收藏/书签功能
- 广告横幅管理

### Vision (愿景)
- 多语言支持
- 商家仪表板分析
- 高级营销工具
- API 开放平台
- 移动端原生应用

---

## 1.6 用户旅程 (User Journeys)

### Journey 1: 消费者浏览商家
1. 访问首页 → 查看精选商家
2. 进入商家目录 → 筛选分类
3. 使用搜索 → 查找特定商家
4. 查看商家详情 → 了解产品/服务
5. 查看联系方式 → 通过WhatsApp/电话联系

### Journey 2: 商家注册并创建页面
1. 访问首页 → 点击"创建商家"
2. 注册账户 → 邮箱/电话/OAuth
3. 填写商家信息 → 名称、分类、描述
4. 上传Banner和Logo → 添加联系方式
5. 设置营业时间 → 填写地址
6. 发布商家页面 → 开始3天试用

### Journey 3: 商家订阅付费套餐
1. 查看定价页面 → 选择套餐
2. 进入订阅页面 → 选择月付/年付
3. 显示支付信息 → 扫码转账/银行转账
4. 通过WhatsApp联系管理员 → 确认付款
5. 管理员后台确认 → 订单状态变更为已支付

### Journey 4: 商家管理产品
1. 登录账户 → 进入管理后台
2. 创建产品 → 填写名称、价格、描述
3. 上传产品图片 → 最多5张
4. 编辑/删除产品 → 管理产品列表

---

## 2. 技术栈

| 组件 | 技术 | 备注 |
|------|------|------|
| 前端框架 | Astro 5.x + React 19 | SSR 模式 |
| API 框架 | Hono 4.x | Edge 部署 |
| UI 组件 | shadcn/ui (Base UI) | 最新版 |
| 认证 | Better Auth | 支持 OAuth |
| ORM | Drizzle ORM | D1 原生支持 |
| 数据库 | Cloudflare D1 (SQLite) | 开发/生产 |
| 媒体存储 | Cloudflare R2 | S3 兼容 |
| 编辑器 | Lexical | Notion-like 体验 |
| 样式 | Tailwind CSS 4.x | |
| 验证 | Zod | |
| Toast | Sonner | |
| 地图 | Leaflet + OpenStreetMap | 免费开源 |
| 部署 | Cloudflare Pages + Workers | 免费额度 |

---

## 3. 页面与路由

| # | 页面 | 路由 | 说明 |
|---|------|------|------|
| 1 | 首页 | `/` | 精选商家, 广告轮播, 介绍 |
| 2 | 商家目录 | `/businesses` | 搜索, 筛选, 排序, 列表 |
| 3 | 商家详情 | `/business/[slug]` | 完整商家信息, 产品, 评论 |
| 4 | 产品详情 | `/business/[slug]/product/[id]` | 产品图片, 价格, 描述 |
| 5 | 用户账户 | `/account` | 个人信息, 订阅, 商家管理 |
| 6 | 创建商家 | `/business/create` | 创建商业页面向导 |
| 7 | 编辑商家 | `/edit-business-page/[id]` | 编辑商业页面 |
| 8 | 登录 | `/login` | 登录表单 |
| 9 | 注册 | `/register` | 注册表单 |
| 10 | 搜索 | `/search` | 搜索结果 |
| 11 | 定价 | `/pricing` | 套餐介绍 |
| 12 | 订阅 | `/subscribe` | 选择套餐, 支付信息 |
| 13 | 忘记密码 | `/forgot-password` | 密码恢复 |
| 14 | 重置密码 | `/reset-password` | 重置密码 |
| 15 | 邮箱验证 | `/verify` | 验证邮箱 |
| 16 | 管理后台 | `/admin` | CMS 管理界面 |
| 17 | 商家产品列表 | `/business/[slug]/products` | 商家产品列表 |
| 18 | 隐私政策 | `/privacy` | 隐私政策页面 |
| 19 | 服务条款 | `/terms` | 服务条款页面 |

---

## 4. 用户角色与权限

| 角色 | 登录后台 | 权限说明 |
|------|----------|----------|
| **User** | 否 | 前端功能：注册、创建/编辑商业页面，付费激活后可创建产品/服务，评分功能 |
| **Editor** | 是 | 创建/编辑商业页面和产品/服务，无删除权限，可访问订单、用户、BusinessPage |
| **Super Admin** | 是 | 完全访问所有数据，管理广告、订单、用户 |

---

## 5. 注册与登录方式

1. **邮箱 + 密码**：传统方式
2. **电话 + 密码**：传统方式
3. **Google 账号**：通过 Google OAuth 登录
4. **Facebook 账号**：通过 Facebook OAuth 登录

**重要**：email 和 phone 至少填写其一。

**数量限制**：每个用户只能创建 **1个** 商业页面。

---

## 6. 订阅与定价模式

### 6.1 套餐 (3-Tier Pricing)

| 套餐 | 价格 (月付) | 价格 (年付) | 产品/SKU 限制 | 每产品图片限制 | 视频限制 |
|------|------------|------------|--------------|---------------|----------|
| **Basic** | $39/月 | $390/年 | 10 | 5 | 1 |
| **Pro** | $69/月 | $690/年 | 30 | 5 | 1 |
| **Max** | $99/月 | $990/年 | 60 | 5 | 1 |

**注意**：
- 所有套餐均支持 3 天免费试用
- 年付享约 17% 折扣 (10个月价格)
- planType 存储为: `'basic'` | `'pro'` | `'max'`

### 6.2 发布流程

1. 用户填写商家信息
2. 用户添加内容
3. 用户点击"发布"按钮
4. 商业页面变为 `Live` 状态，开始3天免费试用

### 6.3 支付方式展示

选择套餐后，页面显示：
- **收款二维码**：管理员在 Site Settings 中生成的支付二维码
- **网站联系方式**：网站邮箱、网站电话、网站地址
- **支付方式说明**：
  - 扫码转账（通过二维码）
  - 线下现金支付
  - 银行转账

**用户操作**：用户通过 WhatsApp 联系管理员确认付款

### 6.4 过期逻辑

| 阶段 | 触发条件 | 前端访问 |
|------|----------|----------|
| **试用/未支付** | 发布后3天内且订单未支付 | 显示商家名称+Banner图+"Unpaid"提示 |
| **过期（未付款）** | 3天后且订单未支付 | **仅显示Banner图+商家名称** |
| **已过期（已付款）** | 套餐到期后 | **仅显示Banner图+商家名称** |

### 6.5 自动删除

- **过期30天后**，自动删除：
  - 商业页面记录
  - 关联的媒体文件
  - 关联的产品记录

---

## 7. 媒体配额

### 7.1 Business Page 媒体限制 (按套餐)

| 套餐 | 总图片限制 | 视频限制 | 单图大小 | 单视频大小 |
|------|-----------|----------|---------|-----------|
| **Basic** | 10 | 1 | ≤2MB | ≤5MB |
| **Pro** | 10 | 1 | ≤2MB | ≤5MB |
| **Max** | 10 | 1 | ≤2MB | ≤5MB |

### 7.2 产品图片限制

每个产品限制 **5张图片**，每张 ≤2MB

### 7.3 允许的文件类型

- **图片**: JPEG, PNG, GIF, WebP
- **视频**: MP4, WebM, QuickTime

### 7.4 客户端压缩

- 上传前自动使用 Canvas API 压缩图片
- 压缩至最大 1920px 边长，80% JPEG 质量

---

## 8. 数据模型

### 8.1 Users (用户)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| email | String | 唯一，登录凭证 |
| phone | String | 登录凭证 |
| name | String | 用户名 |
| image | String | 头像 URL |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### 8.2 Business Pages (商业页面)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | String | 商家名称 |
| slug | String | URL 友好字符串 |
| ownerId | UUID | 关联用户 |
| categoryId | UUID | 关联分类 |
| status | String | 'draft'/'live'/'expired'/'paid' |
| bannerImageId | UUID | Banner 主图 |
| profileImageId | UUID | Profile 头像 |
| contactName | String | 联系人姓名 |
| contactNumber | String | 联系电话 |
| countryCode | String | 国家代码，默认 +670 |
| yearOfEstablishment | Number | 成立年份 |
| email | String | 商家邮箱 |
| address | String | 地址 |
| locationLat | Number | 纬度 |
| locationLng | Number | 经度 |
| openingHours | JSON | 营业时间 |
| aboutUs | Text | 关于我们 |
| tags | JSON | 标签数组 |
| likes | Number | 点赞数 |
| saves | Number | 收藏数 |
| ratingAverage | Number | 平均评分 |
| ratingCount | Number | 评分总数 |
| views | Number | 浏览量 |
| planType | String | 'basic'/'pro'/'max' |
| publishDate | DateTime | 发布/试用开始日期 |
| expiryDate | DateTime | 过期日期 |

### 8.3 Products (产品/服务)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | String | 产品名称 |
| price | String | 价格 |
| description | Text | 产品描述 |
| businessPageId | UUID | 关联商业页面 |
| images | Array | 产品图片数组，最多4张 |

### 8.4 Reviews (评分评论)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| businessPageId | UUID | 关联商业页面 |
| userId | UUID | 关联用户 |
| rating | Number | 评分（1-5） |
| comment | Text | 评论内容 |
| isEdited | Boolean | 是否被编辑过 |

### 8.5 Orders (订单)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| businessPageId | UUID | 关联商业页面 |
| userId | UUID | 关联用户 |
| planType | String | 'monthly'/'yearly' |
| amount | Number | 金额 |
| status | String | 'unpaid'/'paid'/'cancelled' |
| expiryDate | DateTime | 过期日期 |
| paymentMethod | String | 支付方式 |
| paidDate | DateTime | 实际支付日期 |
| adminNotes | String | 管理员备注 |

### 8.6 Media (媒体文件)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| url | String | Cloudflare R2 链接 |
| filename | String | 文件名 |
| mimeType | String | 文件类型 |
| size | Number | 文件大小 |
| width | Number | 图片宽度 |
| height | Number | 图片高度 |
| alt | String | ALT 文本 |
| type | String | 'image'/'video' |
| businessId | UUID | 关联商家页面 |
| createdById | UUID | 创建者 |

### 8.7 Categories (分类)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | String | 分类名称 |
| slug | String | URL 友好字符串 |
| description | String | 描述 |
| parentId | UUID | 父分类 ID |

### 8.8 Ad Banners (广告横幅)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| title | String | 标题 |
| imageId | UUID | 图片 |
| linkedBusinessPageId | UUID | 关联商业页面 |
| externalUrl | String | 外部链接 |
| isActive | Boolean | 是否激活 |
| startDate | DateTime | 开始日期 |
| endDate | DateTime | 结束日期 |

### 8.9 Site Settings (全局设置)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| key | String | 键名（唯一） |
| value | String | 值（JSON） |

---

## 8B. 功能需求 (Functional Requirements)

### FR-01: 用户注册与认证
| ID | 需求描述 | 测试条件 |
|----|----------|----------|
| FR-01.1 | 访客可以使用邮箱和密码注册账户 | 输入有效邮箱和≥8字符密码，注册成功并收到验证邮件 |
| FR-01.2 | 访客可以使用电话和密码注册账户 | 输入有效电话和≥8字符密码，注册成功 |
| FR-01.3 | 访客可以使用Google OAuth登录 | 点击Google登录按钮，授权后成功创建会话 |
| FR-01.4 | 访客可以使用Facebook OAuth登录 | 点击Facebook登录按钮，授权后成功创建会话 |
| FR-01.5 | 已注册用户可以使用邮箱和密码登录 | 输入正确凭证后成功登录并跳转至账户页面 |
| FR-01.6 | 用户可以重置忘记的密码 | 输入邮箱后收到重置链接，点击后成功设置新密码 |

### FR-02: 商家页面管理
| ID | 需求描述 | 测试条件 |
|----|----------|----------|
| FR-02.1 | 登录用户可以创建商家页面 | 填写商家名称、分类、描述后，页面创建成功并显示在管理后台 |
| FR-02.2 | 商家所有者可以编辑自己的商家页面 | 修改信息后保存成功，前端显示更新内容 |
| FR-02.3 | 商家所有者可以删除自己的商家页面 | 点击删除后，页面及关联产品被物理删除 |
| FR-02.4 | 每位用户只能创建1个商家页面 | 创建第2个商家时，系统返回错误提示 |
| FR-02.5 | 商家页面发布后进入3天免费试用 | 发布后状态变为"live"，试用截止日期为3天后 |

### FR-03: 商家目录与搜索
| ID | 需求描述 | 测试条件 |
|----|----------|----------|
| FR-03.1 | 访客可以浏览所有Live状态的商家 | 商家目录页面显示商家列表，每页最多20个 |
| FR-03.2 | 访客可以按分类筛选商家 | 选择分类后，列表仅显示该分类商家 |
| FR-03.3 | 访客可以搜索商家名称和描述 | 输入关键词后，显示匹配的商家结果 |
| FR-03.4 | 访客可以按名称、评分、最新排序 | 切换排序方式后，列表顺序正确更新 |

### FR-04: 产品管理
| ID | 需求描述 | 测试条件 |
|----|----------|----------|
| FR-04.1 | 付费商家可以创建产品 | 填写产品信息并上传图片后，产品创建成功 |
| FR-04.2 | 商家可以编辑自己的产品 | 修改信息后保存成功 |
| FR-04.3 | 商家可以删除自己的产品 | 点击删除后，产品被物理删除 |
| FR-04.4 | 产品数量受套餐限制 | Basic最多10个，Pro最多30个，Max最多60个 |

### FR-05: 订阅与支付
| ID | 需求描述 | 测试条件 |
|----|----------|----------|
| FR-05.1 | 访客可以查看定价页面 | 页面显示3个套餐及价格 |
| FR-05.2 | 用户可以选择套餐和支付周期 | 选择后显示对应价格和支付方式 |
| FR-05.3 | 订阅后生成待支付订单 | 订单状态为"unpaid"，显示支付信息 |
| FR-05.4 | 管理员可以确认用户付款 | 确认后订单状态变为"paid"，商家状态更新 |

### FR-06: 媒体管理
| ID | 需求描述 | 测试条件 |
|----|----------|----------|
| FR-06.1 | 用户可以上传图片 | 支持JPEG、PNG、GIF、WebP，单张≤2MB |
| FR-06.2 | 用户可以上传视频 | 支持MP4、WebM，单个≤5MB |
| FR-06.3 | 上传前自动压缩图片 | 图片压缩至1920px，80%质量 |
| FR-06.4 | 媒体文件存储在Cloudflare R2 | 上传后返回R2链接 |

### FR-07: 评论与评分
| ID | 需求描述 | 测试条件 |
|----|----------|----------|
| FR-07.1 | 登录用户可以对商家评分 | 选择1-5星，提交后评分成功 |
| FR-07.2 | 登录用户可以撰写评论 | 填写评论内容后，提交成功并显示 |
| FR-07.3 | 商家所有者可以编辑自己的评论 | 修改评论后，显示"已编辑"标记 |
| FR-07.4 | 商家所有者可以删除自己的评论 | 删除后，评论不再显示 |

---

## 9. 行业分类

| 一级分类 | 二级分类 |
|----------|----------|
| Automotive | Car Repair & Maintenance, Car Dealership (Sales), Car Rental, Parts & Accessories, Towing Services |
| Beauty & Wellness | Hair Salon & Barbershop, Nail Salon, Spa & Massage, Gym & Fitness Center, Tattoo & Piercing |
| Business Services | Legal & Law, Accounting & Finance, Marketing & Advertising, Printing & Signage, Consulting |
| Construction & Trades | Plumbing, Electrical, Landscaping & Gardening, Roofing, Cleaning Services |
| Education | Schools & Preschools, Tutoring Center, Training & Certification |
| Entertainment & Events | Bars & Nightclubs, Event Planning, Live Music & DJs |
| Food & Beverage | Restaurants & Dining, Cafes & Coffee Shops, Bakeries & Patisseries, Fast Food, Catering Services |
| Healthcare | Medical Clinics & Hospitals, Dental Care, Pharmacy, Physiotherapy, Mental Health Services |
| Home & Garden | Furniture Stores, Home Decor, Hardware & Tools, Real Estate Agency, Interior Design |
| Retail Shopping | Clothing & Fashion, Electronics & Appliances, Supermarkets & Groceries, Jewelry & Accessories, Gift Shops |
| Technology | Computer Repair, Web Development & IT, Internet Service Provider |
| Travel & Hospitality | Hotels & Lodging, Tour Operators, Transportation Services |

---

## 10. Lexical 编辑器用途

| 场景 | 用途 |
|------|------|
| 前端用户 | 商业页面 - 关于我们 (About Us) |
| 前端用户 | 商业页面 - 最新动态 (Latest Updates) |
| Admin/Editor | 博客/新闻 (Posts) |
| Admin/Editor | 自定义模块内容 |

---

## 11. 定时任务

| 任务 | 频率 | 说明 |
|------|------|------|
| 清理过期页面 | 每日 | 删除30天前过期的商业页面及关联数据 |
| 发送过期提醒 | 过期前3天 | 发送邮件提醒用户续费 |

---

## 12. 地图功能

- **技术方案**：Leaflet + OpenStreetMap
- **实现方式**：
  1. 用户在 Address 文本框输入地址
  2. 系统通过 OpenStreetMap Nominatim API 将地址转换为经纬度坐标
  3. 存储坐标到 locationLat, locationLng
- **点击跳转**：通过 URL Scheme 跳转至设备的默认地图应用

---

## 13. Cloudflare R2 存储

| 功能 | 说明 |
|------|------|
| **SDK** | AWS S3 SDK (@aws-sdk/client-s3) |
| **上传方式** | 直接上传 (生产) / Base64 (开发) |
| **CDN** | 通过 Cloudflare Images 转换优化 |
| **URL 格式** | `https://timorbiz.com/cdn-cgi/image/width=xxx,quality=75,format=webp/{R2_URL}` |

---

## 14. 非功能需求 (Non-Functional Requirements)

### 14.1 安全 (Security)

| NFR-ID | 需求描述 | 测量方法 |
|--------|----------|----------|
| NFR-SEC-01 | 所有用户生成内容必须进行HTML转义 | 代码审查，确认所有输出点使用转义函数 |
| NFR-SEC-02 | CORS必须使用动态Origin验证 | 测试：拒绝非白名单域名 |
| NFR-SEC-03 | 商家CRUD操作必须验证所有者身份 | API测试：未授权用户无法修改他人商家 |
| NFR-SEC-04 | 认证端点实施速率限制 | 测试：10 req/min后返回429 |
| NFR-SEC-05 | 密码最小长度为8字符 | 测试：7字符密码被拒绝 |
| NFR-SEC-06 | OAuth流程必须验证State参数 | 代码审查：确认state生成和验证 |

### 14.2 性能 (Performance)

| NFR-ID | 需求描述 | 测量方法 |
|--------|----------|----------|
| NFR-PER-01 | API响应时间 P95 < 200ms | APM监控工具 |
| NFR-PER-02 | 首页加载时间 < 3s (4G网络) | Lighthouse测试 |
| NFR-PER-03 | 移动端页面加载时间 < 3s | PageSpeed Insights |
| NFR-PER-04 | 搜索结果响应时间 < 500ms | 手动测试 |

### 14.3 可用性 (Availability)

| NFR-ID | 需求描述 | 测量方法 |
|--------|----------|----------|
| NFR-AVA-01 | 系统可用性 ≥ 99.5% | 监控工具统计 |
| NFR-AVA-02 | 计划外停机恢复时间 < 30min | 事件记录 |
| NFR-AVA-03 | 核心功能故障通知 < 5min | 告警系统 |

### 14.4 可扩展性 (Scalability)

| NFR-ID | 需求描述 | 测量方法 |
|--------|----------|----------|
| NFR-SCA-01 | 支持10000+并发用户 | 负载测试 |
| NFR-SCA-02 | 数据库可水平扩展 | 架构设计评审 |
| NFR-SCA-03 | 静态资源通过CDN分发 | 配置检查 |

### 14.5 可访问性 (Accessibility)

| NFR-ID | 需求描述 | 测量方法 |
|--------|----------|----------|
| NFR-ACC-01 | 符合 WCAG 2.1 AA 标准 | Lighthouse审核 |
| NFR-ACC-02 | 所有图片具有ALT文本 | 代码审查 |
| NFR-ACC-03 | 键盘可导航所有功能 | 手动测试 |
| NFR-ACC-04 | 颜色对比度 ≥ 4.5:1 | 手动测试 |

### 14.6 隐私 (Privacy)

| NFR-ID | 需求描述 | 测量方法 |
|--------|----------|----------|
| NFR-PRV-01 | 遵循GDPR数据保护原则 | 合规审查 |
| NFR-PRV-02 | 用户可导出个人数据 | 功能测试 |
| NFR-PRV-03 | 用户可请求删除个人数据 | 功能测试 |

---

## 15. 部署与成本

| 服务 | 免费额度 | 预估用量 (初期) | 成本 |
|------|----------|----------------|------|
| Pages | 500 min/月 | < 100 min | $0 |
| Workers | 100K req/day | ~5K req/day | $0 |
| D1 | 1GB, 5M ops | < 100MB, < 100K ops | $0 |
| R2 | 1GB storage | ~500MB | $0 |
| **总计** | | | **$0** |

---

**文档版本**: 3.0  
**最后更新**: 2026-02-27
