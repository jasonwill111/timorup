/**
 * Blog Categories Seed Data
 * TimorUp - Blog/News Categories
 */

export const blogCategories = [
  {
    id: 'blc-1',
    name: 'News',
    slug: 'news',
    description: 'Latest news and updates',
    icon: '📰',
    parentId: null,
    sortOrder: 1,
    isActive: 1
  },
  {
    id: 'blc-2',
    name: 'Business',
    slug: 'business',
    description: 'Business tips and success stories',
    icon: '💼',
    parentId: null,
    sortOrder: 2,
    isActive: 1
  },
  {
    id: 'blc-3',
    name: 'Travel',
    slug: 'travel',
    description: 'Travel guides and recommendations',
    icon: '✈️',
    parentId: null,
    sortOrder: 3,
    isActive: 1
  },
  {
    id: 'blc-4',
    name: 'Culture',
    slug: 'culture',
    description: 'Timorese culture and traditions',
    icon: '🎭',
    parentId: null,
    sortOrder: 4,
    isActive: 1
  },
  {
    id: 'blc-5',
    name: 'Food',
    slug: 'food',
    description: 'Food and recipes',
    icon: '🍽�?,
    parentId: null,
    sortOrder: 5,
    isActive: 1
  },
  {
    id: 'blc-6',
    name: 'Events',
    slug: 'events',
    description: 'Upcoming events and activities',
    icon: '📅',
    parentId: null,
    sortOrder: 6,
    isActive: 1
  },
  {
    id: 'blc-7',
    name: 'Community',
    slug: 'community',
    description: 'Community stories and initiatives',
    icon: '👥',
    parentId: null,
    sortOrder: 7,
    isActive: 1
  },
  {
    id: 'blc-8',
    name: 'Tips',
    slug: 'tips',
    description: 'Helpful tips and guides',
    icon: '💡',
    parentId: null,
    sortOrder: 8,
    isActive: 1
  }
];

export const insertBlogCategoriesSQL = blogCategories.map(cat => `
  INSERT INTO blog_categories (id, name, slug, description, icon, parent_id, sort_order, is_active)
  VALUES (
    '${cat.id}',
    '${cat.name.replace(/'/g, "''")}',
    '${cat.slug}',
    '${cat.description?.replace(/'/g, "''") || ''}',
    '${cat.icon}',
    ${cat.parentId ? `'${cat.parentId}'` : 'NULL'},
    ${cat.sortOrder},
    ${cat.isActive ? 1 : 0}
  );
`).join('\n');

export default blogCategories;
