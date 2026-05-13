// Astro Middleware - Admin Authentication
import { defineMiddleware } from 'astro:middleware';
import { initAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const ADMIN_ROLES = ['admin', 'super_admin', 'editor'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, locals, redirect } = context;
  const pathname = url.pathname;

  // Only protect /admin routes (except login)
  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return next();
  }

  try {
    // Get SESSION KV from Cloudflare runtime env
    const runtimeEnv = (locals as { runtime?: { env?: { SESSION?: KVNamespace } } }).runtime?.env;
    const sessionKV = runtimeEnv?.SESSION;

    // Initialize auth with KV for session caching
    const auth = await initAuth({ SESSION: sessionKV });

    // Get session from Better Auth cookie
    const sessionToken = cookies.get('better-auth.session_token')?.value;

    if (!sessionToken) {
      return redirect('/admin/login', 302);
    }

    // Validate session with Better Auth
    const { user: authUser, session } = await auth.api.getSession({
      headers: {
        cookie: `better-auth.session_token=${sessionToken}`,
      },
    });

    if (!authUser || !session) {
      // Clear invalid cookie
      cookies.delete('better-auth.session_token', { path: '/' });
      return redirect('/admin/login', 302);
    }

    // Check session not expired
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      cookies.delete('better-auth.session_token', { path: '/' });
      return redirect('/admin/login', 302);
    }

    // Get user role from database
    const db = await getDb();
    const dbUser = await db.select({ role: users.role })
      .from(users)
      .where(eq(users.id, authUser.id))
      .limit(1)
      .get();

    const userRole = dbUser?.role || 'user';

    // Check admin role
    if (!ADMIN_ROLES.includes(userRole)) {
      return redirect('/admin/login', 302);
    }

    // Inject user into Astro.locals
    locals.user = {
      id: authUser.id,
      email: authUser.email,
      name: authUser.name,
      role: userRole,
    };
    locals.isAdmin = true;

    return next();
  } catch (error) {
    console.error('[Middleware] Auth error:', error);
    // On error, redirect to login
    return redirect('/admin/login', 302);
  }
});