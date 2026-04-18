# Implementation Plan: 0003-deps-cleanup-react-removal

## Overview

Remove React/shadcn dependencies and add lucide-astro. This is a pure dependency cleanup task with minimal architectural decisions.

## Architecture

This increment is purely dependency management. No new architecture is introduced.

## Technology Stack Changes

### Dependencies to REMOVE
```json
{
  "@astrojs/react": "^4.4.2",
  "@base-ui/react": "^1.2.0",
  "@radix-ui/react-slot": "^1.2.4",
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "class-variance-authority": "^0.7.1",
  "sonner": "^1.7.4"
}
```

### DevDependencies to REMOVE
```json
{
  "@testing-library/react": "^16.3.2",
  "@types/react": "^19.2.14",
  "@types/react-dom": "^19.2.3"
}
```

### Dependencies to ADD
```json
{
  "lucide-astro": "^0.500.0"
}
```

### Dependencies to RETAIN
- TipTap packages (framework-agnostic): `@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `@tiptap/pm`
- State management: `nanostores`, `@nanostores/react`
- UI utilities: `clsx`, `tailwind-merge`
- Other: `astro`, `tailwindcss`, `drizzle-orm`, `hono`, etc.

## Configuration Changes

### astro.config.mjs
- Remove `import react from '@astrojs/react'`
- Remove `react()` from integrations array

### tsconfig.json
- Remove or update JSX-related settings if needed
- Astro handles JSX transformation, so no React-specific config needed

## Implementation Phases

### Phase 1: Update package.json
1. Remove React dependencies
2. Add lucide-astro
3. Run pnpm install

### Phase 2: Update Configuration
1. Update astro.config.mjs
2. Update tsconfig.json (if needed)

### Phase 3: Verify
1. Run pnpm install
2. Run pnpm build
3. Fix any remaining issues

## Testing Strategy

1. **pnpm install** - verify all dependencies resolve
2. **pnpm build** - verify build succeeds
3. **pnpm typecheck** - verify no TypeScript errors

## Technical Challenges

### Challenge 1: Orphaned Imports
**Solution**: After dependency removal, some imports may fail. These will be fixed in subsequent increments (UI component migration).
**Risk**: Low - imports will be caught at build time

### Challenge 2: TipTap with @nanostores/react
**Solution**: Keep `@nanostores/react` for now. It doesn't require React runtime, just type definitions for React hooks.
**Risk**: Low - this is a valid use case for nanostores
