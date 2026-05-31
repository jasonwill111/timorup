/**
 * Health Check Endpoint
 * Provides service status for load balancers and monitoring
 */
export const prerender = false;

import { getDb } from '@/lib/db';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: 'production' | 'development';
  checks: {
    database: { status: 'ok' | 'error' | 'skipped'; latency?: number; error?: string };
  };
}

export async function GET(): Promise<Response> {
  const isProduction = import.meta.env.PROD;
  const healthStatus: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: isProduction ? 'production' : 'development',
    checks: {
      database: { status: 'skipped', error: 'Health check only runs in production' },
    },
  };

  // Only check DB in production (Cloudflare bindings not available in local dev)
  if (isProduction) {
    try {
      const db = await getDb();
      const start = Date.now();
      if (db && typeof db.prepare === 'function') {
        const result = await db.prepare('SELECT 1 as health').first();
        healthStatus.checks.database = {
          status: result ? 'ok' : 'error',
          latency: Date.now() - start,
          error: result ? undefined : 'Query returned no result',
        };
        if (healthStatus.checks.database.status === 'error') {
          healthStatus.status = 'unhealthy';
        }
      } else {
        healthStatus.checks.database = { status: 'error', error: 'Database not available' };
        healthStatus.status = 'unhealthy';
      }
    } catch (error) {
      healthStatus.checks.database = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      healthStatus.status = 'unhealthy';
    }
  } else {
    healthStatus.status = 'degraded';
  }

  const httpStatus = healthStatus.status === 'unhealthy' ? 503 : 200;

  return new Response(JSON.stringify(healthStatus, null, 2), {
    status: httpStatus,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}