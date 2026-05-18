// Client-side auth helper
// Lazy-loads session from API and caches in memory

import type { Role } from './permissions';

export interface ClientUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  image: string | null;
}

// In-memory cache (cleared on page refresh)
let cachedUser: ClientUser | null = null;
let fetchPromise: Promise<ClientUser | null> | null = null;

// Fetch current user from session API
export async function getCurrentUser(): Promise<ClientUser | null> {
  // Return cached if available
  if (cachedUser) {
    return cachedUser;
  }

  // Prevent concurrent fetches
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const res = await fetch('/api/auth/session', {
        credentials: 'include',
      });
      const data = await res.json() as { user?: { id: string; email: string; name: string; role?: string; image?: string | null } };

      if (data.user) {
        cachedUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: (data.user.role as Role) || 'user',
          image: data.user.image ?? null,
        };
        return cachedUser;
      }

      return null;
    } catch (error) {
      console.error('[AuthClient] Failed to fetch session:', error);
      return null;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

// Clear cached user (call on logout)
export function clearCachedUser(): void {
  cachedUser = null;
}

// Check if user has specific role
export async function hasRole(minRole: Role): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const roleHierarchy: Record<Role, number> = {
    user: 1,
    editor: 2,
    admin: 3,
    super_admin: 4,
  };

  return roleHierarchy[user.role] >= roleHierarchy[minRole];
}

// Check if user can access admin
export async function canAccessAdmin(): Promise<boolean> {
  return hasRole('editor');
}

// Check if user is super_admin
export async function isSuperAdmin(): Promise<boolean> {
  return hasRole('super_admin');
}
