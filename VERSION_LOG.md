# 版本日志

> 每次项目开发前检查并更新此文件

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
