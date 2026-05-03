# lib

**Path**: `src/lib`

## Purpose

Utility functions, constants, and shared business logic.

## Overview

The lib module contains 15 files with approximately 1,400 lines of code.

## Key Modules

| Module | Purpose |
|--------|---------|
| `auth.ts` | better-auth configuration |
| `db.ts` | Drizzle ORM D1 connection |
| `media.ts` | R2 upload, Cloudflare Images |
| `constants.ts` | Service types, specs, price units |
| `utils.ts` | Helper functions |

## ⚠️ CRITICAL: better-auth Password Hashing

**better-auth uses `@noble/hashes/scrypt`** — NOT Node.js `crypto.scrypt`.

| 实现 | 输出 | 用途 |
|------|------|------|
| `@noble/hashes/scrypt` | 64字节 (128 hex) | better-auth 内部 |
| `Node.js crypto.scrypt` | 128字节 (256 hex) | ❌ 不兼容 |

### Seed 脚本正确示例

```javascript
// seed-wrangler.cjs — 使用 better-auth 密码模块
const { hashPassword } = require('./node_modules/.pnpm/@better-auth+utils@0.4.0/node_modules/@better-auth/utils/dist/password.node.cjs');

const hash = await hashPassword('TestPassword123!');
db.prepare('INSERT INTO accounts ...').run(..., hash, now, now);
```

## Core Constants

```typescript
// Service types
const SERVICE_TYPES = ['product', 'service', 'rental', 'food',
  'accommodation', 'automotive', 'healthcare',
  'education', 'beauty', 'event']

// Industry specification fields
const SPECIFICATION_FIELDS: Record<string, FieldConfig[]>
```

## Patterns Used

- ESM imports
- Drizzle ORM with D1 adapter
- Cloudflare Workers bindings (env)

## Analysis Summary

- **Source Files**: 15
- **Test Files**: 2
- **Total Exports**: 20+

## Dependencies

- `better-auth` (auth)
- `drizzle-orm/d1` (DB)
- `@aws-sdk/*` (S3/R2)
- `zod` (validation)

---
*Updated 2026-04-30*