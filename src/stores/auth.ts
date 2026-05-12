/**
 * User Auth Store - Nanostores
 * 统一客户端认证状态，替代散落的 localStorage/sessionStorage
 */
import { atom, computed } from 'nanostores';

export interface UserInfo {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}

export interface AuthStore {
  userId: string | null;
  userName: string | null;
  isLoggedIn: boolean;
  initialized: boolean;
}

// Client-side auth state
export const $userId = atom<string | null>(null);
export const $userName = atom<string | null>(null);
export const $userRole = atom<string | null>(null);

// Computed
export const $isLoggedIn = computed([$userId], (id) => !!id);

// Initialize from storage (call on client mount)
export function initAuthStore() {
  if (typeof window === 'undefined') return;

  const storedId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  const storedName = localStorage.getItem('userName') || sessionStorage.getItem('userName');
  const storedRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');

  if (storedId) {
    $userId.set(storedId);
    $userName.set(storedName);
    $userRole.set(storedRole);
  }
}

// Setters
export function setUser(id: string, name?: string, role?: string, persist = true) {
  $userId.set(id);
  $userName.set(name || null);
  $userRole.set(role || null);

  if (persist && typeof window !== 'undefined') {
    localStorage.setItem('userId', id);
    if (name) localStorage.setItem('userName', name);
    if (role) localStorage.setItem('userRole', role);
  }
}

export function clearUser() {
  $userId.set(null);
  $userName.set(null);
  $userRole.set(null);

  if (typeof window !== 'undefined') {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userRole');
  }
}

// Session-based login (not persistent)
export function setSessionUser(id: string, name?: string) {
  $userId.set(id);
  $userName.set(name || null);

  if (typeof window !== 'undefined') {
    sessionStorage.setItem('userId', id);
    if (name) sessionStorage.setItem('userName', name);
  }
}

export function clearSessionUser() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
  }
  // Keep localStorage userId if exists
  const localId = localStorage.getItem('userId');
  if (localId) {
    $userId.set(localId);
    $userName.set(localStorage.getItem('userName'));
  } else {
    $userId.set(null);
    $userName.set(null);
  }
}