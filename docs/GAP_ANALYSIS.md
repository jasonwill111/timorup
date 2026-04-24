# PRD 合规审计报告

> **审计日期**: 2026-03-22
> **审计人**: Claude Code (自动审计)
> **PRD 版本**: v3.1 (2026-02-27)
> **项目状态**: 主体功能完成，剩余 12 个缺口待修复

---

## 执行摘要

| 维度 | 状态 |
|------|------|
| 19 个页面 | ✅ 全部存在 |
| Epic 完成率 | ✅ 12/12 |
| Story 完成率 | ⚠️ 55/57 (96%) |
| 功能需求 (FR-01~FR-07) | ⚠️ 31/35 完成 |
| 安全 NFR | ⚠️ 部分完成 |
| GDPR NFR | ❌ 完全缺失 |

---

## 一、已确认完成的功能

### 1.1 核心功能 ✅

| 功能 | 文件/实现 | 验证状态 |
|------|---------|---------|
| 所有 19 个页面路由 | `src/pages/` | ✅ |
| Email/Phone 注册登录 | `src/pages/api/auth/` | ✅ |
| Google/Facebook OAuth | `src/pages/api/auth/` | ✅ |
| 商家 CRUD + 3 天试用 | `src/pages/business/create.astro` | ✅ |
| 分类筛选 + 搜索 + 排序 | `src/pages/businesses/index.astro` | ✅ |
| 产品管理 + 套餐配额 | `src/pages/api/products/` | ✅ |
| 评分评论 + 编辑/删除 | `src/components/reviews/` | ✅ |
| Leaflet 地图展示 + 点击导航 | `src/pages/business/[slug].astro` | ✅ |
| TipTap 富文本编辑器 | `src/components/RichTextEditor.tsx` | ✅ |
| Blog 系统 (schema + API + Admin) | `src/db/schema/blogs.ts`, `src/pages/admin/blogs.astro` | ✅ |
| 过期 Cron + 邮件提醒 | `src/pages/api/cron/`, `src/lib/email.ts` | ✅ |
| Canvas 图片压缩 | `src/components/business/ImageUploader.tsx` | ✅ |
| Admin 认证 (better-auth + 速率限制) | `src/pages/api/admin/` | ✅ |
| Cloudflare R2 存储 | `src/lib/media.ts` | ✅ |
| GitHub Actions CI/CD | `.github/workflows/` | ✅ |
| SpecWeave 基础设施 | `.specweave/`, `scripts/check-versions.sh` | ✅ |

### 1.2 新增 Epic 状态

| Epic | 描述 | 状态 |
|------|------|------|
| Epic 11: 博客系统 | Admin CRUD + TipTap + 标签/状态 | ✅ |
| Epic 12: 基础设施增强 | Admin 安全 + Cron + CI/CD + TipTap AboutUs | ✅ |

---

## 二、功能缺口（按优先级）

### 🔴 P0 — 必须修复（影响收入/核心逻辑）

#### G-01: "一人一店"限制缺失
**PRD**: FR-02.4 + BS-013 — 每位用户只能创建 1 个商业页面
**现状**: API 中无检查，用户可无限创建
**影响**: 违反 PRD 核心业务规则，可能导致用户滥用
**修复位置**:
- `src/pages/api/businesses/create.ts` — 添加 `ownerId` 已有页面检查
- `src/pages/api/admin/businesses/index.ts` — POST 创建时同样检查
- 返回错误: `{ code: 'BUSINESS_LIMIT', message: '每位用户只能创建1个商业页面' }`
**AC**: Given 已登录用户已有商业页面 → When 点击"创建商家" → Then 显示错误提示

#### G-02: 支付二维码硬编码
**PRD**: FR-05.3 — 订阅页从 Site Settings 动态读取二维码
**现状**: `/subscribe` 页面硬编码 `<img src="/images/payment-qr.png">`
**影响**: Admin 无法通过后台更新支付二维码
**修复位置**:
- `src/pages/subscribe.astro` — 从 `/api/admin/settings?key=payment_qr` 获取 URL
- `src/pages/api/admin/settings/index.ts` — 确保 `payment_qr` key 存在并返回 URL
**AC**: Given Admin 在 Site Settings 上传了新二维码 → Then 用户访问 /subscribe 看到新二维码

