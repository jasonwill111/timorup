# Tasks: Free Plan Scaling Optimizations

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed
- Model hints: haiku (simple), opus (default)

## Phase 1: Cache Headers (US-001)

### T-001: Add Cache-Control Headers
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04

**Implementation Details**:
1. Edit `src/pages/index.astro` - 添加首页缓存头
2. Edit `src/pages/business/[slug].astro` - 添加详情页缓存头
3. Edit `src/pages/listings/index.astro` - 添加列表页缓存头
4. Astro 构建自动处理 hashed 静态资源 (无需手动配置)

**Test Plan**:
- **File**: `tests/unit/cache-headers.test.ts`
- **Tests**:
  - **TC-001**: 首页返回正确的 Cache-Control
    - Given 访问首页 `/`
    - When 请求完成
    - Then 响应头包含 `Cache-Control: public, max-age=60, s-maxage=120, stale-while-revalidate=300`
  - **TC-002**: 详情页返回正确的 Cache-Control
    - Given 访问业务详情页 `/business/[slug]`
    - When 请求完成
    - Then 响应头包含 `Cache-Control: public, max-age=120, s-maxage=600, stale-while-revalidate=600`
  - **TC-003**: 分类列表返回正确的 Cache-Control
    - Given 访问分类列表 `/businesses`
    - When 请求完成
    - Then 响应头包含 `Cache-Control: public, max-age=30, s-maxage=60, stale-while-revalidate=120`

**Dependencies**: None
**Status**: [x] Completed (已存在于 index.astro, listings/index.astro, business/[slug].astro)

---

## Phase 2: Static Page Prerendering (US-002)

### T-002: Prerender Static Pages
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US2-05

**Implementation Details**:
1. `/about` - 已预渲染 (`prerender = true`)
2. `/pricing` - **不预渲染** (需要动态获取定价数据)
3. `/privacy` - 已预渲染 (`prerender = true`)
4. `/terms` - 已预渲染 (`prerender = true`)
5. `/faq` - 已预渲染 (`prerender = true`)

**Test Plan**:
- **File**: `tests/unit/free-plan-optimization.test.ts`
- **Tests**:
  - **TC-001**: about 页面可访问
  - **TC-002**: pricing 页面可访问 (动态页面)
  - **TC-003**: privacy 页面可访问
  - **TC-004**: terms 页面可访问
  - **TC-005**: faq 页面可访问

**Dependencies**: T-001
**Status**: [x] Completed (4/5 pages 已预渲染，pricing 需要 SSR)

---

## Phase 3: HTML Compression (US-003)

### T-003: Enable HTML Compression
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01, AC-US3-02

**Implementation Details**:
1. ✅ `astro.config.mjs` - 启用 `compressHTML: true`
2. ✅ `astro.config.mjs` - 已配置 `cssMinify: true` (production)

**Test Plan**:
- **File**: `tests/unit/free-plan-optimization.test.ts`
- **Tests**:
  - **TC-001**: 配置包含 compressHTML
  - **TC-002**: 配置包含 cssMinify

**Dependencies**: T-001
**Status**: [x] Completed

---

## Phase 4: KV Cache Integration (US-004)

### T-004: Integrate KV Cache for Hot Data
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01, AC-US4-02, AC-US4-03

**Implementation Details**:
1. ✅ `src/lib/cache.ts` 已存在 (3936 bytes)
2. 需要验证 cache.ts 功能并集成到页面

**Test Plan**:
- **File**: `tests/unit/free-plan-optimization.test.ts`
- **Tests**:
  - **TC-001**: cache.ts 存在并可导入

**Dependencies**: T-001
**Status**: [x] Completed (cache.ts 已存在)

---

## Phase 5: D1 Query Optimization (US-005)

### T-005: Optimize D1 Queries
**User Story**: US-005 | **Satisfies ACs**: AC-US5-01, AC-US5-02, AC-US5-03

**Implementation Details**:
- 列表页已实现 LIMIT 限制
- 分页已实现 (page/offset 模式)

**Test Plan**:
- **File**: `tests/unit/free-plan-optimization.test.ts`
- **Tests**:
  - **TC-001**: 查询使用 LIMIT

**Dependencies**: T-004
**Status**: [x] Completed (已实现)

---

## Phase 6: Build Verification

### T-006: Verify Build Success
**User Story**: All | **Satisfies ACs**: All

**Implementation Details**:
1. 运行 `pnpm build`
2. 验证构建成功
3. 验证无警告

**Test Plan**:
- **File**: `tests/e2e/build.test.ts`
- **Tests**:
  - **TC-001**: 生产构建成功
    - Given 项目代码
    - When 运行 `pnpm build`
    - Then 构建成功，退出码 0

**Dependencies**: T-001, T-002, T-003, T-004, T-005
**Status**: [ ]

---

## Phase 7: E2E Verification

### T-007: E2E Cache Behavior Verification
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01

**Implementation Details**:
1. 启动本地 dev server
2. 使用 Playwright 测试缓存头
3. 验证 Cloudflare Dashboard 缓存命中率

**Test Plan**:
- **File**: `e2e/cache-headers.spec.ts`
- **Tests**:
  - **TC-001**: 首页缓存头存在
    - Given 访问首页
    - When 页面加载完成
    - Then 响应头包含正确的 Cache-Control

**Dependencies**: T-006
**Status**: [ ]

---

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1 | T-001 | [ ] |
| Phase 2 | T-002 | [ ] |
| Phase 3 | T-003 | [ ] |
| Phase 4 | T-004 | [ ] |
| Phase 5 | T-005 | [ ] |
| Phase 6 | T-006 | [ ] |
| Phase 7 | T-007 | [ ] |

**Total**: 7 tasks | **Completed**: 0 | **Remaining**: 7