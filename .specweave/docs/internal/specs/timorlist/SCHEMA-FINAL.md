# TimorList 数据库 Schema 最终版本

> 版本: 2026-05-14
> 最后更新: 2026-05-14

## ⚠️ 重要原则

**Schema 是数据结构的根源。**

- 页面显示问题 → 先检查页面代码是否正确使用 Schema 字段
- 不确定字段含义 → 查此文档
- 发现 Schema 错误 → 先与团队讨论，确认后再修改

**禁止：** 未经讨论随意修改 Schema。

---

## 1. Auth Tables (用户认证)

### users (用户账户)
```typescript
id: text().primaryKey()                    // UUID
email: text().unique()                    // 唯一邮箱
emailVerified: integer()                   // 0/1
phone: text()                             // +670xxxxxxxx
name: text()                              // 显示名称
image: text()                             // 头像 URL
role: text()                              // 'user' | 'admin' | 'super_admin'
createdAt: integer()                       // Unix timestamp
updatedAt: integer()
```

### sessions (会话)
```typescript
id: text().primaryKey()
userId: text()                            // FK → users.id
token: text().unique()                    // 会话 token
expiresAt: integer()                      // 过期时间
userAgent: text()                         // 浏览器 UA
ipAddress: text()                         // IP 地址
createdAt: integer()
```

### accounts (OAuth 绑定)
```typescript
id: text().primaryKey()
userId: text()                           // FK → users.id
accountId: text()                         // OAuth 账户 ID
providerId: text()                         // 'google' | 'facebook'
accessToken: text()
refreshToken: text()
idToken: text()
accessTokenExpiresAt: integer()
refreshTokenExpiresAt: integer()
scope: text()
password: text()                          // 本地密码哈希
createdAt: integer()
updatedAt: integer()
```

### verifications (验证码)
```typescript
id: text().primaryKey()
identifier: text()                         // 'email:xxx' | 'phone:+670xxx'
value: text()                             // 验证码
expiresAt: integer()
createdAt: integer()
```

---

## 2. Category Tables (分类表)

> 4 个分类表结构基本相同，只有 listingCategories 有独有字段

### businessCategories (商家行业分类)
```typescript
id: text().primaryKey()
name: text()                              // "Restaurants"
slug: text().unique()                      // "restaurants"
description: text()
icon: text()                              // Lucide 图标名
parentId: text()                           // 父分类 ID (二级分类)
sortOrder: integer()                        // 排序
isActive: integer()                        // 0/1
createdAt: integer()
updatedAt: integer()
```

### nonProfitCategories (NGO 分类)
> 结构同 businessCategories

### publicSectorCategories (政府分类)
> 结构同 businessCategories

### listingCategories (广告分类)
```typescript
# 同 businessCategories + 独有字段:
formFields: text()                         # JSON: 动态表单字段配置
                                              # [{ name, type, label, required, options }]
```

### productCategories (SKU 分类)
```typescript
# 同 businessCategories + 独有字段:
formFields: text()                         # JSON: 动态表单字段配置
                                              # [{ name, type, label, required, options }]
```

> 42 个预置分类，每个分类有特有的价格字段（如 pricePerNight, pricePerSession 等）

---

## 3. Entity Tables (实体表)

### businesses (商家) ⭐有订阅
```typescript
id: text().primaryKey()
title: text()
slug: text().unique()
ownerId: text()                            // FK → users.id
categoryId: text()                          // FK → business_categories.id
status: text()                              // 'draft' | 'live' | 'published'

# 联系信息
contactName: text()
contactNumber: text()
countryCode: text().default('+670')
email: text()
address: text()

# 位置
locationLat: real()
locationLng: real()

# 内容
openingHours: text()
aboutUs: text()
tags: text()

# 统计
likes: integer().default(0)
saves: integer().default(0)
ratingAverage: real().default(0)
ratingCount: integer().default(0)
views: integer().default(0)

# 行业 (商家独有)
industry: text()

# 订阅 (商家独有)
subscriptionStatus: text()                 // 'none' | 'trial' | 'active' | 'expired'
subscriptionExpiresAt: integer()
gracePeriodEndDate: integer()
limits: text()                            // JSON: { skuLimit, maxImages, maxVideos }
planSlug: text()                            // 当前订阅套餐 slug

# 其他
registrationUrl: text()
verifiedBadge: integer().default(false)
socialLinks: text()                        // JSON: { facebook, instagram, ... }
createdAt: integer()
updatedAt: integer()
```