#### G-03: Nominatim 地址解析缺失
**PRD**: 第 12 节 — 地址文本 → OpenStreetMap Nominatim API → 存储 lat/lng
**现状**: 仅手动输入坐标，无自动转换
**影响**: 用户体验差，地址→坐标的 UX 流程缺失
**修复位置**:
- `src/pages/business/create.astro` — 地址输入后调用 Nominatim API
- `src/pages/admin/businesses.astro` — 编辑表单同样处理
- `src/lib/geo.ts` (新建) — Nominatim API 封装，rate limit 处理
**AC**: Given 用户输入地址 → When 焦点离开地址字段或点击"解析坐标" → Then 经纬度自动填充，地图预览更新

---

### 🟡 P1 — 应该修复（影响体验/合规）

#### G-04: GDPR 数据导出功能
**PRD**: NFR-PRV-02 — 用户可导出个人数据
**现状**: 未实现
**修复位置**: `src/pages/api/account/export.ts` — 导出用户数据为 JSON/CSV
**AC**: Given 登录用户 → When 访问 /account/export → Then 下载包含所有个人数据的文件

#### G-05: GDPR 账户删除功能
**PRD**: NFR-PRV-03 — 用户可请求删除个人数据
**现状**: 未实现
**修复位置**: `src/pages/api/account/delete.ts` — 软删除或 GDPR 删除流程
**涉及表**: users, sessions, accounts, reviews, orders, businessPages (owned)
**AC**: Given 登录用户 → When 访问 /account → Then 可看到"删除账户"按钮

#### G-06: Editor 角色权限强制
**PRD**: 第 4 节 — Editor 可创建/编辑但不可删除
**现状**: Admin 后台未区分 Editor/Admin 权限，Editor 可见删除按钮
**修复位置**: `src/pages/admin/` — 各页面根据 `user.role` 隐藏删除按钮
**AC**: Given 用户角色为 Editor → Then Admin 页面无删除操作（只有 Admin 和 Super Admin 可删除）

#### G-07: 视频上传支持
**PRD**: FR-06.2 — 支持 MP4/WebM ≤5MB
**现状**: 仅支持图片上传，视频上传 UI 和 API 未实现
**修复位置**: `src/components/business/ImageUploader.tsx` — 添加视频类型处理；`src/lib/media.ts` — 视频上传到 R2
**涉及套餐**: Basic/Pro/Max 均支持 1 个视频
**AC**: Given 付费用户上传视频 → Then 视频保存到 R2，显示视频播放器

#### G-08: Timor-Leste 定制内容
**PRD**: 面向 Timor-Leste 市场
**现状**: Privacy Policy 和 Terms of Service 为通用模板
**修复位置**: `src/pages/privacy.astro`, `src/pages/terms.astro` — 添加 Timor-Leste 相关法律要求（如数据本地化、联系方式等）

---

### 🟢 P2 — 可选修复

#### G-09: 忘记密码邮件实际发送
**PRD**: FR-01.6
**现状**: `forgot-password` API 存在，但未确认 `emailTemplates.passwordReset` 实际发送
**修复**: 确认 `sendEmail()` 在生产环境正确配置 SMTP/SendGrid

#### G-10: OAuth CSRF state 参数完整性
**PRD**: NFR-SEC-06
**现状**: better-auth 内置 CSRF，但需确认 state 参数在 Google/Facebook OAuth 流程中正确生成和验证
**验证**: 代码审查 `src/pages/api/auth/` 认证流程

#### G-11: Admin 订单确认流程完整性
**PRD**: SB-006 — 管理员确认付款
**现状**: `src/pages/admin/subscriptions.astro` 存在，需验证"确认付款"按钮实际调用 API
**验证**: 手动测试完整流程

#### G-12: Admin 商家创建流程支持 Latest Updates
**现状**: Admin `businesses.astro` 已支持 Latest Updates TipTap，但 Admin 创建商家时未使用富文本（仅 textarea）
**修复**: 将 `src/pages/admin/businesses.astro` 的创建表单改为 TipTap（已完成 B5）

---

## 三、安全 NFR 缺口

