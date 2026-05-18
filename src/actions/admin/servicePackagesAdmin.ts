// Astro Server Actions for Admin Service Packages Management
import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { servicePackages, businesses } from '@/db/schema';
import { eq, asc, count } from 'drizzle-orm';
import { getAdminUser } from '@/lib/admin-auth';

// Variant schema for pricing tiers
const VariantSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().min(0),
  currency: z.string().default('USD'),
  durationValue: z.number().int().positive(),
  durationUnit: z.enum(['days', 'weeks', 'months', 'years']),
  limits: z.object({
    skuLimit: z.number().int().nonnegative().optional(),
    maxImages: z.number().int().nonnegative().optional(),
    maxVideos: z.number().int().nonnegative().optional(),
    maxBusinessImages: z.number().int().nonnegative().optional(),
    maxBusinessVideos: z.number().int().nonnegative().optional(),
    extraImages: z.number().int().nonnegative().optional(),
    extraVideos: z.number().int().nonnegative().optional(),
  }).optional().default({}),
  features: z.array(z.string()).default([]),
});

// Package type enum
const PackageTypeEnum = z.enum(['subscription', 'listing_renewal', 'featured', 'addon']);
const PackageCategoryEnum = z.enum(['business', 'listing', 'other']);

// Create schema
const CreatePackageSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).optional(),
  type: PackageTypeEnum,
  category: PackageCategoryEnum.optional(),
  description: z.string().max(500).optional(),
  variants: z.array(VariantSchema).min(1),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

// Update schema
const UpdatePackageSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
  type: PackageTypeEnum.optional(),
  category: PackageCategoryEnum.optional(),
  description: z.string().max(500).optional(),
  variants: z.array(VariantSchema).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const servicePackagesAdmin = {
  // Get all packages (admin view - includes inactive)
  getAll: defineAction({
    handler: async () => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');

      const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
      const allPackages = await db.select()
        .from(servicePackages)
        .orderBy(asc(servicePackages.sortOrder))
        .all();

      return {
        success: true,
        data: allPackages.map(pkg => ({
          ...pkg,
          variants: JSON.parse(pkg.variants),
        })),
      };
    },
  }),

  // Create new package (super_admin only)
  create: defineAction({
    input: CreatePackageSchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');
      if (user.role !== 'super_admin') throw new Error('Only super_admin can create packages');

      const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");

      // Check for duplicate slug
      const existing = await db.select()
        .from(servicePackages)
        .where(eq(servicePackages.slug, input.slug || input.name.toLowerCase().replace(/\s+/g, '-')))
        .limit(1)
        .get();

      if (existing) throw new Error('Package with this slug already exists');

      const id = `sp-${Date.now()}`;
      const slug = input.slug || input.name.toLowerCase().replace(/\s+/g, '-');

      await db.insert(servicePackages).values({
        id,
        name: input.name,
        slug,
        type: input.type,
        category: input.category || null,
        description: input.description || null,
        variants: JSON.stringify(input.variants),
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      });

      return {
        success: true,
        data: {
          id,
          name: input.name,
          slug,
          type: input.type,
          variants: input.variants,
        },
      };
    },
  }),

  // Update package
  update: defineAction({
    input: UpdatePackageSchema,
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        throw new Error('Insufficient permissions');
      }

      const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");
      const { id, ...data } = input;

      // Check package exists
      const existing = await db.select()
        .from(servicePackages)
        .where(eq(servicePackages.id, id))
        .limit(1)
        .get();

      if (!existing) throw new Error('Package not found');

      // Build update object
      const updateData: Record<string, unknown> = {
        updatedAt: Math.floor(Date.now() / 1000),
      };

      if (data.name !== undefined) updateData.name = data.name;
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.type !== undefined) updateData.type = data.type;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.variants !== undefined) updateData.variants = JSON.stringify(data.variants);
      if (data.isActive !== undefined) updateData.isActive = data.isActive ? 1 : 0;
      if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

      await db.update(servicePackages)
        .set(updateData)
        .where(eq(servicePackages.id, id))
        .run();

      // Fetch updated package
      const updated = await db.select()
        .from(servicePackages)
        .where(eq(servicePackages.id, id))
        .limit(1)
        .get();

      return {
        success: true,
        data: updated ? {
          ...updated,
          variants: JSON.parse(updated.variants),
        } : null,
      };
    },
  }),

  // Delete package (super_admin only)
  delete: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      const user = await getAdminUser();
      if (!user) throw new Error('Unauthorized');
      if (user.role !== 'super_admin') throw new Error('Only super_admin can delete packages');

      const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");

      // Check package exists
      const existing = await db.select()
        .from(servicePackages)
        .where(eq(servicePackages.id, input.id))
        .limit(1)
        .get();

      if (!existing) throw new Error('Package not found');

      // Check if any businesses are using this package
      const businessesUsing = await db.select({ count: count() })
        .from(businesses)
        .where(eq(businesses.planSlug, existing.slug))
        .get();

      if (businessesUsing && businessesUsing.count > 0) {
        throw new Error(`Cannot delete package. ${businessesUsing.count} business(es) currently using this package.`);
      }

      await db.delete(servicePackages).where(eq(servicePackages.id, input.id)).run();

      return { success: true, message: 'Package deleted' };
    },
  }),

  // Get active packages by type (public view)
  getActiveByType: defineAction({
    input: z.object({
      type: PackageTypeEnum.optional(),
      category: PackageCategoryEnum.optional(),
    }).optional(),
    handler: async (input) => {
      const db = await getDb();
if (!db) throw new Error("Database not available");
if (!db) throw new Error("Database not available");

      let query = db.select()
        .from(servicePackages)
        .where(eq(servicePackages.isActive, 1))
        .orderBy(asc(servicePackages.sortOrder));

      // Note: Drizzle's where doesn't support OR well, so we'll filter in JS
      const allActive = await query.all();

      let filtered = allActive;
      if (input?.type) {
        filtered = filtered.filter(p => p.type === input.type);
      }
      if (input?.category) {
        filtered = filtered.filter(p => p.category === input.category);
      }

      return {
        success: true,
        data: filtered.map(pkg => ({
          ...pkg,
          variants: JSON.parse(pkg.variants),
        })),
      };
    },
  }),
};