### nonProfits (NGO/非营利组织)
```typescript
# 同 businesses，但无以下字段:
# - industry
# - subscriptionStatus, subscriptionExpiresAt, gracePeriodEndDate, limits, planSlug
```

### publicSectors (政府/公共部门)
```typescript
# 同 nonProfits + 独有字段:
governmentData: text()                      // JSON: { department, serviceTypes, ... }
```

### listings (分类广告)
```typescript
id: text().primaryKey()
title: text()
slug: text().unique()
ownerId: text()
categoryId: text()                          // FK → listing_categories.id
status: text()

description: text()                         # 长文本内容

location: text()                             # 地址字符串
locationLat: real()
locationLng: real()

contactName: text()
contactNumber: text()
countryCode: text().default('+670')
email: text()

tags: text()

# 统计
likes: integer().default(0)
saves: integer().default(0)
views: integer().default(0)

# 有效期 (广告独有)
expiresAt: integer()                        # null = 永久(付费后)
lastRenewedAt: integer()

# Admin 设置
featured: integer().default(false)           # 精选标记
featuredUntil: integer()                    # 精选截止

# 动态字段 (广告独有) - 存储类型特有信息
extraData: text()                            # JSON: { type, price, condition, brand, ... }
                                                  # type: 'job' | 'product' | 'service' | 'vehicle' | 'property' | 'wanted'

createdAt: integer()
updatedAt: integer()
```

---

## 4.1 Product Categories (SKU 分类)

### productCategories (SKU 分类)
```typescript
id: text().primaryKey()                    // UUID
name: text()                               // "Electronics Repair"
slug: text().unique()                      // "electronics-repair"
description: text()
icon: text()                               // Lucide 图标名
parentId: text()                           // 父分类 ID (二级分类)
sortOrder: integer()                       // 排序
isActive: integer()                        // 0/1
formFields: text()                         // JSON: 动态表单字段配置
                                            // [{ name, type, label, required, options }]
createdAt: integer()
updatedAt: integer()
```

---

## 4. Content Tables (内容表)

### latestUpdates (动态更新)
```typescript
id: text().primaryKey()
type: text()                                 # 'business' | 'non_profit' | 'public_sector'
typeId: text()                               # 实体 ID
content: text()                              # 最大 255 字符
imageIds: text()                              # JSON: ["media-id-1", "media-id-4"] (最多4张)
videoId: text()                              # 单个视频 media ID
createdAt: integer()
updatedAt: integer()

# 索引
uniqueIndex("latest_updates_unique").on(type, typeId)  # 每实体仅一条记录
```

### products (商品/SKU) - 商家专有
```typescript
id: text().primaryKey()
businessId: text()                           # FK → businesses.id
categoryId: text()                           # FK → product_categories.id (NOT NULL)

title: text()
slug: text().unique()
description: text()
productType: text()                          # 'product' | 'service' | 'virtual' | 'ticket' | 'subscription' | 'rental'

# 价格 + 规格（JSON，由 category 的 formFields 定义结构）
# priceFields: { "pricePerNight": "50", "breakfastIncluded": true, ... }
priceFields: text()                          # JSON: 分类特有的价格字段
# specifications: { "roomType": "Deluxe", "bedType": "King", ... }
specifications: text()                      # JSON: 分类特有的规格字段

images: text()                              # JSON: ["media-id"]
featured: integer().default(false)
active: integer().default(true)
sortOrder: integer().default(0)
createdAt: integer()
updatedAt: integer()

# 索引
index("products_business_idx").on(businessId)
index("products_category_idx").on(categoryId)
uniqueIndex("products_slug_idx").on(slug)
index("products_active_idx").on(active)
```