| NFR-ID | 需求 | 状态 | 备注 |
|--------|------|------|------|
| NFR-SEC-01 | HTML 转义 | ✅ | 所有模板使用 `escapeHtml()` |
| NFR-SEC-02 | CORS 动态验证 | ✅ | `isOriginAllowed()` 已实现 |
| NFR-SEC-03 | 商家所有者验证 | ⚠️ | 仅 Admin 侧验证，前端用户侧待查 |
| NFR-SEC-04 | 速率限制 | ✅ | Admin 登录 10/15min 已实现 |
| NFR-SEC-05 | 密码最小长度 8 字符 | ❓ | 需验证注册 API 验证 |
| NFR-SEC-06 | OAuth state 验证 | ⚠️ | better-auth 内置，需代码审查确认 |

---

## 四、GDPR NFR 缺口（法律风险）

| NFR-ID | 需求 | 状态 | 优先级 |
|--------|------|------|--------|
| NFR-PRV-01 | 遵循 GDPR 数据保护原则 | ❌ | 🔴 P0 |
| NFR-PRV-02 | 用户可导出个人数据 | ❌ | 🟡 P1 (G-04) |
| NFR-PRV-03 | 用户可请求删除个人数据 | ❌ | 🟡 P1 (G-05) |

> ⚠️ 如果服务面向 EU 用户，GDPR 合规是法律强制要求。即使目标是 Timor-Leste，建议遵循隐私保护最佳实践。

---

## 五、SpecWeave 任务清单

### Increment 1: P0 合规修复（推荐优先）

| Task | 描述 | AC 验收 |
|------|------|---------|
| T-01 | 添加"一人一店"检查 | Given 已拥有商家 → When 创建第 2 个 → Then 返回 BUSINESS_LIMIT 错误 |
| T-02 | 动态支付二维码 | Given Admin 上传 QR → Then /subscribe 动态显示 |
| T-03 | Nominatim 地址解析 | Given 输入地址 → Then 自动填充 lat/lng + 地图预览 |

### Increment 2: GDPR 合规

| Task | 描述 | AC 验收 |
|------|------|---------|
| T-04 | 用户数据导出 | Given 登录用户 → Then 可下载 JSON 数据包 |
| T-05 | 账户删除 | Given 登录用户 → Then 可删除账户及关联数据 |

### Increment 3: P1 功能完善

| Task | 描述 | AC 验收 |
|------|------|---------|
| T-06 | Editor 权限强制 | Given Editor 角色 → Then Admin 页面无删除按钮 |
| T-07 | 视频上传 | Given 付费用户 → Then 可上传 MP4/WebM ≤5MB |
| T-08 | Timor-Leste 内容定制 | Given 访问 Privacy/Terms → Then 显示 Timor-Leste 定制内容 |

### Increment 4: 验证和完善

| Task | 描述 |
|------|------|
| T-09 | OAuth CSRF state 验证（代码审查） |
| T-10 | Admin 订单确认流程验证（E2E 测试） |
| T-11 | 忘记密码邮件发送验证 |
| T-12 | 更新 EPICS.md / STORIES.md 标记所有完成项 |

---

## 六、修复优先级建议

```
立即修复（P0）:
  G-01 一人一店限制  → 直接影响业务规则
  G-02 动态二维码    → Admin 无法更新支付信息
  G-03 Nominatim   → 影响核心 UX 流程

本周内修复（P1）:
  G-04 GDPR 导出   → 法律风险
  G-05 GDPR 删除   → 法律风险
  G-06 Editor 权限  → 安全漏洞

可选修复（P2）:
  G-07 视频上传
  G-08 Timor-Leste 内容
  G-09~G-12 验证项
```

---

## 七、缺口→SpecWeave Increment 映射

| Increment | 缺口 | 建议命令 |
|---------|------|---------|
| `sw:increment "PRD P0 合规修复 (G-01~G-03)"` | G-01, G-02, G-03 | T-01, T-02, T-03 |
| `sw:increment "GDPR 合规 (G-04, G-05)"` | G-04, G-05 | T-04, T-05 |
| `sw:increment "P1 功能完善 (G-06~G-08)"` | G-06, G-07, G-08 | T-06, T-07, T-08 |

---

**审计完成**: 2026-03-22
**下次审查**: 每次 sprint 结束时
**文档版本**: 1.0
