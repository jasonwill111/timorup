# TailwindCSS v4 (timorlist)

> v4.2.1 | CSS-based config | Vite plugin

## Setup

```css
/* src/styles/globals.css */
@import "tailwindcss";
@theme {
  --color-background: #FDFBF7;
  --color-foreground: #1a1a1a;
  --color-primary: #FFD150;
  --color-muted-foreground: #6B7280;
}
```

**无需** `tailwind.config.mjs` — v4 在 CSS 中配置

## 组件策略

| Layer | 方案 | JS Bundle |
|-------|------|-----------|
| 1 (默认) | .astro | 0 KB |
| 2 (进阶) | .astro + nanostores | < 5 KB |
| 3 (最后) | React Islands | +40 KB |

## 颜色主题

```css
/* Light mode (default) */
:root {
  --color-background: #FDFBF7;
  --color-foreground: #1a1a1a;
  --color-primary: #FFD150;
}

/* Dark mode */
.dark {
  --color-background: #0A0F1A;
  --color-foreground: #f1f5f9;
  --color-primary: #FFD150;
}
```

## 常用类

```html
<!-- 布局 -->
<div class="container mx-auto px-4 max-w-6xl">
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

<!-- 卡片 -->
<div class="bg-card border rounded-xl p-6 shadow-sm">

<!-- 按钮 -->
<button class="px-4 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/90">
```

## Mobile First

```html
<!-- 移动优先，渐进增强 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <!-- 1列 (mobile) → 2列 (md) → 4列 (lg) -->
</div>
```

## Lucide 图标

```astro
---
import { MapPin, Phone, Mail } from 'lucide-astro';
---
<MapPin class="w-5 h-5" />
```
