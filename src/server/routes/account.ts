// Account API Routes
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from '@/lib/db';
import { users, businessPages, orders } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

const accountApp = new Hono();

accountApp.use('/*', cors());

// Get current user profile
accountApp.get('/profile/:userId', async (c) => {
  const userId = c.req.param('userId');
  
  try {
    const user = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      phone: users.phone,
      image: users.image,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
    
    if (user.length === 0) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } }, 404);
    }
    
    return c.json({ success: true, data: user[0] });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Update user profile
accountApp.put('/profile/:userId', async (c) => {
  const userId = c.req.param('userId');
  const body = await c.req.json();
  
  const { name, phone, image } = body;
  
  try {
    const [updated] = await db.update(users)
      .set({
        name: name || undefined,
        phone: phone || undefined,
        image: image || undefined,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updated) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } }, 404);
    }
    
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } }, 500);
  }
});

// Get user's businesses
accountApp.get('/businesses/:userId', async (c) => {
  const userId = c.req.param('userId');
  
  try {
    const userBusinesses = await db.select({
      id: businessPages.id,
      title: businessPages.title,
      slug: businessPages.slug,
      status: businessPages.status,
      categoryId: businessPages.categoryId,
      profileImageId: businessPages.profileImageId,
      planType: businessPages.planType,
      expiryDate: businessPages.expiryDate,
      createdAt: businessPages.createdAt,
    })
    .from(businessPages)
    .where(eq(businessPages.ownerId, userId))
    .orderBy(desc(businessPages.createdAt));
    
    return c.json({ success: true, data: userBusinesses });
  } catch (error: any) {
    console.error('Error fetching businesses:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Get user's subscriptions/orders
accountApp.get('/subscriptions/:userId', async (c) => {
  const userId = c.req.param('userId');
  
  try {
    const userSubscriptions = await db.select({
      id: orders.id,
      businessPageId: orders.businessPageId,
      planType: orders.planType,
      amount: orders.amount,
      status: orders.status,
      expiryDate: orders.expiryDate,
      paidDate: orders.paidDate,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
    
    return c.json({ success: true, data: userSubscriptions });
  } catch (error: any) {
    console.error('Error fetching subscriptions:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Check subscription status for a business
accountApp.get('/subscription/:businessPageId', async (c) => {
  const businessPageId = c.req.param('businessPageId');
  
  try {
    // Get latest paid order for this business
    const subscription = await db.select()
      .from(orders)
      .where(
        and(
          eq(orders.businessPageId, businessPageId),
          eq(orders.status, 'paid')
        )
      )
      .orderBy(desc(orders.paidDate))
      .limit(1);
    
    if (subscription.length === 0) {
      // Check for unpaid trial
      const trial = await db.select()
        .from(orders)
        .where(
          and(
            eq(orders.businessPageId, businessPageId),
            eq(orders.status, 'unpaid')
          )
        )
        .orderBy(desc(orders.createdAt))
        .limit(1);
      
      if (trial.length > 0) {
        return c.json({ 
          success: true, 
          data: { 
            status: 'trial',
            order: trial[0],
            daysRemaining: Math.ceil((new Date(trial[0].expiryDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          } 
        });
      }
      
      return c.json({ success: true, data: { status: 'none' } });
    }
    
    const sub = subscription[0];
    const isExpired = sub.expiryDate && new Date(sub.expiryDate).getTime() < Date.now();
    
    return c.json({ 
      success: true, 
      data: { 
        status: isExpired ? 'expired' : 'active',
        order: sub,
        expiryDate: sub.expiryDate
      } 
    });
  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

export default accountApp;
