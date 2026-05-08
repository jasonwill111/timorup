// Skeleton utilities for consistent loading states

export const skeletonBaseClass = 'bg-muted rounded animate-pulse';

export const skeletonPresets = {
  line: 'h-4 w-full',
  text: 'h-4 w-3/4',
  circle: 'h-10 w-10 rounded-full',
  avatar: 'h-10 w-10 rounded-full',
  square: 'h-20 w-20 rounded-lg',
  card: 'aspect-[4/3] rounded-xl',
  thumbnail: 'w-8 h-8 rounded-lg',
  button: 'h-9 w-20 rounded',
};

// Create skeleton HTML string for JS templates
export function skeleton(variant: keyof typeof skeletonPresets = 'line', extraClass = ''): string {
  return `<div class="${skeletonBaseClass} ${skeletonPresets[variant]} ${extraClass}"></div>`;
}

// Business card skeleton
export function businessCardSkeleton(): string {
  return `
    <div class="block bg-card rounded-xl border shadow-sm overflow-hidden">
      <div class="${skeletonBaseClass} aspect-[4/3]"></div>
      <div class="p-3">
        <div class="${skeletonBaseClass} h-4 w-3/4 mb-2"></div>
        <div class="${skeletonBaseClass} h-3 w-1/2 mb-3"></div>
        <div class="flex items-center justify-between pt-2 border-t border-border/50">
          <div class="${skeletonBaseClass} h-3 w-16"></div>
          <div class="${skeletonBaseClass} h-5 w-12"></div>
        </div>
      </div>
    </div>
  `.trim();
}

// Product card skeleton
export function productCardSkeleton(): string {
  return `
    <div class="block bg-card rounded-xl border shadow-sm overflow-hidden">
      <div class="${skeletonBaseClass} aspect-square"></div>
      <div class="p-3">
        <div class="${skeletonBaseClass} h-4 w-3/4 mb-1"></div>
        <div class="${skeletonBaseClass} h-3 w-1/2 mb-2"></div>
        <div class="${skeletonBaseClass} h-5 w-20"></div>
      </div>
    </div>
  `.trim();
}

// Category skeleton
export function categorySkeleton(): string {
  return `
    <div class="p-4 text-center border rounded-xl">
      <div class="${skeletonBaseClass} w-10 h-10 mx-auto rounded-lg mb-2"></div>
      <div class="${skeletonBaseClass} h-4 w-16 mx-auto"></div>
    </div>
  `.trim();
}

// Create loading grid for multiple items
export function loadingGrid(count: number, type: 'business' | 'product' = 'business'): string {
  const template = type === 'business' ? businessCardSkeleton() : productCardSkeleton();
  return Array.from({ length: count }).map(() => template).join('');
}