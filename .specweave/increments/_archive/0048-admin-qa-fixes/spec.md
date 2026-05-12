---
name: 0048-admin-qa-fixes
description: Fix admin pages QA issues - listings date, categories badge, dashboard stats, typos
type: increment
status: completed
created: 2026-05-11
completed: 2026-05-11
---

# Admin QA Fixes (0048)

## Overview

修复 admin 所有子页面的 QA 问题，确保数据正确显示、UI 无错误。

## Issues Fixed

### Critical (必须修复)
1. ✅ **Listings 日期错误** — "Invalid Date" 显示
2. ✅ **Categories 实体徽章错误** — Business tab 显示 "Non-Profit" 徽章

### Medium (应该修复)
3. ✅ **Dashboard 统计为空** — 图表空白，统计显示 "-"
4. ✅ **Public Sectors 标题拼写错误** — "PublicSectorores" 应为 "Public Sectors"
5. ✅ **Media "NO GLYPH" 图标缺失** — 浏览器 emoji 渲染问题，非代码 bug
6. ✅ **Status badge/dropdown 不匹配** — Non-Profits/Public Sectors 显示 "published" badge 但 dropdown 显示 "Draft"

## Acceptance Criteria

- [x] AC-001: Listings 页日期正确显示
- [x] AC-002: Categories 页 Business tab 显示正确徽章
- [x] AC-003: Dashboard 统计加载正确（users, businesses, non-profits count）
- [x] AC-004: Public Sectors 标题拼写正确
- [x] AC-005: Media 页图标正确显示
- [x] AC-006: Status badge 和 dropdown 一致

## Files Modified

- `src/pages/admin/listings/index.astro` — 日期格式化
- `src/pages/admin/categories.astro` — 实体徽章逻辑
- `src/pages/admin/public-sectors.astro` — 拼写 + status
- `src/pages/admin/non-profits.astro` — status 格式化
- `src/pages/api/admin/stats.ts` — 新表结构

## Related

- 0038-admin-dashboard-enhancement
- 0039-server-actions-migration (active)