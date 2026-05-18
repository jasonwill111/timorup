// Admin API - Blogs Management
export const prerender = false;

import { getDb } from '@/lib/db';
import { blogPosts } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getAdminUser, unauthorizedResponse } from '@/lib/admin-auth';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const createBlogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1), // Tiptap HTML
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  tags: z.array(z.string()).optional(),
  coverImageId: z.string().optional(),
});

export async function GET({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
if (!db) throw new Error("Database not available");
  try {
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)).all();

    return new Response(JSON.stringify({
      success: true,
      data: posts
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Admin blogs error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to fetch blog posts' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function POST({ request }: { request: Request }) {
  const user = await getAdminUser(request);
  if (!user) return unauthorizedResponse();

  const db = await getDb();
if (!db) throw new Error("Database not available");
  try {
    const body = await request.json();
    const data = createBlogSchema.parse(body);

    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + nanoid(6);

    const newPost = {
      id: nanoid(),
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      content: data.content,
      status: data.status,
      tags: data.tags ? JSON.stringify(data.tags) : null,
      coverImageId: data.coverImageId || null,
      authorId: user.id,
      publishedAt: data.status === 'published' ? new Date() : null,
    };

    await db.insert(blogPosts).values(newPost);

    return new Response(JSON.stringify({ success: true, data: { id: newPost.id, slug } }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Create blog error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: { message: 'Failed to create blog post' }
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
