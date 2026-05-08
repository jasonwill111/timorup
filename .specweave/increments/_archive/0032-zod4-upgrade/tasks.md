# Tasks: Zod 4 API Upgrade (0032)

## Task Notation
- `[T-###]`: Task ID
- `[P]`: Parallelizable
- `[ ]`: Not started
- `[x]`: Completed

## Phase 1: Validation Schema Refactor

### T-001: Create Zod 4 validation schema
**References**: AC-US1-01, AC-US1-02
**Status**: [x] Completed

**Implementation Details**:
- Added PaginationSchema with z.coerce
- Added BooleanSchema with z.coerce.boolean()
- Project already uses z.email(), z.url() patterns

### T-002: Update API imports
**References**: AC-US1-02, AC-US2-01
**Status**: [x] Completed

**Implementation Details**:
- Updated src/pages/api/businesses/index.ts
- Updated src/pages/api/categories/[slug]/listings.ts
- Updated src/pages/api/admin/users/index.ts
- Replaced parseInt with PaginationSchema.parse()

## Phase 2: Verification

### T-003: Run build
**References**: All
**Status**: [x] Completed (pnpm build passes)

### T-004: Run tests
**References**: All
**Status**: [x] Completed (43 validation tests pass)