**价格字段设计**：
- 每个 productCategory 的 formFields 定义该行业的"主价格字段"
- products.priceFields 存储用户输入的价格值
- 例：Hotels & Lodging → `pricePerNight`, Beauty → `pricePerSession`, Events → `pricePerPerson`

### productType 预置字段模板

| productType | 预置字段 | 说明 |
|-------------|---------|------|
| `product` | brand, model, condition | 实物商品 |
| `service` | duration, maxParticipants | 服务项目 |
| `virtual` | downloadLink, accessCode | 虚拟商品 |
| `ticket` | eventDate, eventTime, venue, seats | 门票/活动 |
| `rental` | rentalPeriod, deposit | 租赁 |
| `subscription` | billingCycle, credits | 订阅服务 |

前端根据 `productType` 渲染对应表单，保存到 `specifications` JSON。

### reviews (评论区) - 商家专有
```typescript
id: text().primaryKey()
businessId: text()                           # FK → businesses.id
userId: text()                               # FK → users.id
rating: integer()                            # 1-5
title: text()
content: text()                             # max 255 chars
reply: text()                                # 商家回复
repliedAt: integer()
repliedBy: text()                            # 回复者 userId
status: text()                               # 'pending' | 'approved' | 'rejected'
createdAt: integer()
updatedAt: integer()

# 索引
uniqueIndex("reviews_user_business_idx").on(userId, businessId)  # 每用户每 business 一条
```

### blogPosts (博客)
```typescript
id: text().primaryKey()
title: text()
slug: text().unique()
excerpt: text()                             # 列表显示
content: text()                             # 富文本内容
coverImageId: text()
authorName: text()                          # 作者名称（不一定是平台用户）
# SEO
metaTitle: text()                           # SEO 标题（可选）
metaDescription: text()                    # SEO 描述（可选）
canonicalUrl: text()                        # 规范化 URL
status: text()                             # 'draft' | 'published'
tags: text()
publishedAt: integer()
createdAt: integer()
updatedAt: integer()
```

---

## 5. Commerce Tables (商业表)

### servicePackages (服务套餐 SKU)
```typescript
id: text().primaryKey()
name: text()                                  # "Business Subscription", "Listing Renewal"
slug: text().unique()
type: text()                                  # 'subscription' | 'listing_renewal' | 'featured' | 'addon'
category: text()                              # 'business' | 'listing' | 'other'
description: text()

# 变体数组 (JSON) - 每个 SKU 多个变体
variants: text().notNull()                    # JSON array:
                                              # [{ name: "Monthly", price: 29, currency: "USD",
                                              #   durationValue: 1, durationUnit: "month",
                                              #   limits: { skuLimit: 10, maxImages: 16, maxVideos: 2 },
                                              #   features: ["SEO Tools"] }]

isActive: integer().default(true)
sortOrder: integer().default(0)
createdAt: integer()
updatedAt: integer()
```

**示例套餐：**
- Business Subscription: Starter Monthly ($29, 1month), Starter Yearly ($290, 12month)
- Listing Renewal: 7 Days ($5), 30 Days ($15), 365 Days ($100)

### orders (订单)
```typescript
id: text().primaryKey()

# 关联
servicePackageId: text()                     # FK → service_packages.id

# 变体快照 - 购买时的完整变体数据
variantSnapshot: text().notNull()            # JSON: { name, price, currency,
                                              #   durationValue, durationUnit, limits, features }

# 订单信息
type: text()                                  # 'business' | 'listing'
typeId: text()                                # business_id | listing_id
userId: text()
amount: integer()                             # 实际支付金额(分)
status: text()                                # 'pending' | 'paid' | 'cancelled' | 'refunded'
paymentMethod: text()
paidDate: integer()

# 这次购买的有效期
expiresAt: integer()

# Admin
adminNotes: text()
createdAt: integer()
updatedAt: integer()
```

---

## 6. Media & Utilities

