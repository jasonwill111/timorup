// Astro Server Actions for Admin Blogs Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { blogPosts } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { getAdminUser } from '@/lib/admin-auth';

const createBlogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  tags: z.array(z.string()).optional(),
  coverImageId: z.string().optional(),
  // SEO fields
  authorName: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

const updateBlogSchema = createBlogSchema.partial().extend({
  id: z.string(),
});

export const blogs = {
  // List all blog posts
  list: defineAction({
    handler: async () => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");
      const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)).all();

      return { success: true, data: posts };
    },
  }),

  // Create blog post
  create: defineAction({
    input: createBlogSchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");
      const slug = input.slug || input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + nanoid(6);

      const newPost = {
        id: nanoid(),
        title: input.title,
        slug,
        excerpt: input.excerpt || null,
        content: input.content,
        status: input.status,
        tags: input.tags ? JSON.stringify(input.tags) : null,
        coverImageId: input.coverImageId || null,
        authorId: user.id,
        authorName: input.authorName || user.name, // Default to current user's name
        metaTitle: input.metaTitle || null,
        metaDescription: input.metaDescription || null,
        canonicalUrl: input.canonicalUrl || null,
        publishedAt: input.status === 'published' ? Math.floor(Date.now() / 1000) : null,
      };

      await db.insert(blogPosts).values(newPost);

      return { success: true, data: { id: newPost.id, slug } };
    },
  }),

  // Update blog post
  update: defineAction({
    input: updateBlogSchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");
      const { id, ...data } = input;

      const updateData: Record<string, unknown> = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.status !== undefined) {
        updateData.status = data.status;
        if (data.status === 'published') {
          updateData.publishedAt = new Date();
        }
      }
      if (data.tags !== undefined) updateData.tags = data.tags ? JSON.stringify(data.tags) : null;
      if (data.coverImageId !== undefined) updateData.coverImageId = data.coverImageId;
      // SEO fields
      if (data.authorName !== undefined) updateData.authorName = data.authorName;
      if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
      if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
      if (data.canonicalUrl !== undefined) updateData.canonicalUrl = data.canonicalUrl;

      await db.update(blogPosts)
        .set(updateData)
        .where(eq(blogPosts.id, id))
        .run();

      return { success: true };
    },
  }),

  // Delete blog post
  delete: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");
      await db.delete(blogPosts).where(eq(blogPosts.id, input.id)).run();

      return { success: true, message: 'Blog post deleted' };
    },
  }),
};