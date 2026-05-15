/**
 * Custom Sitemap XML Generator
 * SSR endpoint that generates sitemap.xml from D1 database
 * Overrides @astrojs/sitemap to serve dynamic content
 */

export const prerender = false;

const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://timorlist.com';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

const STATIC_PAGES = [
  { loc: '', priority: '1.0', changefreq: 'daily' },
  { loc: 'about', priority: '0.7', changefreq: 'monthly' },
  { loc: 'contact', priority: '0.7', changefreq: 'monthly' },
  { loc: 'pricing', priority: '0.8', changefreq: 'weekly' },
  { loc: 'faq', priority: '0.7', changefreq: 'monthly' },
  { loc: 'blog', priority: '0.8', changefreq: 'daily' },
  { loc: 'businesses', priority: '0.9', changefreq: 'daily' },
  { loc: 'non-profits', priority: '0.9', changefreq: 'daily' },
  { loc: 'public-sectors', priority: '0.9', changefreq: 'daily' },
  { loc: 'categories', priority: '0.9', changefreq: 'daily' },
  { loc: 'search', priority: '0.8', changefreq: 'daily' },
  { loc: 'products-services', priority: '0.8', changefreq: 'daily' },
];

function formatDate(date: Date | string | null): string {
  if (!date) return new Date().toISOString().split('T')[0];
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlToXml(url: SitemapUrl): string {
  const loc = `${SITE_URL}${url.loc}`;
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`;
}

export async function GET() {
  const urls: SitemapUrl[] = [];
  const today = new Date().toISOString().split('T')[0];

  // Add static pages
  for (const page of STATIC_PAGES) {
    urls.push({
      loc: `/${page.loc}`,
      priority: page.priority,
      changefreq: page.changefreq,
      lastmod: today
    });
  }

  try {
    const { getDb } = await import('../lib/db');
    const db = await getDb();

    // Query businesses (active only)
    const businesses = await db.all(`
      SELECT slug, updatedAt FROM businesses WHERE status = 'active' LIMIT 50000
    `);
    for (const biz of businesses) {
      urls.push({
        loc: `/business/${biz.slug}`,
        lastmod: formatDate(biz.updatedAt),
        changefreq: 'weekly',
        priority: '0.8'
      });
    }

    // Query non-profits
    const nonProfits = await db.all(`
      SELECT slug, updatedAt FROM non_profits WHERE status = 'active' LIMIT 50000
    `);
    for (const np of nonProfits) {
      urls.push({
        loc: `/non-profit/${np.slug}`,
        lastmod: formatDate(np.updatedAt),
        changefreq: 'weekly',
        priority: '0.8'
      });
    }

    // Query public sectors
    const publicSectors = await db.all(`
      SELECT slug, updatedAt FROM public_sectors WHERE status = 'active' LIMIT 50000
    `);
    for (const ps of publicSectors) {
      urls.push({
        loc: `/public-sector/${ps.slug}`,
        lastmod: formatDate(ps.updatedAt),
        changefreq: 'weekly',
        priority: '0.8'
      });
    }

    // Query listings (active and not expired)
    const listings = await db.all(`
      SELECT slug, updatedAt FROM listings
      WHERE status = 'active' AND (expiresAt IS NULL OR expiresAt > datetime('now'))
      LIMIT 50000
    `);
    for (const listing of listings) {
      urls.push({
        loc: `/listing/${listing.slug}`,
        lastmod: formatDate(listing.updatedAt),
        changefreq: 'weekly',
        priority: '0.7'
      });
    }

  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(urlToXml).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
    }
  });
}