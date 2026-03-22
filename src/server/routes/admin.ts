// Admin API Routes
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from '@/lib/db';
import { users, businessPages, orders, categories, siteSettings, reviews } from '@/db/schema';
import { eq, desc, and, like, or, sql } from 'drizzle-orm';

const adminApp = new Hono();

adminApp.use('/*', cors());

// Middleware to check admin role (simplified - add proper auth in production)
adminApp.use('/*', async (c, next) => {
  // TODO: Add proper admin authentication
  // For now, we'll check a header or skip
  await next();
});

// ===== AUTH =====

// Admin login
adminApp.post('/auth/login', async (c) => {
  const body = await c.req.json();
  const { email, password } = body;
  
  if (!email || !password) {
    return c.json({ success: false, error: { code: 'MISSING_PARAMS', message: 'Email and password are required' } }, 400);
  }
  
  try {
    // Find user by email
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (!user) {
      return c.json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } }, 401);
    }
    
    // Check if user has admin role
    if (user.role !== 'admin') {
      return c.json({ success: false, error: { code: 'NOT_ADMIN', message: 'You do not have admin access' } }, 403);
    }
    
    // For demo purposes, accept any password - in production, use proper password hashing
    // In production: const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (password.length < 4) {
      return c.json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } }, 401);
    }
    
    // Create session token (simplified - use proper JWT in production)
    const session = {
      userId: user.id,
      email: user.email,
      role: user.role,
      createdAt: new Date().toISOString(),
    };
    
    // Return user data
    const userData = user;
    
    return c.json({
      success: true,
      session,
      user: userData,
    });
  } catch (error: any) {
    console.error('Error during admin login:', error);
    return c.json({ success: false, error: { code: 'LOGIN_ERROR', message: error.message } }, 500);
  }
});

// Dashboard stats
adminApp.get('/stats', async (c) => {
  try {
    const [
      totalUsers,
      totalBusinesses,
      totalOrders,
      totalRevenue,
      recentOrders,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(businessPages),
      db.select({ count: sql<number>`count(*)` }).from(orders),
      db.select({ total: sql<number>`sum(amount)` }).from(orders).where(eq(orders.status, 'paid')),
      db.select({
        id: orders.id,
        businessPageId: orders.businessPageId,
        planType: orders.planType,
        amount: orders.amount,
        status: orders.status,
        createdAt: orders.createdAt,
      })
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(5),
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
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// ===== USERS =====

// Get all users
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
      id: users.id,
      email: users.email,
      name: users.name,
      phone: users.phone,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(whereCondition)
    .orderBy(desc(users.createdAt))
    .limit(parseInt(limit))
    .offset(offset);
    
    return c.json({ success: true, data: allUsers });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Update user role
adminApp.put('/users/:id/role', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { role } = body;
  
  if (!['user', 'editor', 'admin'].includes(role)) {
    return c.json({ success: false, error: { code: 'INVALID_ROLE', message: 'Invalid role' } }, 400);
  }
  
  try {
    const [updated] = await db.update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    if (!updated) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } }, 404);
    }
    
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } }, 500);
  }
});

// Update user
adminApp.put('/users/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { name, email, phone } = body;
  
  try {
    const [updated] = await db.update(users)
      .set({ 
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        updatedAt: new Date() 
      })
      .where(eq(users.id, id))
      .returning();
    
    if (!updated) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } }, 404);
    }
    
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } }, 500);
  }
});

// Delete user
adminApp.delete('/users/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    // Delete user's business pages first
    await db.delete(businessPages).where(eq(businessPages.ownerId, id));
    // Delete user's orders
    await db.delete(orders).where(eq(orders.userId, id));
    // Delete user's reviews
    await db.delete(reviews).where(eq(reviews.userId, id));
    // Delete user
    await db.delete(users).where(eq(users.id, id));
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return c.json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } }, 500);
  }
});

// ===== BUSINESSES =====

// Get all businesses
adminApp.get('/businesses', async (c) => {
  const { page = '1', limit = '20', status = '', search = '' } = c.req.query();
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  try {
    let conditions = [];
    if (status) {
      conditions.push(eq(businessPages.status, status));
    }
    if (search) {
      conditions.push(like(businessPages.title, `%${search}%`));
    }
    
    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;
    
    const allBusinesses = await db.select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      ownerId: businessPages.ownerId,
      status: businessPages.status,
      planType: businessPages.planType,
      createdAt: businessPages.createdAt,
    })
    .from(businessPages)
    .where(whereCondition)
    .orderBy(desc(businessPages.createdAt))
    .limit(parseInt(limit))
    .offset(offset);
    
    return c.json({ success: true, data: allBusinesses });
  } catch (error: any) {
    console.error('Error fetching businesses:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Update business status
adminApp.put('/businesses/:id/status', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { status } = body;
  
  if (!['draft', 'live', 'expired', 'paid'].includes(status)) {
    return c.json({ success: false, error: { code: 'INVALID_STATUS', message: 'Invalid status' } }, 400);
  }
  
  try {
    const [updated] = await db.update(businessPages)
      .set({ status, updatedAt: new Date() })
      .where(eq(businessPages.id, id))
      .returning();
    
    if (!updated) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Business not found' } }, 404);
    }
    
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating business status:', error);
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } }, 500);
  }
});

