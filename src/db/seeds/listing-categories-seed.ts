/**
 * Listing Categories Seed Data - SQL Generation
 * TimorUp - Comprehensive Classification Ads Categories
 *
 * Run this to generate SQL insert statements
 */

export const listingCategories = require('./categories');

// Generate SQL for drizzle-kit seed or direct SQL execution
export function generateSQL() {
  return listingCategories.map(cat => `
INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields, created_at, updated_at)
VALUES (
  '${cat.id}',
  '${cat.name.replace(/'/g, "''")}',
  '${cat.slug}',
  '${cat.description?.replace(/'/g, "''") || ''}',
  '${cat.icon}',
  ${cat.parentId ? `'${cat.parentId}'` : 'NULL'},
  ${cat.sortOrder},
  ${cat.isActive ? 1 : 0},
  '${cat.formFields.replace(/'/g, "''")}',
  ${Math.floor(Date.now() / 1000)},
  ${Math.floor(Date.now() / 1000)}
);`).join('\n');
}

export default listingCategories;