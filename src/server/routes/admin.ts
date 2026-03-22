// Admin API Routes — fully protected with better-auth sessions
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getCookie } from 'hono/cookie';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  users, businessPages, orders, categories, siteSettings, reviews
} from '@/db/schema';
import { eq, desc, and, like, or, sql } from 'drizzle-orm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authApi = (auth as any).api;

const adminApp = new Hono();

// ── Helpers ──────────────────────────────────────────────────────────────────

const getAllowedOrigins = () => {
  const appUrl = process.env.APP_URL || 'http://localhost:4321';
  const allowed = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [appUrl];
  return allowed;
};

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true; // allow server-to-server
  const allowed = getAllowedOrigins();
  if (allowed.includes(origin)) return true;
  if (origin.startsWith('http://localhost:')) return true;
  return false;
}

// In-memory rate limiter (per-IP for login endpoint)
// In production, use Cloudflare KV via env.CACHE
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RL_WINDOW_MS = 15 * 60 * 1000; // 15 min
const RL_MAX = 10; // max 10 login attempts per 15 min

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const rec = rateLimitMap.get(key);
  if (!rec || now > rec.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RL_WINDOW_MS });
    return true;
  }
  if (rec.count >= RL_MAX) return false;
  rec.count++;
  return true;
}

async function validateAdminSession(c: HonoContext) {
  // Try Bearer token first (Authorization header)
  const bearer = c.req.header('Authorization')?.replace('Bearer ', '');
  // Fall back to cookie
  const cookieToken = getCookie(c, 'better-auth.session_token');
  const token = bearer || cookieToken;
  if (!token) return null;

  try {
    const result = await authApi.getSession({
      headers: { cookie: `better-auth.session_token=${token}` },
    });
    if (!result?.user) return null;
    // Verify admin role from the user record in DB
    const [user] = await db.select().from(users).where(eq(users.id, result.user.id)).limit(1);
    if (!user || user.role !== 'admin') return null;
    return { user: result.user, session: result.session };
  } catch {
    return null;
  }
}

type HonoContext = Parameters<Parameters<typeof adminApp.use>[1]>[0];

// ── Middleware ─────────────────────────────────────────────────────────────────

adminApp.use('/*', cors({
  origin: (origin) => {
    if (!isOriginAllowed(origin)) return getAllowedOrigins()[0] || 'http://localhost:4321';
    return origin || '*';
  },
  credentials: true,
}));

// Protect all routes except /auth/login
adminApp.use('/*', async (c, next) => {
  // Skip auth for login endpoint
  if (c.req.path === '/auth/login') return next();

  const session = await validateAdminSession(c);
  if (!session) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } }, 401);
  }
  // Attach session to context locals for use in route handlers
  c.set('adminUser', session.user);
  c.set('adminSession', session.session);
  return next();
});

// ── AUTH ──────────────────────────────────────────────────────────────────────

// Admin login
adminApp.post('/auth/login', async (c) => {
  const ip = c.req.header('cf-connecting-ip')
    || c.req.header('x-forwarded-for')
    || 'unknown';

  if (!checkRateLimit(`admin:${ip}`)) {
    return c.json({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many login attempts. Please try again later.' }
    }, 429);
  }

  const body = await c.req.json();
  const { email, password } = body;

  if (!email || !password) {
    return c.json({ success: false, error: { code: 'MISSING_PARAMS', message: 'Email and password are required' } }, 400);
  }

  try {
    // Sign in via better-auth (handles password hashing / verification)
    let sessionToken: string;
    let adminUser: { id: string; name: string; email: string; role: string };

    try {
      const { user, session } = await authApi.signIn({
        body: { email, password },
      });
      sessionToken = session.token;
      adminUser = { id: user.id, name: user.name, email: user.email, role: user.role ?? 'user' };
    } catch (signInErr: unknown) {
      // better-auth throws on invalid credentials
      const msg = signInErr instanceof Error ? signInErr.message : String(signInErr);
      return c.json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      }, 401);
    }

    // Verify admin role in DB
    const [dbUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!dbUser || dbUser.role !== 'admin') {
      return c.json({
        success: false,
        error: { code: 'NOT_ADMIN', message: 'You do not have admin access' }
      }, 403);
    }

    return c.json({
      success: true,
      session: { id: sessionToken },
      user: adminUser,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login error';
    return c.json({ success: false, error: { code: 'LOGIN_ERROR', message } }, 500);
  }
});

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

