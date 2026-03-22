// Sitemap.xml generation endpoint
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from '@/lib/db';
import { businessPages } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

const sitemapApp = new Hono();

sitemapApp.use('/*', cors());

sitemapApp.get('/', async (c) => {
  const siteUrl = 'https://timorbiz.com';
  
  try {
    // Get all live businesses
    const businesses = await db.select({
      slug: businessPages.slug,
      updatedAt: businessPages.updatedAt,
    })
    .from(businessPages)
    .where(
      or(
        eq(businessPages.status, 'live'),
        eq(businessPages.status, 'paid')
      )
    );
    
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/businesses', priority: '0.9', changefreq: 'daily' },
      { url: '/pricing', priority: '0.7', changefreq: 'monthly' },
      { url: '/login', priority: '0.5', changefreq: 'monthly' },
      { url: '/register', priority: '0.5', changefreq: 'monthly' },
    ];
    
    const today = new Date().toISOString().split('T')[0];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  ${businesses.map(biz => `
  <url>
    <loc>${siteUrl}/business/${biz.slug}</loc>
    <lastmod>${biz.updatedAt ? new Date(biz.updatedAt).toISOString().split('T')[0] : today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;
    
    return c.newResponse(sitemap, 200, {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return basic sitemap on error
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    return c.newResponse(sitemap, 200, {
      'Content-Type': 'application/xml',
    });
  }
});

export default sitemapApp;
