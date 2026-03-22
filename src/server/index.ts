import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import authRoutes from './routes/auth';
import businessesRoutes from './routes/businesses';
import categoriesRoutes from './routes/categories';
import productsRoutes from './routes/products';
import reviewsRoutes from './routes/reviews';
import ordersRoutes from './routes/orders';
import accountRoutes from './routes/account';
import adminRoutes from './routes/admin';
import mediaRoutes from './routes/media';
import bannerRoutes from './routes/banners';

const app = new Hono();

const getAllowedOrigins = () => {
  const appUrl = process.env.APP_URL || 'http://localhost:4321';
  return process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [appUrl];
};

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;
  const allowed = getAllowedOrigins();
  return allowed.includes(origin) || origin.startsWith('http://localhost:');
}

app.use('*', logger());
app.use('*', cors({
  origin: (origin) => {
    if (!isOriginAllowed(origin)) return getAllowedOrigins()[0] || 'http://localhost:4321';
    return origin || '*';
  },
  credentials: true,
}));

app.get('/', (c) => {
  return c.json({ 
    message: 'TMBIZ API Server',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.route('/api/auth', authRoutes);
app.route('/api/businesses', businessesRoutes);
app.route('/api/categories', categoriesRoutes);
app.route('/api/products', productsRoutes);
app.route('/api/reviews', reviewsRoutes);
app.route('/api/orders', ordersRoutes);
app.route('/api/account', accountRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/media', mediaRoutes);
app.route('/api/banners', bannerRoutes);

export default app;
