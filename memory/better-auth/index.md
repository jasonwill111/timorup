# better-auth (timorlist)

> v1.5.3 | Drizzle Adapter | Session-based

## 核心概念

| 术语 | 说明 |
|------|------|
| `better-auth` | 服务端核心 |
| `better-auth/client` | 浏览器客户端 |
| `DrizzleAdapter` | Drizzle ORM 适配器 |
| Session Token | Cookie-based session |

## Setup

```typescript
// src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { db } from './db';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update every day
  },
});
```

## API Methods

```typescript
// 获取当前 session
const session = await auth.api.getSession({
  headers: request.headers,
});

// 登出
await auth.api.signOut({
  headers: { cookie: request.headers.get('cookie') },
});
```

## Middleware 保护

```typescript
// src/middleware.ts
import { auth } from '@/lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  // 检查 session
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });
  
  if (!session) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/login' },
    });
  }
  
  return next();
});
```

## 登录流程

```typescript
// POST /api/auth/sign-in
const result = await auth.api.signIn.emailPassword({
  body: { email, password },
  headers: request.headers,
});
```

## 注册流程

```typescript
// POST /api/auth/sign-up
const result = await auth.api.signUp.emailPassword({
  body: { email, password, name },
  headers: request.headers,
});
```

## 测试 Mock

```typescript
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));
```
