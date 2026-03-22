// Products API Routes
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from '@/lib/db';
import { products, productImages, media, businessPages, orders } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

const productsApp = new Hono();

productsApp.use('/*', cors());

// Helper: Check if user is owner of business
async function checkBusinessOwnership(businessPageId: string, userId: string): Promise<boolean> {
  const business = await db.select({ ownerId: businessPages.ownerId })
    .from(businessPages)
    .where(eq(businessPages.id, businessPageId))
    .limit(1);
  
  return business.length > 0 && business[0].ownerId === userId;
}

// Helper: Check subscription status for a business
async function getSubscriptionStatus(businessPageId: string): Promise<{ status: string; skuLimit: number }> {
  // SKU limits per plan (from PRD)
  const SKU_LIMITS: Record<string, number> = {
    basic_monthly: 10,
    basic_yearly: 10,
    pro_monthly: 30,
    pro_yearly: 30,
    max_monthly: 60,
    max_yearly: 60,
    // Legacy plan types
    monthly: 10,
    yearly: 10,
  };
  
  // Get latest paid order
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
  
  if (subscription.length > 0) {
    const sub = subscription[0];
    const isExpired = sub.expiryDate && new Date(sub.expiryDate).getTime() < Date.now();
    
    if (!isExpired) {
      const skuLimit = SKU_LIMITS[sub.planType] || 10;
      return { status: 'active', skuLimit };
    }
  }
  
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
    return { status: 'trial', skuLimit: 0 };
  }
  
  return { status: 'none', skuLimit: 0 };
}

// Get all products for a business
productsApp.get('/', async (c) => {
  const businessPageId = c.req.query('businessPageId');
  const isAdmin = c.req.query('isAdmin') === 'true';
  
  // Admin can fetch all products without businessPageId
  if (!businessPageId && !isAdmin) {
    return c.json({ 
      success: false, 
      error: { code: 'MISSING_PARAM', message: 'businessPageId is required' } 
    }, 400);
  }
  
  try {
    let allProducts;
    
    if (isAdmin && !businessPageId) {
      // Admin fetch all products
      allProducts = await db.select()
        .from(products)
        .orderBy(desc(products.createdAt));
    } else {
      allProducts = await db.select()
        .from(products)
        .where(eq(products.businessPageId, businessPageId!))
        .orderBy(desc(products.createdAt));
    }
    
    // Get images for each product
    const productsWithImages = await Promise.all(
      allProducts.map(async (product) => {
        const images = await db.select({
          id: productImages.id,
          mediaId: productImages.mediaId,
          position: productImages.position,
        })
        .from(productImages)
        .where(eq(productImages.productId, product.id))
        .orderBy(productImages.position);
        
        return { ...product, images };
      })
    );
    
    return c.json({ success: true, data: productsWithImages });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Get single product by ID
productsApp.get('/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const product = await db.select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    
    if (product.length === 0) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } }, 404);
    }
    
    // Get images
    const images = await db.select()
      .from(productImages)
      .where(eq(productImages.productId, id))
      .orderBy(productImages.position);
    
    return c.json({ success: true, data: { ...product[0], images } });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Create product
