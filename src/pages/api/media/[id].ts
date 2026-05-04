// Media API - GET/DELETE single media by ID
export const prerender = false;

import { getDb } from '@/lib/db';
import { media } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { initAuth } from '@/lib/auth';
import { env } from 'cloudflare:workers';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function getR2Bucket(): R2Bucket | undefined {
  return env.MEDIA_BUCKET as R2Bucket | undefined;
}

async function getCurrentUser(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
  if (!tokenMatch) return null;
  try {
    const authApi = (await initAuth()).api;
    const { user } = await authApi.getSession({
      headers: { cookie: `better-auth.session_token=${tokenMatch[1]}` },
    });
    return user;
  } catch { return null; }
}

export async function GET({ request }: { request: Request }) {
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    const item = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (item.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Media not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ success: true, data: item[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'FETCH_ERROR', message: getErrorMessage(error) }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE({ request }: { request: Request }) {
  try {
    const db = await getDb();
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    const user = await getCurrentUser(request);

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const item = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (item.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Media not found' }
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const mediaItem = item[0];
    if (mediaItem.createdById !== user.id) {
      return new Response(JSON.stringify({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // Delete from R2 if URL is R2 path (not data: URL or http)
    if (mediaItem.url && !mediaItem.url.startsWith('data:') && !mediaItem.url.startsWith('http')) {
      const bucket = getR2Bucket();
      if (bucket) {
        try {
          await bucket.delete(mediaItem.url);
        } catch (e) {
          console.error('Failed to delete from R2:', e);
        }
      }
    }

    await db.delete(media).where(eq(media.id, id));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: { code: 'DELETE_ERROR', message: getErrorMessage(error) }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}