adminApp.get('/stats', async (c) => {
  try {
    const [totalUsers, totalBusinesses, totalOrders, totalRevenue, recentOrders] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(businessPages),
      db.select({ count: sql<number>`count(*)` }).from(orders),
      db.select({ total: sql<number>`sum(amount)` }).from(orders).where(eq(orders.status, 'paid')),
      db.select({
        id: orders.id, businessPageId: orders.businessPageId,
        planType: orders.planType, amount: orders.amount,
        status: orders.status, createdAt: orders.createdAt,
      }).from(orders).orderBy(desc(orders.createdAt)).limit(5),
    ]);

    return c.json({
      success: true,
      data: {
        totalUsers: totalUsers[0]?.count || 0,
        totalBusinesses: totalBusinesses[0]?.count || 0,
        totalOrders: totalOrders[0]?.count || 0,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders,
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fetch error';
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message } }, 500);
  }
});

// ── USERS ──────────────────────────────────────────────────────────────────────

adminApp.get('/users', async (c) => {
  const { page = '1', limit = '20', search = '' } = c.req.query();
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    let whereCondition;
    if (search) {
      whereCondition = or(
        like(users.name, `%${search}%`),
        like(users.email, `%${search}%`),
        like(users.phone, `%${search}%`)
      );
    }

    const allUsers = await db.select({
      id: users.id, email: users.email, name: users.name,
      phone: users.phone, role: users.role, createdAt: users.createdAt,
    }).from(users).where(whereCondition)
      .orderBy(desc(users.createdAt))
      .limit(parseInt(limit)).offset(offset);

    return c.json({ success: true, data: allUsers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fetch error';
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message } }, 500);
  }
});

adminApp.put('/users/:id/role', async (c) => {
  const id = c.req.param('id');
  const { role } = await c.req.json();

  if (!['user', 'editor', 'admin'].includes(role)) {
    return c.json({ success: false, error: { code: 'INVALID_ROLE', message: 'Invalid role' } }, 400);
  }

  try {
    const [updated] = await db.update(users)
      .set({ role, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    if (!updated) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } }, 404);
    return c.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update error';
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message } }, 500);
  }
});

adminApp.put('/users/:id', async (c) => {
  const id = c.req.param('id');
  const { name, email, phone } = await c.req.json();

  try {
    const [updated] = await db.update(users)
      .set({ name, email, phone, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    if (!updated) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } }, 404);
    return c.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update error';
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message } }, 500);
  }
});

adminApp.delete('/users/:id', async (c) => {
  const id = c.req.param('id');
  try {
    await db.delete(businessPages).where(eq(businessPages.ownerId, id));
    await db.delete(orders).where(eq(orders.userId, id));
    await db.delete(reviews).where(eq(reviews.userId, id));
    await db.delete(users).where(eq(users.id, id));
    return c.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Delete error';
    return c.json({ success: false, error: { code: 'DELETE_ERROR', message } }, 500);
  }
});

// ── BUSINESSES ─────────────────────────────────────────────────────────────────

adminApp.get('/businesses', async (c) => {
  const { page = '1', limit = '20', status = '', search = '' } = c.req.query();
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const conditions = [];
    if (status) conditions.push(eq(businessPages.status, status));
    if (search) conditions.push(like(businessPages.title, `%${search}%`));
    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    const all = await db.select({
      id: businessPages.id, title: businessPages.title, slug: businessPages.slug,
      ownerId: businessPages.ownerId, status: businessPages.status,
      planType: businessPages.planType, createdAt: businessPages.createdAt,
    }).from(businessPages).where(whereCondition)
      .orderBy(desc(businessPages.createdAt))
      .limit(parseInt(limit)).offset(offset);

    return c.json({ success: true, data: all });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fetch error';
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message } }, 500);
  }
});

adminApp.put('/businesses/:id/status', async (c) => {
  const id = c.req.param('id');
  const { status } = await c.req.json();

  if (!['draft', 'live', 'expired', 'paid'].includes(status)) {
    return c.json({ success: false, error: { code: 'INVALID_STATUS', message: 'Invalid status' } }, 400);
  }

  try {
    const [updated] = await db.update(businessPages)
      .set({ status, updatedAt: new Date() }).where(eq(businessPages.id, id)).returning();
    if (!updated) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Business not found' } }, 404);
    return c.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update error';
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message } }, 500);
  }
});

adminApp.delete('/businesses/:id', async (c) => {
  const id = c.req.param('id');
  try {
    await db.delete(businessPages).where(eq(businessPages.id, id));
    return c.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Delete error';
    return c.json({ success: false, error: { code: 'DELETE_ERROR', message } }, 500);
  }
});

// ── ORDERS ────────────────────────────────────────────────────────────────────

adminApp.get('/orders', async (c) => {
  const { page = '1', limit = '20', status = '' } = c.req.query();
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const whereCondition = status ? eq(orders.status, status) : undefined;
    const all = await db.select({
      id: orders.id, businessPageId: orders.businessPageId, userId: orders.userId,
      planType: orders.planType, amount: orders.amount, status: orders.status,
      expiryDate: orders.expiryDate, paidDate: orders.paidDate, createdAt: orders.createdAt,
    }).from(orders).where(whereCondition)
      .orderBy(desc(orders.createdAt))
      .limit(parseInt(limit)).offset(offset);

    return c.json({ success: true, data: all });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fetch error';
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message } }, 500);
  }
});