productsApp.post('/', async (c) => {
  const body = await c.req.json();
  
  const { userId, businessPageId, title, price, description, images, isAdmin } = body;
  
  if (!businessPageId || !title || !price) {
    return c.json({ 
      success: false, 
      error: { code: 'MISSING_PARAMS', message: 'businessPageId, title, and price are required' } 
    }, 400);
  }
  
  // Skip ownership check for admin
  const isAdminMode = isAdmin === true;
  
  try {
    // Check ownership (skip for admin)
    if (!isAdminMode) {
      if (!userId) {
        return c.json({ 
          success: false, 
          error: { code: 'MISSING_PARAMS', message: 'userId is required' } 
        }, 400);
      }
      
      const isOwner = await checkBusinessOwnership(businessPageId, userId);
      if (!isOwner) {
        return c.json({ 
          success: false, 
          error: { code: 'FORBIDDEN', message: 'You do not own this business' } 
        }, 403);
      }
      
      // Check subscription status (skip for admin)
      const subscription = await getSubscriptionStatus(businessPageId);
      if (subscription.status !== 'active') {
        return c.json({ 
          success: false, 
          error: { code: 'SUBSCRIPTION_REQUIRED', message: 'Upgrade to create products' } 
        }, 403);
      }
      
      // Check SKU limit (skip for admin)
      const existingCount = await db.select({ count: products.id })
        .from(products)
        .where(eq(products.businessPageId, businessPageId));
      
      if (existingCount.length >= subscription.skuLimit) {
        return c.json({
          success: false,
          error: { code: 'SKU_LIMIT_REACHED', message: 'You have reached your product limit' }
        }, 400);
      }
    }
    
    const [newProduct] = await db.insert(products).values({
      id: `prod-${Date.now()}`,
      title,
      price,
      description: description || null,
      businessPageId,
    }).returning();
    
    // Add images if provided
    if (images && Array.isArray(images)) {
      for (let i = 0; i < Math.min(images.length, 4); i++) {
        await db.insert(productImages).values({
          id: `img-${Date.now()}-${i}`,
          productId: newProduct.id,
          mediaId: images[i],
          position: i,
        });
      }
    }
    
    return c.json({ success: true, data: newProduct }, 201);
  } catch (error: any) {
    console.error('Error creating product:', error);
    return c.json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } }, 500);
  }
});

// Update product
productsApp.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  
  const { userId, title, price, description, images } = body;
  
  if (!userId) {
    return c.json({ 
      success: false, 
      error: { code: 'MISSING_PARAM', message: 'userId is required' } 
    }, 400);
  }
  
  try {
    // Get product to find businessPageId
    const product = await db.select({ businessPageId: products.businessPageId })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    
    if (product.length === 0) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } }, 404);
    }
    
    // Check ownership
    const isOwner = await checkBusinessOwnership(product[0].businessPageId, userId);
    if (!isOwner) {
      return c.json({ 
        success: false, 
        error: { code: 'FORBIDDEN', message: 'You do not own this business' } 
      }, 403);
    }
    
    const [updated] = await db.update(products)
      .set({
        title,
        price,
        description,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();
    
    if (!updated) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } }, 404);
    }
    
    // Update images if provided
    if (images) {
      // Delete existing images
      await db.delete(productImages).where(eq(productImages.productId, id));
      
      // Add new images
      for (let i = 0; i < Math.min(images.length, 4); i++) {
        await db.insert(productImages).values({
          id: `img-update-${Date.now()}-${i}`,
          productId: id,
          mediaId: images[i],
          position: i,
        });
      }
    }
    
    return c.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } }, 500);
  }
});

// Delete product
productsApp.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const userId = c.req.query('userId');
  const isAdmin = c.req.query('isAdmin') === 'true';
  
  // Skip userId check for admin
  if (!isAdmin && !userId) {
    return c.json({ 
      success: false, 
      error: { code: 'MISSING_PARAM', message: 'userId is required' } 
    }, 400);
  }
  
  try {
    // Get product to find businessPageId
    const product = await db.select({ businessPageId: products.businessPageId })
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    
    if (product.length === 0) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } }, 404);
    }
    
    // Check ownership (skip for admin)
    if (!isAdmin && userId) {
      const isOwner = await checkBusinessOwnership(product[0].businessPageId, userId);
      if (!isOwner) {
        return c.json({ 
          success: false, 
          error: { code: 'FORBIDDEN', message: 'You do not own this business' } 
        }, 403);
      }
    }
    
    // Delete associated images first
    await db.delete(productImages).where(eq(productImages.productId, id));
    
    // Delete product
    await db.delete(products).where(eq(products.id, id));
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return c.json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } }, 500);
  }
});

export default productsApp;
