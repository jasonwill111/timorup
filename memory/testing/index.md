# Testing Strategy (timorlist)

## 测试金字塔

```
       /\
      /E2E\        ← Playwright (少量，关键路径)
     /------\
    /Integr. \     ← Vitest 集成测试 (中量)
   /----------\
  /  Unit Test  \  ← Vitest 单元测试 (大量)
 /______________\
```

## Vitest (单元/集成)

```bash
pnpm test           # 运行所有测试
pnpm test:coverage  # 带覆盖率
pnpm test:ui        # UI 界面
```

### Mock 模式

```typescript
// Mock db
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
  },
  getDb: vi.fn(),
}));

// Mock auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));
```

### 测试文件命名

```
src/
├── lib/auth.test.ts
└── pages/api/businesses/index.test.ts

tests/
├── fixtures/
└── e2e/
    └── business.spec.ts
```

## Playwright (E2E)

```bash
pnpm test:e2e           # headless
pnpm test:e2e:ui        # 有 UI
pnpm test:e2e:debug     # Debug 模式
```

### 启动 E2E 测试

```bash
# 1. Build
pnpm build

# 2. Start wrangler
npx wrangler dev dist/server/entry.mjs --local --persist-to=.wrangler/state &

# 3. Run
NODE_ENV=test pnpm test:e2e
```

## 验证报告模板

```markdown
## 验证报告
- [ ] pnpm build: ✅/❌
- [ ] curl localhost:8787: HTTP [状态码]
- [ ] 工具: [curl/playwright/kuri]
- [ ] 结果: ✅/❌
```

## CI/CD

```yaml
# GitHub Actions
- name: Test
  run: pnpm test

- name: E2E
  run: |
    pnpm build
    npx wrangler dev dist/server/entry.mjs --local &
    sleep 5
    pnpm test:e2e
```
