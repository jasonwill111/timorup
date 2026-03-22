// Cron job endpoint for cleanup tasks
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from '@/lib/db';
import { businessPages, orders } from '@/db/schema';
import { eq, lt, gt, and } from 'drizzle-orm';

const cronApp = new Hono();

// Cron secret - should be set in environment
const CRON_SECRET = 'dev-secret';

cronApp.use('/*', cors());

// Verify cron secret
cronApp.use('/cleanup/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const providedSecret = authHeader?.replace('Bearer ', '');
  
  if (providedSecret !== CRON_SECRET) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid cron secret' } }, 401);
  }
  
  await next();
});

// Cleanup expired businesses
// Run daily
cronApp.get('/cleanup/expired', async (c) => {
  try {
    const now = new Date();
    
    // Find businesses that should be expired
    // 1. Trial businesses (status=live, created > 3 days ago)
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    
    // Update trial expired businesses to 'expired' status
    const trialExpired = await db.update(businessPages)
      .set({ 
        status: 'expired',
        updatedAt: now
      })
      .where(
        and(
          eq(businessPages.status, 'live'),
          lt(businessPages.createdAt, threeDaysAgo)
        )
      )
      .returning({ id: businessPages.id, title: businessPages.title });
    
    // 2. Paid subscriptions that have expired
    const paidExpired = await db.update(businessPages)
      .set({
        status: 'expired',
        updatedAt: now
      })
      .where(
        and(
          eq(businessPages.status, 'paid'),
          lt(businessPages.expiryDate, now)
        )
      )
      .returning({ id: businessPages.id, title: businessPages.title });
    
    // 3. Delete businesses that have been expired for > 30 days
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const deletedBusinesses = await db.delete(businessPages)
      .where(
        and(
          eq(businessPages.status, 'expired'),
          lt(businessPages.updatedAt, thirtyDaysAgo)
        )
      )
      .returning({ id: businessPages.id, title: businessPages.title });
    
    return c.json({
      success: true,
      data: {
        trialExpired: trialExpired.length,
        paidExpired: paidExpired.length,
        deleted: deletedBusinesses.length,
        timestamp: now.toISOString(),
      }
    });
  } catch (error: any) {
    console.error('Error in cleanup cron:', error);
    return c.json({
      success: false,
      error: { code: 'CRON_ERROR', message: error.message }
    }, 500);
  }
});

// Send expiry reminders
// Run daily - send reminders 3 days before expiry
cronApp.get('/cleanup/reminders', async (c) => {
  try {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    // Find businesses expiring in 3 days
    const expiringSoon = await db.select({
      id: businessPages.id,
      title: businessPages.title,
      email: businessPages.email,
      contactName: businessPages.contactName,
      expiryDate: businessPages.expiryDate,
    })
    .from(businessPages)
    .where(
      and(
        eq(businessPages.status, 'paid'),
        lt(businessPages.expiryDate, threeDaysFromNow),
        gt(businessPages.expiryDate, now)
      )
    );
    
    // TODO: Send email reminders
    // For now, just return the list
    
    return c.json({
      success: true,
      data: {
        count: expiringSoon.length,
        businesses: expiringSoon,
        timestamp: now.toISOString(),
      }
    });
  } catch (error: any) {
    console.error('Error in reminders cron:', error);
    return c.json({
      success: false,
      error: { code: 'CRON_ERROR', message: error.message }
    }, 500);
  }
});

// Health check for cron
cronApp.get('/health', async (c) => {
  return c.json({ 
    success: true, 
    data: { 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    } 
  });
});

export default cronApp;
