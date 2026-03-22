// Business Pages API Routes
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getCookie } from 'hono/cookie';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { businessPages, categories, media, users } from '@/db/schema';
import { eq, desc, like, and, or, sql } from 'drizzle-orm';

const businessesApp = new Hono();

// CORS
businessesApp.use('/*', cors({
  origin: '*',
  credentials: true,
}));

// Helper function to get current user from session
async function getCurrentUser(c: any) {
  const token = getCookie(c, 'better-auth.session_token');
  if (!token) return null;
  
  try {
    const session = await auth.api.getSession({
      headers: {
        cookie: `better-auth.session_token=${token}`,
      },
    });
    return session?.user || null;
  } catch {
    return null;
  }
}

// Helper function to check if user is admin
async function isAdmin(c: any) {
  const user = await getCurrentUser(c);
  if (!user) return false;
  
  // Check if user has admin role
  const [dbUser] = await db.select()
    .from(users)
    .where(eq(users.email, user.email))
    .limit(1);
  
  return dbUser?.id === user.id; // In a real app, you'd have a role field
}

// Get all businesses (with pagination, search, filter)
businessesApp.get('/', async (c) => {
  const { 
    page = '1', 
    limit = '12', 
    search = '', 
    category = '',
    sort = 'recent' 
  } = c.req.query();
  
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  try {
    let whereCondition = and(
      // Only show live/paid businesses
      or(
        eq(businessPages.status, 'live'),
        eq(businessPages.status, 'paid')
      )
    );
    
    // Add search filter
    if (search) {
      whereCondition = and(
        whereCondition,
        or(
          like(businessPages.title, `%${search}%`),
          like(businessPages.tags, `%${search}%`)
        )
      );
    }
    
    // Add category filter
    if (category) {
      whereCondition = and(
        whereCondition,
        eq(businessPages.categoryId, category)
      );
    }
    
    // Add sorting
    let orderBy = [desc(businessPages.updatedAt)];
    if (sort === 'popular') {
      orderBy = [
        sql`(${businessPages.saves} * 3 + ${businessPages.likes} + ${businessPages.views} * 0.01) DESC`
      ];
    } else if (sort === 'rating') {
      orderBy = [desc(businessPages.ratingAverage)];
    } else if (sort === 'name') {
      orderBy = [businessPages.title];
    }
    
    const businesses = await db.select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      status: businessPages.status,
      bannerImageId: businessPages.bannerImageId,
      profileImageId: businessPages.profileImageId,
      categoryId: businessPages.categoryId,
      contactName: businessPages.contactName,
      contactNumber: businessPages.contactNumber,
      email: businessPages.email,
      address: businessPages.address,
      tags: businessPages.tags,
      likes: businessPages.likes,
      saves: businessPages.saves,
      ratingAverage: businessPages.ratingAverage,
      ratingCount: businessPages.ratingCount,
      views: businessPages.views,
      updatedAt: businessPages.updatedAt,
    })
    .from(businessPages)
    .leftJoin(categories, eq(businessPages.categoryId, categories.id))
    .where(whereCondition)
    .orderBy(...orderBy)
    .limit(parseInt(limit))
    .offset(offset);
    
    // Map category name
    const businessesWithCategory = businesses.map((b: any) => ({
      ...b,
      categoryName: b.category_id ? b.category_id?.name || null : null,
    }));
    
    const total = await db.select({ count: sql<number>`count(*)` })
      .from(businessPages)
      .where(whereCondition);
    
    return c.json({
      success: true,
      data: businessesWithCategory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total[0].count,
        totalPages: Math.ceil(total[0].count / parseInt(limit)),
      },
    });
  } catch (error: any) {
    console.error('Error fetching businesses:', error);
    return c.json({
      success: false,
      error: { code: 'FETCH_ERROR', message: error.message }
    }, 500);
  }
});

