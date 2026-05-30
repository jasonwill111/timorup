# Plan: 0077-test-config-fixes

## Overview
修复 4 个测试/配置问题，使测试套件完全可运行。

## Architecture

### 涉及文件
| 文件 | 修改内容 |
|------|----------|
| `src/__tests__/setup/vitest-setup.ts` | 添加 `astro:actions` mock |
| `playwright.config.ts` | 修正 baseURL 端口 |
| `src/pages/api/businesses/index.ts` | 修复分类参数解析 |
| `src/middleware.ts` | 添加 CSP header |

### Mock 架构 (Vitest)
```
vitest-setup.ts
├── vi.mock('astro:actions')
│   └── defineAction → 返回 { handler: vi.fn() }
├── vi.mock('cloudflare:workers')
│   └── env → { DB: mockD1, SESSION: mockKV }
├── vi.mock('@/lib/auth')
│   └── initAuth → 返回 mock Auth instance
└── vi.mock('@/lib/db')
    └── getDb → 返回 mock drizzle
```

## Design

### 1. Vitest astro:actions Mock
```typescript
// src/__tests__/setup/vitest-setup.ts
vi.mock('astro:actions', () => ({
  defineAction: (config) => ({
    ...config,
    handler: vi.fn(config.handler),
  }),
}));
```

### 2. E2E Port Strategy
选择: **统一使用 8787** (wrangler dev 默认端口)
- 修改 `playwright.config.ts`: `baseURL: 'http://localhost:8787'`
- 添加 `.env.e2e`: `E2E_BASE_URL=http://localhost:8787`

### 3. API JSON 解析 Bug
错误信息: `"Unexpected token 'r', \"rice,agric\"... is not valid JSON"`
根因: 分类参数可能包含逗号字符串，未正确解析
修复: 检查 `src/pages/api/businesses/index.ts` 的 `category` 参数处理

### 4. CSP Header
```typescript
// src/middleware.ts
const CSP = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline'",
  'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
  'font-src': "'self' https://fonts.gstatic.com",
  'img-src': "'self' data: https:",
  'connect-src': "'self'",
};
```

## Implementation Phases

### Phase 1: Vitest Fix
1. 添加 `astro:actions` mock
2. 添加 `import.meta.env` mock
3. 验证 393 tests 通过

### Phase 2: E2E Fix
1. 更新 playwright.config.ts
2. 运行 auth-flow.spec.ts

### Phase 3: API Fix
1. 调查 JSON 解析错误
2. 修复分类参数处理
3. 验证 API 返回正确

### Phase 4: CSP Fix
1. 添加 CSP headers
2. 测试页面功能正常

## Testing Strategy

| 阶段 | 测试命令 | 验证 |
|------|----------|------|
| Vitest | `npx vitest run` | 393/393 通过 |
| E2E | `npx playwright test` | 无连接错误 |
| API | `curl /api/businesses` | `success: true` |
| CSP | 检查响应头 | CSP header 存在 |

## Rationale

1. **Vitest mock 方案**: Astro actions 是构建时虚拟模块，需要显式 mock
2. **端口选择 8787**: 匹配 wrangler dev 默认，避免修改 astro.config
3. **API 修复**: 需实际调试确认根因
4. **CSP 宽松配置**: 允许 unsafe-inline 因 Tailwind 使用内联样式
