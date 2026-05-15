# Implementation Plan: Admin子页面Mobile适配

## Overview

系统性对13个admin子页面进行mobile端UI/UX适配，使用Tailwind CSS响应式类实现。

## Architecture

### 技术方案
- **响应式框架**: Tailwind CSS utility classes
- **断点策略**: `md:` (768px) 区分mobile/desktop
- **无新增组件**: 仅修改现有页面结构

### 适配类型

| 类型 | Tailwind类 | 适用场景 |
|------|------------|----------|
| 表格横向滚动 | `overflow-x-auto` | businesses, users等列表页 |
| 卡片网格 | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | Dashboard, AI Tools |
| 表单全宽 | `w-full` | Settings, Forms |
| 按钮堆叠 | `flex-col` on mobile | 表单提交按钮 |
| 固定列 | `min-w-[150px]` | 表格第一列 |

### Mobile适配模式

#### 1. 表格适配
```html
<div class="overflow-x-auto">
  <table class="min-w-[600px]">  <!-- 固定最小宽度 -->
    ...
  </table>
</div>
```

#### 2. 卡片网格
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- cards -->
</div>
```

#### 3. 操作按钮
```html
<!-- Desktop: 横向 -->
<div class="hidden md:flex gap-2">
  <button>Edit</button>
  <button>Delete</button>
</div>
<!-- Mobile: 下拉 -->
<details class="md:hidden">
  <summary>Actions</summary>
  <button>Edit</button>
  <button>Delete</button>
</details>
```

## Implementation Phases

### Phase 1: Audit (US-001)
- 检查所有13个页面
- 记录每个页面的问题

### Phase 2: Dashboard & Settings (US-002)
- `admin/index.astro` - 卡片网格
- `admin/settings.astro` - 表单布局

### Phase 3: 列表页面 (US-003)
- 9个列表页面表格横向滚动

### Phase 4: 功能页面 (US-004)
- `admin/ai-tools.astro`
- `admin/media.astro`

## Testing Strategy

1. **Chrome DevTools**: 模拟iPhone SE (375px)
2. **Playwright**: E2E测试mobile viewport
3. **手动验证**: 实际手机测试

## Technical Challenges

### Challenge 1: 表格列过多
**Solution**: 固定关键列，其余可滚动
**Risk**: 低