// Get featured businesses (for homepage)
businessesApp.get('/featured', async (c) => {
  try {
    const businesses = await db.select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      status: businessPages.status,
      bannerImageId: businessPages.bannerImageId,
      profileImageId: businessPages.profileImageId,
      categoryId: businessPages.categoryId,
      tags: businessPages.tags,
      likes: businessPages.likes,
      saves: businessPages.saves,
      ratingAverage: businessPages.ratingAverage,
      ratingCount: businessPages.ratingCount,
    })
    .from(businessPages)
    .leftJoin(categories, eq(businessPages.categoryId, categories.id))
    .where(
      or(
        eq(businessPages.status, 'live'),
        eq(businessPages.status, 'paid')
      )
    )
    .orderBy(
      sql`(${businessPages.saves} * 3 + ${businessPages.likes} + ${businessPages.views} * 0.01) DESC`
    )
    .limit(12);
    
    // Map category name
    const businessesWithCategory = businesses.map((b: any) => ({
      ...b,
      categoryName: b.category_id ? b.category_id?.name || null : null,
    }));
    
    return c.json({ success: true, data: businessesWithCategory });
  } catch (error: any) {
    console.error('Error fetching featured businesses:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Get single business by slug
businessesApp.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  
  try {
    const business = await db.select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      ownerId: businessPages.ownerId,
      status: businessPages.status,
      bannerImageId: businessPages.bannerImageId,
      profileImageId: businessPages.profileImageId,
      categoryId: businessPages.categoryId,
      contactName: businessPages.contactName,
      contactNumber: businessPages.contactNumber,
      countryCode: businessPages.countryCode,
      yearOfEstablishment: businessPages.yearOfEstablishment,
      email: businessPages.email,
      address: businessPages.address,
      locationLat: businessPages.locationLat,
      locationLng: businessPages.locationLng,
      openingHours: businessPages.openingHours,
      aboutUs: businessPages.aboutUs,
      tags: businessPages.tags,
      likes: businessPages.likes,
      saves: businessPages.saves,
      ratingAverage: businessPages.ratingAverage,
      ratingCount: businessPages.ratingCount,
      views: businessPages.views,
      planType: businessPages.planType,
      publishDate: businessPages.publishDate,
      expiryDate: businessPages.expiryDate,
    })
    .from(businessPages)
    .where(eq(businessPages.slug, slug))
    .limit(1);
    
    if (business.length === 0) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Business not found' } }, 404);
    }
    
    // Increment view count using SQL to avoid race condition
    await db.update(businessPages)
      .set({ views: sql`views + 1` })
      .where(eq(businessPages.id, business[0].id));
    
    return c.json({ success: true, data: business[0] });
  } catch (error: any) {
    console.error('Error fetching business:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Create new business
businessesApp.post('/', async (c) => {
  // Check if user is authenticated
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'You must be logged in to create a business' }
    }, 401);
  }
  
  const body = await c.req.json();
  
  try {
    // Check if user already has a business (limit to 1 per user)
    const existing = await db.select({ id: businessPages.id })
      .from(businessPages)
      .where(eq(businessPages.ownerId, user.id))
      .limit(1);
    
    if (existing.length > 0) {
      return c.json({
        success: false,
        error: { code: 'LIMIT_REACHED', message: 'You can only create one business page' }
      }, 400);
    }
    
    // Check for duplicate slug
    const duplicateSlug = await db.select({ id: businessPages.id })
      .from(businessPages)
      .where(eq(businessPages.slug, body.slug))
      .limit(1);
    
    if (duplicateSlug.length > 0) {
      return c.json({
        success: false,
        error: { code: 'DUPLICATE_SLUG', message: 'This URL is already taken. Please choose another.' }
      }, 400);
    }
    
    const [newBusiness] = await db.insert(businessPages).values({
      title: body.title,
      slug: body.slug,
      ownerId: user.id,
      categoryId: body.categoryId || null,
      status: body.publishNow ? 'live' : 'draft',
      contactName: body.contactName || null,
      contactNumber: body.contactNumber || null,
      countryCode: body.countryCode || '+670',
      yearOfEstablishment: body.yearOfEstablishment || null,
      email: body.email || null,
      address: body.address || null,
      locationLat: body.latitude || null,
      locationLng: body.longitude || null,
      aboutUs: body.aboutUs || null,
      openingHours: body.openingHours ? JSON.stringify(body.openingHours) : null,
      tags: body.tags ? JSON.stringify(body.tags) : null,
      // Trial dates if publishing immediately
      publishDate: body.publishNow ? new Date() : null,
      expiryDate: body.publishNow ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : null, // 3 days trial
    }).returning();
    
    return c.json({ success: true, data: newBusiness }, 201);
  } catch (error: any) {
    console.error('Error creating business:', error);
    return c.json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } }, 500);
  }
});

// Update business
businessesApp.put('/:id', async (c) => {
  // Check if user is authenticated
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'You must be logged in to update a business' }
    }, 401);
  }
  
  const id = c.req.param('id');
  const body = await c.req.json();
  
  try {
    // Check if business exists and user is the owner
    const [existingBusiness] = await db.select()
      .from(businessPages)
      .where(eq(businessPages.id, id))
      .limit(1);
    
    if (!existingBusiness) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Business not found' } }, 404);
    }
    
    // Check ownership (owner can update, or admin)
    if (existingBusiness.ownerId !== user.id) {
      return c.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only update your own business' }
      }, 403);
    }
    
    const [updated] = await db.update(businessPages)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(businessPages.id, id))
      .returning();
    
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating business:', error);
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } }, 500);
  }
});

