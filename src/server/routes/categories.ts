// Categories API Routes
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { drizzle } from 'drizzle-orm/d1';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

const categoriesApp = new Hono();

categoriesApp.use('/*', cors());

// Get all categories
categoriesApp.get('/', async (c) => {
  try {
    const db = drizzle(c.env.DB);
    const allCategories = await db.select()
      .from(categories)
      .orderBy(categories.name);
    
    // Group by parent (primary categories)
    const primaryCategories = allCategories.filter(c => !c.parentId);
    const subCategories = allCategories.filter(c => c.parentId);
    
    const grouped = primaryCategories.map(cat => ({
      ...cat,
      subCategories: subCategories.filter(sub => sub.parentId === cat.id),
    }));
    
    return c.json({ success: true, data: grouped });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

// Get category by slug
categoriesApp.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  
  try {
    const db = drizzle(c.env.DB);
    const category = await db.select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    
    if (category.length === 0) {
      return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } }, 404);
    }
    
    return c.json({ success: true, data: category[0] });
  } catch (error: any) {
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } }, 500);
  }
});

export default categoriesApp;
