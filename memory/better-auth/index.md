# better-auth (timorlist)

> v1.6.9 | Drizzle Adapter | Session-based | Lazy Init

## 核心概念

| 术语 | 说明 |
|------|------|
| `better-auth` | 服务端核心 |
| `better-auth/client` | 浏览器客户端 |
| `DrizzleAdapter` | Drizzle ORM 适配器 |
| Session Token | Cookie-based session (better-auth.session_token) |

## 懒初始化模式

```typescript
// src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import type { BetterAuthInstance } from 'better-auth';
import { getDb } from './db';

// 初始 stub（避免模块加载时调用 getDb）
export const auth = {
  api: {
    getSession: async () => ({ user: null, session: null }),
    signInEmail: async () => { throw new Error('Auth not initialized'); },
    signOut: async () => ({}),
    signUpEmail: async () => { throw new Error('Auth not initialized'); },
  }
} as unknown as BetterAuthInstance;

let _initAuth: BetterAuthInstance | null = null;

export async function initAuth(): Promise<BetterAuthInstance> {
  if (!_initAuth) {
    const db = await getDb();
    _initAuth = betterAuth({
      database: drizzleAdapter(db, {
        provider: 'sqlite',
      }),
      emailAndPassword: { enabled: true },
      session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24,
      },
    });
  }
  return _initAuth;
}
```

## Admin API 认证（直接 D1 查询）

```typescript
// src/pages/api/admin/stats.ts
import { getDb } from '@/lib/db';
import { sessions, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function requireAdminAuth(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) return { authorized: false, error: new Response(...) };

  const db = await getDb();
  const session = await db.select()
    .from(sessions)
    .where(eq(sessions.token, tokenMatch[1]))
    .limit(1)
    .get();

  if (!session || !session.expiresAt || new Date(session.expiresAt) < new Date()) {
    return { authorized: false, error: new Response(...) };
  }

  const user = await db.select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1)
    .get();

  if (!user || user.role !== 'admin') {
    return { authorized: false, error: new Response(...) };
  }
  return { authorized: true, user };
}
```

## Cookie 名

- Session cookie: `better-auth.session_token`

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