### media (媒体文件)
```typescript
id: text().primaryKey()
r2Key: text().unique()                       # R2 路径: businesses/biz-123/avatar_abc.jpg

# 文件信息
filename: text()                              # 原始文件名
mimeType: text()                               # image/jpeg, video/mp4
size: integer()                                # 字节
width: integer()
height: integer()

# 关联
entityType: text()                            # 'pages' | 'general' | 'businesses' | 'listings' | 'non-profits' | 'public-sectors' | 'blog' | 'users'
entityId: text()                               # 实体 ID

# 用途
purpose: text()                              # 'avatar' | 'banner' | 'cover' | 'gallery' | 'logo' | 'icon' | 'og-image' | 'content'

# 排序
sortOrder: integer().default(0)

# SEO
alt: text()                                  # 无障碍文本

# 审计
hash: text().unique()                         # 内容哈希(去重)
createdById: text()
createdAt: integer()

# 软删除
deletedAt: integer()                           # null = 正常, timestamp = 已删除
```

### savedItems (收藏)
```typescript
id: text().primaryKey()
userId: text()
type: text()                                  # 'businesses' | 'listings'
typeId: text()                                # entity ID
createdAt: integer()

# 索引
uniqueIndex("saved_items_user_type_id_idx").on(userId, type, typeId)  # 防重复收藏
```

### adBanners (广告横幅)
```typescript
id: text().primaryKey()
title: text()
description: text()                        # admin 备注
imageId: text()
linkUrl: text()                           # slug
linkType: text()                          # 'business' | 'listing' | 'product'
position: text()                          # 'homepage' | 'businesses' | 'products-services' | 'listings'
sortOrder: integer().default(0)          # 越大越靠前
orderId: text()                           # FK → orders.id (需付款后生效)
isActive: integer().default(true)
startDate: integer()
endDate: integer()
createdAt: integer()
updatedAt: integer()

# 显示数量限制
每个 position 最多显示 4 个广告
```

### siteSettings (网站设置)
```typescript
id: text().primaryKey()
key: text().unique()
value: text()
type: text()                                 # 'string' | 'number' | 'boolean' | 'json'
description: text()
isPublic: integer().default(false)
updatedAt: integer()
```

---

## 7. Entity Features Comparison

| 特性 | Businesses | Non-Profits | Public Sectors | Listings |
|------|:----------:|:-----------:|:-------------:|:--------:|
| **套餐/SKU** | ✅ | ❌ | ❌ | ❌ |
| **Reviews** | ✅ | ❌ | ❌ | ❌ |
| **Industry** | ✅ | ❌ | ❌ | ❌ |
| **Subscription** | ✅ | ❌ | ❌ | ❌ |
| **GovernmentData** | ❌ | ❌ | ✅ | ❌ |
| **extraData** | ❌ | ❌ | ❌ | ✅ |
| **LatestUpdate** | ✅ | ✅ | ✅ | ❌ |
| **Photo Gallery** | ✅ | ✅ | ✅ | ❌ |
| **图片限制** | 16+2视频 | 16+2视频 | 16+2视频 | 8+1视频 |

---

## 8. Schema 变更记录

### 2026-05-13 最终版

| 表 | 变更 |
|----|------|
| `businesses` | 添加 `limits` (JSON), `planSlug` |
| `listings` | 移除 `listingType/imageIds/price/condition`，添加 `extraData/featured/featuredUntil` |
| `latestUpdates` | 添加 `type` + `typeId` 支持多实体 |
| `orders` | 添加 snapshot 字段保存购买时价格 |
| `servicePackages` | 统一套餐表，支持订阅/续费/插件 |

---

## 9. 字段命名约定

| 类型 | 格式 | 示例 |
|------|------|------|
| 外键 | `{entity}Id` | `ownerId`, `categoryId` |
| 时间戳 | `camelCase` | `createdAt`, `expiresAt` |
| JSON 字段 | `camelCase` | `socialLinks`, `extraData` |
| 布尔 | `integer` (0/1) | `isActive`, `featured` |
| 枚举值 | `text` | `status`, `type`, `serviceType` |

---

## 10. 调试指南

**页面显示异常？**

1. **查 Schema** - 确认字段存在
2. **查 Query** - 确认 SELECT 了正确字段
3. **查 Transform** - 确认数据转换正确
4. **查 Render** - 确认模板使用正确变量

**不要：** 随意改 Schema 解决问题

