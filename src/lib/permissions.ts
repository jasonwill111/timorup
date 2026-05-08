// Role-Based Access Control Constants
// Centralized permission definitions for the auth system

export type Role = 'user' | 'editor' | 'admin' | 'super_admin';

// Role hierarchy (higher index = more permissions)
export const ROLE_HIERARCHY: Record<Role, number> = {
  user: 1,
  editor: 2,
  admin: 3,
  super_admin: 4,
};

// Check if role has at least the minimum required level
export function hasRole(userRole: Role, minRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole];
}

// Permission definitions
export const PERMISSIONS = {
  // User management
  // admin: manage user + editor (cannot promote to admin/super_admin)
  // super_admin: manage ALL roles (including admin/super_admin)
  canManageUsers: ['admin', 'super_admin'] as Role[],
  canManageAdmins: ['super_admin'] as Role[], // Only super_admin can edit admin/super_admin roles

  // AI Tools - same for admin and super_admin
  canAccessAITools: ['admin', 'super_admin'] as Role[],

  // Listings - editor can create business/non-profit
  canCreateListing: ['editor', 'admin', 'super_admin'] as Role[],
  canEditOwnListing: ['user', 'editor', 'admin', 'super_admin'] as Role[],
  canEditAnyListing: ['admin', 'super_admin'] as Role[],

  // Products
  canCreateProduct: ['editor', 'admin', 'super_admin'] as Role[],
  canEditOwnProduct: ['editor', 'admin', 'super_admin'] as Role[],
  canEditAnyProduct: ['admin', 'super_admin'] as Role[],

  // Categories - admin+ only
  canManageCategories: ['admin', 'super_admin'] as Role[],

  // Banners - admin+ only
  canManageBanners: ['admin', 'super_admin'] as Role[],

  // Media - admin+ only
  canManageMedia: ['admin', 'super_admin'] as Role[],

  // Reviews - admin+ only
  canManageReviews: ['admin', 'super_admin'] as Role[],

  // SKUs - editor can create, admin+ can manage full
  canCreateSku: ['editor', 'admin', 'super_admin'] as Role[],
  canManageSkus: ['admin', 'super_admin'] as Role[],

  // Blogs - editor can create, admin+ can manage full
  canCreateBlog: ['editor', 'admin', 'super_admin'] as Role[],
  canManageBlogs: ['admin', 'super_admin'] as Role[],

  // Subscriptions - admin+ only (editor cannot modify)
  canManageSubscriptions: ['admin', 'super_admin'] as Role[],

  // Heroes - admin+ only
  canManageHeroes: ['admin', 'super_admin'] as Role[],
} as const;

// Permission check helper
export function can(role: Role, permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission].includes(role);
}

// Admin layout navigation items with permission requirements
// editor: Dashboard, Listings, SKUs, Blogs (create only)
// admin+: All pages except Users/AITools for admin (admin can see, super_admin can manage)
// Users page: admin can manage user/editor, super_admin can manage all including admin
export const ADMIN_NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard', minRole: 'editor' as Role },
  { href: '/admin/listings', label: 'Listings', icon: 'building', minRole: 'editor' as Role },
  { href: '/admin/skus', label: 'SKUs', icon: 'tag', minRole: 'editor' as Role },
  { href: '/admin/blogs', label: 'Blogs', icon: 'newspaper', minRole: 'editor' as Role },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: 'document', minRole: 'admin' as Role },
  { href: '/admin/categories', label: 'Categories', icon: 'folder', minRole: 'admin' as Role },
  { href: '/admin/heroes', label: 'Heroes', icon: 'image', minRole: 'admin' as Role },
  { href: '/admin/media', label: 'Media', icon: 'photo', minRole: 'admin' as Role },
  { href: '/admin/reviews', label: 'Reviews', icon: 'star', minRole: 'admin' as Role },
  { href: '/admin/users', label: 'Users', icon: 'users', minRole: 'admin' as Role },
  { href: '/admin/ai-tools', label: 'AI Tools', icon: 'lightning', minRole: 'admin' as Role },
] as const;

// Role display names
export const ROLE_DISPLAY_NAMES: Record<Role, string> = {
  user: 'User',
  editor: 'Editor',
  admin: 'Admin',
  super_admin: 'Super Admin',
};

// Role badge colors (Tailwind classes)
export const ROLE_BADGE_CLASSES: Record<Role, string> = {
  user: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  editor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  super_admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};