adminApp.put('/orders/:id/confirm', async (c) => {
  const id = c.req.param('id');

  try {
    const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!order) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } }, 404);

    const expiry = new Date();
    if (order.planType === 'monthly') expiry.setMonth(expiry.getMonth() + 1);
    else expiry.setFullYear(expiry.getFullYear() + 1);

    const [updated] = await db.update(orders)
      .set({ status: 'paid', paidDate: new Date(), expiryDate: expiry, updatedAt: new Date() })
      .where(eq(orders.id, id)).returning();

    await db.update(businessPages)
      .set({ status: 'paid', expiryDate: expiry, updatedAt: new Date() })
      .where(eq(businessPages.id, order.businessPageId));

    return c.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update error';
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message } }, 500);
  }
});

// ── CATEGORIES ─────────────────────────────────────────────────────────────────

adminApp.get('/categories', async (c) => {
  try {
    const all = await db.select().from(categories).orderBy(categories.name);
    return c.json({ success: true, data: all });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fetch error';
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message } }, 500);
  }
});

adminApp.post('/categories', async (c) => {
  const { name, slug, description, parentId } = await c.req.json();
  if (!name || !slug) return c.json({ success: false, error: { code: 'MISSING_PARAMS', message: 'name and slug required' } }, 400);

  try {
    const [created] = await db.insert(categories).values({
      id: crypto.randomUUID(), name, slug, description, parentId,
    }).returning();
    return c.json({ success: true, data: created }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Create error';
    return c.json({ success: false, error: { code: 'CREATE_ERROR', message } }, 500);
  }
});

adminApp.put('/categories/:id', async (c) => {
  const id = c.req.param('id');
  const { name, description, parentId } = await c.req.json();

  try {
    const [updated] = await db.update(categories)
      .set({ name, description, parentId, updatedAt: new Date() })
      .where(eq(categories.id, id)).returning();
    if (!updated) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } }, 404);
    return c.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update error';
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message } }, 500);
  }
});

adminApp.delete('/categories/:id', async (c) => {
  const id = c.req.param('id');
  try {
    await db.delete(categories).where(eq(categories.id, id));
    return c.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Delete error';
    return c.json({ success: false, error: { code: 'DELETE_ERROR', message } }, 500);
  }
});

// ── SITE SETTINGS ───────────────────────────────────────────────────────────────

adminApp.get('/settings', async (c) => {
  try {
    const all = await db.select().from(siteSettings);
    const settings: Record<string, unknown> = {};
    for (const s of all) {
      try { settings[s.key] = JSON.parse(s.value || '{}'); }
      catch { settings[s.key] = s.value; }
    }
    return c.json({ success: true, data: settings });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fetch error';
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message } }, 500);
  }
});

adminApp.post('/settings/save', async (c) => {
  try {
    const { settings } = await c.req.json();
    if (!settings || typeof settings !== 'object') {
      return c.json({ success: false, error: { code: 'INVALID_BODY', message: 'settings object required' } }, 400);
    }

    for (const [key, valueObj] of Object.entries(settings)) {
      const value = typeof valueObj === 'object' && valueObj !== null
        ? JSON.stringify(valueObj) : String(valueObj);
      const [existing] = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
      if (existing) {
        await db.update(siteSettings).set({ value, updatedAt: new Date() }).where(eq(siteSettings.key, key));
      } else {
        await db.insert(siteSettings).values({ id: key, key, value });
      }
    }
    return c.json({ success: true, message: 'Settings saved' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Save error';
    return c.json({ success: false, error: { code: 'SAVE_ERROR', message } }, 500);
  }
});

// ── REVIEWS ────────────────────────────────────────────────────────────────────

adminApp.get('/reviews', async (c) => {
  const { page = '1', limit = '20' } = c.req.query();
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const all = await db.select({
      id: reviews.id, businessPageId: reviews.businessPageId,
      userId: reviews.userId, rating: reviews.rating,
      comment: reviews.comment, isEdited: reviews.isEdited, createdAt: reviews.createdAt,
    }).from(reviews).orderBy(desc(reviews.createdAt))
      .limit(parseInt(limit)).offset(offset);

    return c.json({ success: true, data: all });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fetch error';
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message } }, 500);
  }
});

adminApp.delete('/reviews/:id', async (c) => {
  const id = c.req.param('id');
  try {
    await db.delete(reviews).where(eq(reviews.id, id));
    return c.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Delete error';
    return c.json({ success: false, error: { code: 'DELETE_ERROR', message } }, 500);
  }
});

export default adminApp;
