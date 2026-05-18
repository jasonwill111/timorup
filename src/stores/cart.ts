/**
 * Cart Store - Nanostores
 * 购物车状态管理
 */
import { atom, computed } from 'nanostores';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export const $cartItems = atom<CartItem[]>([]);

// Computed values
export const $cartCount = computed([$cartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);

export const $cartTotal = computed([$cartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Actions
export function addToCart(item: Omit<CartItem, 'quantity'>) {
  const items = $cartItems.get() ?? undefined;
  const existing = items.find(i => i.productId === item.productId);

  if (existing) {
    // Update quantity
    $cartItems.set(
      items.map(i =>
        i.productId === item.productId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  } else {
    // Add new item
    $cartItems.set([...items, { ...item, quantity: 1 }]);
  }
}

export function removeFromCart(productId: string) {
  $cartItems.set($cartItems.get().filter(i => i.productId !== productId));
}

export function updateQuantity(productId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  $cartItems.set(
    $cartItems.get().map(i =>
      i.productId === productId ? { ...i, quantity } : i
    )
  );
}

export function clearCart() {
  $cartItems.set([]);
}

// Persistence
export function saveCartToStorage() {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart', JSON.stringify($cartItems.get()));
}

export function loadCartFromStorage() {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem('cart');
  if (stored) {
    try {
      $cartItems.set(JSON.parse(stored));
    } catch {
      // Invalid JSON, ignore
    }
  }
}