// Delete business
adminApp.delete('/businesses/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    await db.delete(businessPages).where(eq(businessPages.id, id));
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting business:', error);
    return c.json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } }, 500);
  }
});

// ===== ORDERS =====

// Get all orders
adminApp.get('/orders', async (c) => {
  const { page = '1', limit = '20', status = '' } = c.req.query();
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  try {
    let whereCondition;
    if (status) {
      whereCondition = eq(orders.status, status);
    }
    
    const allOrders = await db.select({
      id: orders.id,
      businessPageId: orders.businessPageId,
      userId: orders.userId,
      planType: orders.planType,
      amount: orders.amount,
      status: orders.status,
      expiryDate: orders.expiryDate,
      paidDate: orders.paidDate,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(whereCondition)
    .orderBy(desc(orders.createdAt))
    .limit(parseInt(limit))
    .offset(offset);
    
    return c.json({ success: true, data: allOrders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Confirm payment (update order status)
adminApp.put('/orders/:id/confirm', async (c) => {
  const id = c.req.param('id');
  
  try {
    // Get order details
    const order = await db.select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);
    
    if (order.length === 0) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } }, 404);
    }
    
    const orderData = order[0];
    const planType = orderData.planType;
    
    // Calculate expiry
    const expiry = new Date();
    if (planType === 'monthly') {
      expiry.setMonth(expiry.getMonth() + 1);
    } else {
      expiry.setFullYear(expiry.getFullYear() + 1);
    }
    
    // Update order
    const [updated] = await db.update(orders)
      .set({
        status: 'paid',
        paidDate: new Date(),
        expiryDate: expiry,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();
    
    // Update business page
    await db.update(businessPages)
      .set({
        status: 'paid',
        expiryDate: expiry,
        updatedAt: new Date(),
      })
      .where(eq(businessPages.id, orderData.businessPageId));
    
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error confirming order:', error);
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } }, 500);
  }
});

// ===== CATEGORIES =====

// Get all categories
adminApp.get('/categories', async (c) => {
  try {
    const allCategories = await db.select()
      .from(categories)
      .orderBy(categories.name);
    
    return c.json({ success: true, data: allCategories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Create category
adminApp.post('/categories', async (c) => {
  const body = await c.req.json();
  const { name, slug, description, parentId } = body;
  
  if (!name || !slug) {
    return c.json({ success: false, error: { code: 'MISSING_PARAMS', message: 'name and slug are required' } }, 400);
  }
  
  try {
    const [created] = await db.insert(categories).values({
      id: crypto.randomUUID(),
      name,
      slug,
      description,
      parentId,
    }).returning();
    
    return c.json({ success: true, data: created }, 201);
  } catch (error: any) {
    console.error('Error creating category:', error);
    return c.json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } }, 500);
  }
});

// Update category
adminApp.put('/categories/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { name, description, parentId } = body;
  
  try {
    const [updated] = await db.update(categories)
      .set({
        name: name || undefined,
        description: description || undefined,
        parentId: parentId || undefined,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();
    
    if (!updated) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } }, 404);
    }
    
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } }, 500);
  }
});

// Delete category
adminApp.delete('/categories/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    await db.delete(categories).where(eq(categories.id, id));
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return c.json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } }, 500);
  }
});

// ===== SITE SETTINGS =====

// Get all settings
adminApp.get('/settings', async (c) => {
  try {
    const allSettings = await db.select().from(siteSettings);
    
    const settings: Record<string, any> = {};
    for (const s of allSettings) {
      try {
        settings[s.key] = JSON.parse(s.value || '{}');
      } catch {
        settings[s.key] = s.value;
      }
    }
    
    return c.json({ success: true, data: settings });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Save all settings at once (POST workaround for dynamic route issue)
adminApp.post('/settings/save', async (c) => {
  try {
    const body = await c.req.json();
    const { settings } = body;
    
    if (!settings || typeof settings !== 'object') {
      return c.json({ success: false, error: { code: 'INVALID_BODY', message: 'Settings object is required' } }, 400);
    }
    
    for (const [key, valueObj] of Object.entries(settings)) {
      const value = typeof valueObj === 'object' && valueObj !== null 
        ? JSON.stringify(valueObj) 
        : String(valueObj);
      
      // Check if exists
      const existing = await db.select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);
      
      if (existing.length > 0) {
        await db.update(siteSettings)
          .set({ value, updatedAt: new Date() })
          .where(eq(siteSettings.key, key));
      } else {
        await db.insert(siteSettings)
          .values({ id: key, key, value });
      }
    }
    
    return c.json({ success: true, message: 'Settings saved successfully' });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return c.json({ success: false, error: { code: 'SAVE_ERROR', message: error.message } }, 500);
  }
});

// ===== REVIEWS =====

// Get all reviews
adminApp.get('/reviews', async (c) => {
  const { page = '1', limit = '20' } = c.req.query();
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  try {
    const allReviews = await db.select({
      id: reviews.id,
      businessPageId: reviews.businessPageId,
      userId: reviews.userId,
      rating: reviews.rating,
      comment: reviews.comment,
      isEdited: reviews.isEdited,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .orderBy(desc(reviews.createdAt))
    .limit(parseInt(limit))
    .offset(offset);
    
    return c.json({ success: true, data: allReviews });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Delete review
adminApp.delete('/reviews/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    await db.delete(reviews).where(eq(reviews.id, id));
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return c.json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } }, 500);
  }
});

export default adminApp;
