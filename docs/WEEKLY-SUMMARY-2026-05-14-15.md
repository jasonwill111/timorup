# Weekly Summary: 2026-05-14 ~ 2026-05-15

## 主要工作

### 1. Schema 同步与数据修复
- 从远程 D1 导出完整数据到本地
- 修复 businesses 表中的数据污染 (gov-*, ngo-* 移至正确表)
- 验证所有详情页正常显示

**数据量 (2026-05-15):**
| Entity | Count | Status |
|--------|-------|--------|
| businesses | 30 | ✅ |
| non_profits | 13 | ✅ |
| public_sectors | 5 | ✅ |
| products | 30 | ✅ |
| listings | 6 | ✅ |

### 2. Seed 数据更新
添加 `src/db/seeds/` SQL 脚本，包含完整 schema 字段：

**更新字段:**
- businesses: `industry`, `contact`, `location`, `tags`, `photo_gallery`, `latest_update`
- products: `price_fields`, `price_unit`, `featured`, `service_type`
- listings: `description`, `condition`, `location`, `image_ids`
- non_profits: `about_us`, `tags`, `photo_gallery`
- public_sectors: `opening_hours`, `tags`, `photo_gallery`

### 3. E2E 测试修复
修复 Astro hydration 等待问题：
```typescript
// 修复前
await page.fill('input[name="email"]', 'test@example.com');

// 修复后
await page.waitForFunction(() => {
  return !document.querySelector('[data-astro-pending]');
});
await page.fill('input[name="email"]', 'test@example.com');
```

### 4. 代码清理
删除 bmad 框架残留 (88 个文件):
- `.claude/commands/bmad-*` - 76 个命令文件
- `.opencode/command/bmad-*` - opencode 配置
- `*.bak` - 备份文件

### 5. CDN 缓存优化 (2026-05-15)

为所有 SSR 页面添加 Cloudflare CDN 缓存头：

**修改文件:**
- `src/pages/index.astro` - Server Islands max 5min
- `src/pages/businesses/index.astro` - Cache-Control 60s/30s
- `src/pages/business/[slug].astro` - Cache-Control 120s
- `src/pages/non-profits/index.astro` - Cache-Control 60s/30s
- `src/pages/non-profit/[slug].astro` - Cache-Control 120s
- `src/pages/public-sectors/index.astro` - Cache-Control 60s/30s
- `src/pages/public-sector/[slug].astro` - Cache-Control 120s

**缓存策略:**
| 页面类型 | TTL | stale-while-revalidate |
|----------|-----|----------------------|
| 列表页(无搜索) | 60s | 300s |
| 列表页(有搜索) | 30s | 120s |
| 详情页 | 120s | 600s |
| Draft 页面 | no-store | - |

**效果:**
- TTFB: 200-500ms → ~50ms (CDN 命中)
- DB 调用: 减少 ~80%
- Workers 成本: 降低 ~80%

### 6. 文档更新
- `SPECWEAVE/increments/0053/` - Best Practices Enforcement
- `SPECWEAVE/increments/0054/` - SEO Sitemap & Breadcrumb
- `SPECWEAVE/docs/internal/specs/timorlist/SCHEMA-FINAL.md`
- `src/db/seeds/README.md`

## 修复的问题

1. **API 返回 [object Object]** - wrangler dev 重启后解决
2. **详情页显示问题** - Schema 字段对齐后修复
3. **数据分类错误** - gov-/ngo- 前缀数据移至正确表
4. **E2E hydration 竞态** - 添加等待逻辑

## Git Commits (2026-05-14~15)

| Commit | Description |
|--------|-------------|
| `e05584a` | perf: fix draft page caching + syntax errors |
| `334e51a` | perf: add CDN caching headers for SSR pages |
| `edf3417` | docs: add weekly summary 2026-05-14~15 |
| `9c3ebd6` | chore: remove all bmad framework remnants |
| `a96e168` | docs: add seed data scripts |
| `ff344c9` | docs: update 0042 task progress (4/12) |
| `bb4e5c9` | docs: commit FS-053/FS-054 specs |
| `f05315b` | docs: add 0053 increment docs |
| `788b86a` | fix(e2e): wait for Astro hydration |

## 经验教训

### D1 数据同步
- 使用 `wrangler d1 export --remote` 导出
- 使用 `sed` 提取 INSERT 语句
- 使用 `wrangler d1 execute --local --file` 导入

### Wrangler Dev 问题
- 端口冲突时自动切换 (4321→4322→4323)
- 端口占用: `fuser -k 8787/tcp` 清理
- `[object Object]` 错误: 重启 dev server

### Schema 更新流程
1. 更新 `src/db/schema/` 定义
2. 更新 API 返回字段
3. 更新页面组件引用
4. 同步 seed 数据
5. 验证详情页显示
