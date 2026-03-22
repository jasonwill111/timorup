// Blog Posts API Routes (Admin only — protected by admin middleware)
import { Hono } from 'hono';
import { db } from '@/lib/db';
import { blogPosts } from '@/db/schema';
import { eq, desc, and, like, or, sql } from 'drizzle-orm';

const blogApp = new Hono();

// ── GET /blogs — list all posts ──────────────────────────────────────────────

blogApp.get('/', async (c) => {
  const { page = '1', limit = '20', status = '', search = '' } = c.req.query();
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const conditions = [];
    if (status) conditions.push(eq(blogPosts.status, status));
    if (search) {
      conditions.push(
        or(
          like(blogPosts.title, `%${search}%`),
          like(blogPosts.excerpt, `%${search}%`)
        )
      );
    }
    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    const posts = await db.select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      status: blogPosts.status,
      coverImageId: blogPosts.coverImageId,
      authorId: blogPosts.authorId,
      tags: blogPosts.tags,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
    }).from(blogPosts)
      .where(whereCondition)
      .orderBy(desc(blogPosts.createdAt))
      .limit(parseInt(limit)).offset(offset);

    return c.json({ success: true, data: posts });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fetch error';
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message } }, 500);
  }
});

// ── GET /blogs/:id — get single post ─────────────────────────────────────────

blogApp.get('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    if (!post) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Post not found' } }, 404);
    return c.json({ success: true, data: post });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Fetch error';
    return c.json({ success: false, error: { code: 'FETCH_ERROR', message } }, 500);
  }
});

// ── POST /blogs — create post ─────────────────────────────────────────────────

blogApp.post('/', async (c) => {
  const body = await c.req.json();
  const {
    title, slug, excerpt, content, coverImageId,
    authorId, status = 'draft', tags,
  } = body;

  if (!title || !slug || !authorId) {
    return c.json({ success: false, error: { code: 'MISSING_PARAMS', message: 'title, slug, authorId required' } }, 400);
  }

  try {
    const id = crypto.randomUUID();
    const publishedAt = status === 'published' ? new Date() : null;

    const [created] = await db.insert(blogPosts).values({
      id, title, slug, excerpt, content,
      coverImageId, authorId, status,
      tags: tags ? JSON.stringify(tags) : null,
      publishedAt,
    }).returning();

    return c.json({ success: true, data: created }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Create error';
    // Handle duplicate slug
    if (message.includes('UNIQUE') || message.includes('unique')) {
      return c.json({ success: false, error: { code: 'DUPLICATE_SLUG', message: 'A post with this slug already exists' } }, 409);
    }
    return c.json({ success: false, error: { code: 'CREATE_ERROR', message } }, 500);
  }
});

// ── PUT /blogs/:id — update post ────────────────────────────────────────────

blogApp.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { title, slug, excerpt, content, coverImageId, status, tags } = body;

  try {
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (title !== undefined) updates.title = title;
    if (slug !== undefined) updates.slug = slug;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (content !== undefined) updates.content = content;
    if (coverImageId !== undefined) updates.coverImageId = coverImageId;
    if (status !== undefined) {
      updates.status = status;
      if (status === 'published') {
        // Set publishedAt only on first publish
        const [existing] = await db.select({ publishedAt: blogPosts.publishedAt })
          .from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
        if (!existing?.publishedAt) updates.publishedAt = new Date();
      }
    }
    if (tags !== undefined) updates.tags = JSON.stringify(tags);

    const [updated] = await db.update(blogPosts)
      .set(updates as Parameters<typeof db.update>[0] extends infer T ? Record<string, unknown> : never)
      .where(eq(blogPosts.id, id)).returning();

    if (!updated) return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Post not found' } }, 404);
    return c.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Update error';
    return c.json({ success: false, error: { code: 'UPDATE_ERROR', message } }, 500);
  }
});

// ── DELETE /blogs/:id ─────────────────────────────────────────────────────────

blogApp.delete('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return c.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Delete error';
    return c.json({ success: false, error: { code: 'DELETE_ERROR', message } }, 500);
  }
});

export default blogApp;
