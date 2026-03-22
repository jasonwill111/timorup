// Orders API Routes
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from '@/lib/db';
import { orders, businessPages, siteSettings } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

const ordersApp = new Hono();

ordersApp.use('/*', cors());

// Pricing plans - 3 tiers per PRD
const PLANS = {
  basic_monthly: { price: 39, name: 'Basic', period: 'monthly', skuLimit: 10 },
  basic_yearly: { price: 390, name: 'Basic', period: 'yearly', skuLimit: 10 },
  pro_monthly: { price: 69, name: 'Pro', period: 'monthly', skuLimit: 30 },
  pro_yearly: { price: 690, name: 'Pro', period: 'yearly', skuLimit: 30 },
  max_monthly: { price: 99, name: 'Max', period: 'monthly', skuLimit: 60 },
  max_yearly: { price: 990, name: 'Max', period: 'yearly', skuLimit: 60 },
};

// Get pricing plans
ordersApp.get('/plans', (c) => {
  return c.json({ success: true, data: PLANS });
});

// Get site payment settings
ordersApp.get('/payment-info', async (c) => {
  try {
    const settings = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'payment_info'));
    
    if (settings.length > 0) {
      return c.json({ success: true, data: JSON.parse(settings[0].value || '{}') });
    }
    
    // Default payment info
    return c.json({ 
      success: true, 
      data: {
        qrCode: '/images/payment-qr.png',
        contactEmail: 'contact@timorbiz.com',
        contactPhone: '+670',
        paymentMethods: [
          'QR Code Scan',
          'Cash',
          'Bank Transfer'
        ]
      } 
    });
  } catch (error: any) {
    console.error('Error fetching payment info:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Get orders for a user
ordersApp.get('/user/:userId', async (c) => {
  const userId = c.req.param('userId');
  
  try {
    const userOrders = await db.select({
      id: orders.id,
      businessPageId: orders.businessPageId,
      planType: orders.planType,
      amount: orders.amount,
      status: orders.status,
      expiryDate: orders.expiryDate,
      createdAt: orders.createdAt,
      paidDate: orders.paidDate,
    })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
    
    return c.json({ success: true, data: userOrders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Get single order
ordersApp.get('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const order = await db.select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);
    
    if (order.length === 0) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } }, 404);
    }
    
    return c.json({ success: true, data: order[0] });
  } catch (error: any) {
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Create order (when user selects a plan)
ordersApp.post('/', async (c) => {
  const body = await c.req.json();
  
  const { businessPageId, userId, planType } = body;
  
  if (!businessPageId || !userId || !planType) {
    return c.json({ 
      success: false, 
      error: { code: 'MISSING_PARAMS', message: 'businessPageId, userId, and planType are required' } 
    }, 400);
  }
  
  const plan = PLANS[planType as keyof typeof PLANS];
  if (!plan) {
    return c.json({ 
      success: false, 
      error: { code: 'INVALID_PLAN', message: 'Invalid plan type' } 
    }, 400);
  }
  
  try {
    // Check if there's already an unpaid order for this business
    const existingOrder = await db.select({ id: orders.id })
      .from(orders)
      .where(
        and(
          eq(orders.businessPageId, businessPageId),
          eq(orders.status, 'unpaid')
        )
      )
      .limit(1);
    
    if (existingOrder.length > 0) {
      return c.json({
        success: false,
        error: { code: 'ORDER_EXISTS', message: 'You already have an unpaid order' }
      }, 400);
    }
    
    // Calculate expiry date (3 days trial)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 3);
    
    const [newOrder] = await db.insert(orders).values({
      businessPageId,
      userId,
      planType,
      amount: plan.price,
      status: 'unpaid',
      expiryDate: trialEndDate,
    }).returning();
    
    // Update business page status to 'live' (trial)
    await db.update(businessPages)
      .set({ 
        status: 'live',
        planType,
        publishDate: new Date(),
      })
      .where(eq(businessPages.id, businessPageId));
    
    return c.json({ success: true, data: newOrder }, 201);
  } catch (error: any) {
    console.error('Error creating order:', error);
    return c.json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } }, 500);
  }
});

// Admin: Update order status (confirm payment)
ordersApp.put('/:id/status', async (c) => {
  // TODO: Add admin auth check
  
  const id = c.req.param('id');
  const body = await c.req.json();
  const { status, expiryDate, adminNotes } = body;
  
  try {
    let updateData: any = { status, adminNotes };
    
    // If confirming payment, set paidDate and calculate expiry
    if (status === 'paid') {
      updateData.paidDate = new Date();
      
      // Calculate expiry based on plan type
      const order = await db.select({ planType: orders.planType })
        .from(orders)
        .where(eq(orders.id, id))
        .limit(1);
      
      if (order.length > 0) {
        const planType = order[0].planType;
        const plan = PLANS[planType as keyof typeof PLANS];
        const expiry = new Date();
        
        // Calculate expiry based on plan period
        if (plan?.period === 'yearly') {
          expiry.setFullYear(expiry.getFullYear() + 1);
        } else {
          // Default to monthly
          expiry.setMonth(expiry.getMonth() + 1);
        }
        
        updateData.expiryDate = expiry;
        
        // Update business page status
        const orderData = await db.select({ businessPageId: orders.businessPageId })
          .from(orders)
          .where(eq(orders.id, id))
          .limit(1);
        
        if (orderData.length > 0) {
          await db.update(businessPages)
            .set({ 
              status: 'paid',
              expiryDate: expiry,
            })
            .where(eq(businessPages.id, orderData[0].businessPageId));
        }
      }
    }
    
    const [updated] = await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    
    if (!updated) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } }, 404);
    }
    
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } }, 500);
  }
});

// Get all orders (admin)
ordersApp.get('/', async (c) => {
  // TODO: Add admin auth check
  
  const { page = '1', limit = '20', status = '' } = c.req.query();
  const offset = (parseInt(page) - 1) * parseInt(limit);
  
  try {
    let whereCondition: any = undefined;
    
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

export default ordersApp;
