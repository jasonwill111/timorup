// API endpoint to get user profile by ID
export const prerender = false;

import { getDb } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkRateLimitKV, getRateLimitHeaders } from '@/lib/rate-limit';
import { z } from 'zod';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getClientIP(request: Request): string {
  return request.headers.get('cf-connecting-ip') ||
         request.headers.get('x-forwarded-for')?.split(',')[0] ||
         'unknown';
}

const ParamsSchema = z.object({
  uid: z.string().min(1, { error: 'User ID is required' }),
});

export async function GET({ params, request }: { params: Record<string, string>; request: Request }) {
  const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
  // Rate limiting
  const clientIP = getClientIP(request);
  const rateLimit = await checkRateLimitKV(`profile:${clientIP}`);

  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Rate limit exceeded. Please try again later.' }
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...getRateLimitHeaders(rateLimit),
      },
    });
  }

  // Validate params
  const parseResult = ParamsSchema.safeParse(params);
  if (!parseResult.success) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Invalid user ID' }
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { uid } = parseResult.data;

  try {
    const user = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      image: users.image,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, uid))
    .limit(1)
    .get() ?? undefined;

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { message: 'User not found' }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: user
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { message: getErrorMessage(error) }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
