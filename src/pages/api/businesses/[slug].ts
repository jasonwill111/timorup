// API endpoint to get single business by slug
export const prerender = false;

import { db } from '@/lib/db';
import { businessPages, categories, products, reviews } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    
    // Get business by slug
    const businesses = await db.select()
      .from(businessPages)
      .where(eq(businessPages.slug, slug))
      .limit(1);

    if (businesses.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'Business not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const business = businesses[0];

    // Get category
    let categoryName = 'Business';
    if (business.categoryId) {
      const cats = await db.select()
        .from(categories)
        .where(eq(categories.id, business.categoryId))
        .limit(1);
      if (cats.length > 0) {
        categoryName = cats[0].name;
      }
    }

    // Get products
    const businessProducts = await db.select()
      .from(products)
      .where(eq(products.businessPageId, business.id));

    // Get reviews with user info
    const businessReviews = await db.select()
      .from(reviews)
      .where(eq(reviews.businessPageId, business.id))
      .orderBy(reviews.createdAt);

    return new Response(JSON.stringify({
      success: true,
      data: {
        ...business,
        categoryName,
        products: businessProducts,
        reviews: businessReviews,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: error.message }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
