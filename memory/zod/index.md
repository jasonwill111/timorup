# Zod v4 (timorlist)

> v4.3.6 | TypeScript-first validation

## 基本用法

```typescript
import * as z from 'zod';

// 定义 schema
const UserSchema = z.object({
  email: z.email({ error: 'Invalid email' }),
  name: z.string().min(1),
  age: z.number().int().min(0).optional(),
});

// 解析
const result = UserSchema.safeParse(data);
if (result.success) {
  const user = result.data;
} else {
  const errors = result.error.issues;
}
```

## v4 Breaking Changes

| v3 | v4 |
|----|-----|
| `z.string().email()` | `z.email()` |
| `z.string().url()` | `z.url()` |
| `z.string().uuid()` | `z.uuidv4()` |
| `message: '...'` | `{ error: '...' }` |

## 常见 Schema

```typescript
// 邮箱
z.email({ error: 'Invalid email' })

// URL
z.url({ error: 'Must be valid URL' })

// UUID
z.uuidv4()

// 枚举
z.enum(['business', 'government', 'nonprofit'])

// 可选字符串
z.string().min(1).optional()

// 数字范围
z.number().int().min(0).max(100)
```

## 表单验证

```typescript
const CreateBusinessSchema = z.object({
  title: z.string().min(1, { error: 'Title required' }),
  slug: z.string().min(1, { error: 'Slug required' }),
  entityType: z.enum(['business', 'government', 'nonprofit']),
  email: z.email().optional(),
});

// 在 handler 中
const data = CreateBusinessSchema.safeParse(body);
if (!data.success) {
  return new Response(JSON.stringify({
    success: false,
    error: { code: 'VALIDATION_ERROR', message: data.error.message }
  }), { status: 400 });
}
```

## 类型推断

```typescript
type User = z.infer<typeof UserSchema>;
// { email: string; name: string; age?: number }
```

## 错误处理

```typescript
import { z } from 'zod';

// 展平错误
const flat = z.flattenError(result.error);
// { formErrors: [], fieldErrors: { email: ['Invalid email'] } }

// 美化错误
const pretty = z.prettifyError(result.error);
// "✖ Invalid email"
```