// Delete business
businessesApp.delete('/:id', async (c) => {
  // Check if user is authenticated
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'You must be logged in to delete a business' }
    }, 401);
  }
  
  const id = c.req.param('id');
  
  try {
    // Check if business exists and user is the owner
    const [existingBusiness] = await db.select()
      .from(businessPages)
      .where(eq(businessPages.id, id))
      .limit(1);
    
    if (!existingBusiness) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Business not found' } }, 404);
    }
    
    // Check ownership (owner can delete, or admin)
    if (existingBusiness.ownerId !== user.id) {
      return c.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only delete your own business' }
      }, 403);
    }
    
    await db.delete(businessPages).where(eq(businessPages.id, id));
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting business:', error);
    return c.json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } }, 500);
  }
});

// Like business
businessesApp.post('/:id/like', async (c) => {
  const id = c.req.param('id');
  
  try {
    const [updated] = await db.update(businessPages)
      .set({ likes: sql`${businessPages.likes} + 1` })
      .where(eq(businessPages.id, id))
      .returning({ likes: businessPages.likes });
    
    return c.json({ success: true, likes: updated.likes });
  } catch (error: any) {
    return c.json({ success: false, error: { code: 'LIKE_ERROR', message: error.message } }, 500);
  }
});

// Save business (bookmark)
businessesApp.post('/:id/save', async (c) => {
  const id = c.req.param('id');
  
  try {
    const [updated] = await db.update(businessPages)
      .set({ saves: sql`${businessPages.saves} + 1` })
      .where(eq(businessPages.id, id))
      .returning({ saves: businessPages.saves });
    
    return c.json({ success: true, saves: updated.saves });
  } catch (error: any) {
    return c.json({ success: false, error: { code: 'SAVE_ERROR', message: error.message } }, 500);
  }
});

// Get subscription status for a business
businessesApp.get('/:id/subscription', async (c) => {
  const id = c.req.param('id');
  
  // SKU limits per plan (from PRD)
  const SKU_LIMITS: Record<string, number> = {
    basic_monthly: 10,
    basic_yearly: 10,
    pro_monthly: 30,
    pro_yearly: 30,
    max_monthly: 60,
    max_yearly: 60,
    monthly: 10,
    yearly: 10,
  };
  
  try {
    // Get business
    const [business] = await db.select()
      .from(businessPages)
      .where(eq(businessPages.id, id))
      .limit(1);
    
    if (!business) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Business not found' } }, 404);
    }
    
    // Import orders to check subscription
    const { orders } = await import('@/db/schema');
    const { eq: eqOrder, desc: descOrder, and: andOrder } = await import('drizzle-orm');
    
    // Get latest paid order
    const [subscription] = await db.select()
      .from(orders)
      .where(
        andOrder(
          eqOrder(orders.businessPageId, id),
          eqOrder(orders.status, 'paid')
        )
      )
      .orderBy(descOrder(orders.paidDate))
      .limit(1);
    
    if (subscription) {
      const isExpired = subscription.expiryDate && new Date(subscription.expiryDate).getTime() < Date.now();
      
      if (!isExpired) {
        const skuLimit = SKU_LIMITS[subscription.planType] || 10;
        
        // Check current product count
        const { products } = await import('@/db/schema');
        const { eq: eqProd } = await import('drizzle-orm');
        const productCount = await db.select({ id: products.id })
          .from(products)
          .where(eqProd(products.businessPageId, id));
        
        return c.json({
          success: true,
          status: 'active',
          plan: subscription.planType,
          skuLimit,
          productCount: productCount.length,
          atLimit: productCount.length >= skuLimit
        });
      }
    }
    
    // Check for unpaid trial
    const [trial] = await db.select()
      .from(orders)
      .where(
        andOrder(
          eqOrder(orders.businessPageId, id),
          eqOrder(orders.status, 'unpaid')
        )
      )
      .orderBy(descOrder(orders.createdAt))
      .limit(1);
    
    if (trial) {
      return c.json({
        success: true,
        status: 'trial',
        skuLimit: 0,
        productCount: 0,
        atLimit: true
      });
    }
    
    return c.json({
      success: true,
      status: 'none',
      skuLimit: 0,
      productCount: 0,
      atLimit: true
    });
  } catch (error: any) {
    console.error('Error getting subscription:', error);
    return c.json({ success: false, error: { code: 'ERROR', message: error.message } }, 500);
  }
});

export default businessesApp;
