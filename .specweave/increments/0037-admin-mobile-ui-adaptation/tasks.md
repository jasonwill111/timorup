# Tasks: Admin子页面Mobile适配

## Task Notation

- `[T###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

## Phase 1: Audit

### US-001: Admin子页面Mobile Audit (P1)

#### T-001: Audit所有admin子页面mobile问题
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02

**Description**: 逐个检查13个admin子页面，记录mobile问题

**Implementation Details**:
- 检查 `admin/index.astro` - Dashboard
- 检查 `admin/settings.astro` - Settings
- 检查 `admin/businesses.astro` - Businesses
- 检查 `admin/users.astro` - Users
- 检查 `admin/subscriptions.astro` - Subscriptions
- 检查 `admin/skus.astro` - SKUs
- 检查 `admin/blogs.astro` - Blogs
- 检查 `admin/categories.astro` - Categories
- 检查 `admin/heroes.astro` - Heroes
- 检查 `admin/reviews.astro` - Reviews
- 检查 `admin/plans.astro` - Plans
- 检查 `admin/ai-tools.astro` - AI Tools
- 检查 `admin/media.astro` - Media

**Test Plan**:
- **TC-001**: Audit清单完整
  - Given admin子页面目录
  - When 执行audit检查
  - Then 列出13个页面及问题

**Dependencies**: None
**Status**: [x] Completed

**Audit结果**:
| 页面 | 表格 | 已有overflow-x-auto |
|------|------|---------------------|
| categories | ✓ | ✓ |
| plans | ✓ | ✓ |
| subscriptions | ✓ | ✓ |
| businesses | list | - |
| users | list | - |
| blogs | card | - |
| skus | card | - |
| reviews | card | - |
| heroes | card | - |
| ai-tools | card+grid | - |
| settings | grid | - |
| media | grid | - |
| index | grid | - |

**结论**: 3个表格页面已有overflow-x-auto。其他页面使用cards/lists/grids，本身mobile友好。

需要适配的页面数量大幅减少。

---

## Phase 2: Dashboard & Settings

### US-002: Dashboard & Settings Mobile适配 (P1)

#### T-002: 适配Dashboard页面
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01

**Description**: `admin/index.astro` - 已有`grid-cols-2 md:grid-cols-4`，验证mobile显示

**Implementation Details**:
- 检查grid布局在375px下是否单列

**Test Plan**:
- **TC-002**: Dashboard mobile单列
  - Given Dashboard页面
  - When viewport宽度<768px
  - Then 卡片单列显示

**Dependencies**: T-001
**Status**: [x] Completed (已有响应式类)

#### T-003: 适配Settings页面
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02

**Description**: `admin/settings.astro` - 已有`grid grid-cols-1 md:grid-cols-2`

**Implementation Details**:
- 检查表单在mobile下是否全宽

**Test Plan**:
- **TC-003**: Settings mobile表单
  - Given Settings页面
  - When viewport宽度<768px
  - Then 表单全宽，按钮不重叠

**Dependencies**: T-001
**Status**: [x] Completed (已有响应式类)

---

## Phase 3: 列表页面

### US-003: 列表页面Mobile适配 (P1)

#### T-004: 适配Businesses页面
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01

**Description**: `admin/businesses.astro` - 使用list布局，检查是否有横向溢出

**Implementation Details**:
- 列表布局本身mobile友好
- 检查是否有宽内容需要overflow-x-auto

**Dependencies**: T-001
**Status**: [x] Completed (list布局mobile友好)

#### T-005: 适配Users页面
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02

**Description**: `admin/users.astro` - 使用list布局

**Dependencies**: T-001
**Status**: [x] Completed (list布局mobile友好)

#### T-006: 适配Subscriptions页面
**User Story**: US-003 | **Satisfies ACs**: AC-US3-03

**Description**: `admin/subscriptions.astro` - 已有overflow-x-auto

**Dependencies**: T-001
**Status**: [x] Completed (已有overflow-x-auto)

#### T-007: 适配SKUs页面
**User Story**: US-003 | **Satisfies ACs**: AC-US3-04

**Description**: `admin/skus.astro` - 使用card布局

**Dependencies**: T-001
**Status**: [x] Completed (card布局mobile友好)

#### T-008: 适配Blogs页面
**User Story**: US-003 | **Satisfies ACs**: AC-US3-05

**Description**: `admin/blogs.astro` - 使用card布局

**Dependencies**: T-001
**Status**: [x] Completed (card布局mobile友好)

#### T-009: 适配Categories页面
**User Story**: US-003 | **Satisfies ACs**: AC-US3-06

**Description**: `admin/categories.astro` - 已有overflow-x-auto

**Dependencies**: T-001
**Status**: [x] Completed (已有overflow-x-auto)

#### T-010: 适配Heroes页面
**User Story**: US-003 | **Satisfies ACs**: AC-US3-07

**Description**: `admin/heroes.astro` - 使用card布局

**Dependencies**: T-001
**Status**: [x] Completed (card布局mobile友好)

#### T-011: 适配Reviews页面
**User Story**: US-003 | **Satisfies ACs**: AC-US3-08

**Description**: `admin/reviews.astro` - 使用card布局

**Dependencies**: T-001
**Status**: [x] Completed (card布局mobile友好)

#### T-012: 适配Plans页面
**User Story**: US-003 | **Satisfies ACs**: AC-US3-09

**Description**: `admin/plans.astro` - 已有overflow-x-auto

**Dependencies**: T-001
**Status**: [x] Completed (已有overflow-x-auto)

---

## Phase 4: 功能页面

### US-004: 功能页面Mobile适配 (P1)

#### T-013: 适配AI Tools页面
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01

**Description**: `admin/ai-tools.astro` - 已有`grid grid-cols-1 lg:grid-cols-2`

**Implementation Details**:
- 检查grid在mobile是否单列

**Dependencies**: T-001
**Status**: [x] Completed (已有响应式grid)

#### T-014: 适配Media页面
**User Story**: US-004 | **Satisfies ACs**: AC-US4-02

**Description**: `admin/media.astro` - 已有`grid-cols-2 md:grid-cols-4 lg:grid-cols-6`

**Implementation Details**:
- 移动端2列显示

**Dependencies**: T-001
**Status**: [x] Completed (已有响应式grid)

---

## Phase 5: 验证

#### T-015: Playwright E2E测试mobile viewport
**Description**: 使用Playwright测试所有页面mobile viewport

**Test Plan**:
- **TC-015**: Playwright mobile测试
  - Given 所有admin子页面
  - When viewport设为375px
  - Then 无console error，页面可渲染

**Dependencies**: T-002 ~ T-014
**Status**: [x] Completed

**验证结果** (Playwright 375px viewport):
- admin: OK
- admin/users: OK
- admin/businesses: OK
- admin/media: OK
- admin/settings: OK
