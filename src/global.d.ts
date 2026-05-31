/**
 * Global TypeScript declarations
 */

// Window interface extensions for Astro components
interface Window {
  // TipTap Editor
  initTipTapEditor: (element: HTMLElement, options?: { placeholder?: string; content?: string }) => Promise<void>;
  // Admin Category functions
  editCategory: (id: string) => void;
  deleteCategory: (id: string) => void;
  // Admin Hero functions
  editHero: (id: string) => void;
  // Blog preview
  previewBlog: (content: string) => void;
  // Toast notifications
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  // AI Tools actions result type
  actionResult?: { data?: unknown; error?: { message?: string } };
}

// Extend globalThis for runtime globals
declare global {
  interface GlobalThis {
    showModal?: (id: string) => void;
    hideModal?: (id: string) => void;
  }
}

export {};
