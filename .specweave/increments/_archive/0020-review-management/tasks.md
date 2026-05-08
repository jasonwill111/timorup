# Tasks: Review Reply & Admin Delete

## Phase 1: Schema

### T-001: Add reply columns to reviews table
**Description**: Add reply, repliedAt, repliedBy columns to reviews schema

**References**: AC-US1-03

**Implementation**:
```typescript
// src/db/schema/index.ts - add to reviews table
reply: text('reply'),
repliedAt: text('replied_at'),
repliedBy: text('replied_by'),
```

**BDD Test Plan**:
- **Given** reviews table exists with existing data
- **When** migration runs with new columns
- **Then** existing reviews have null reply fields

**Dependencies**: None
**Status**: [x] completed

---

## Phase 2: Reply API Endpoints

### T-002: Reply CRUD endpoints
**Description**: `POST/PUT/DELETE /api/reviews/:id/reply`

**References**: AC-US1-02, AC-US1-03, AC-US1-04, AC-US1-05, AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04

**Implementation**:
- POST: Create reply (one-time only, check if already replied)
- PUT: Update existing reply
- DELETE: Delete user's reply
- Validate session is business owner
- Return updated review

**BDD Test Plan**:
| Scenario | Given | When | Then |
|----------|-------|------|------|
| TC-001: Create reply | Auth user owns business | POST /api/reviews/:id/reply | HTTP 201, reply saved |
| TC-002: Already replied | Auth user replied before | POST /api/reviews/:id/reply | HTTP 400 ALREADY_REPLIED |
| TC-003: Update reply | Auth user owns reply | PUT /api/reviews/:id/reply | HTTP 200, reply updated |
| TC-004: Delete reply | Auth user owns reply | DELETE /api/reviews/:id/reply | HTTP 200, reply cleared |
| TC-005: No session | No auth cookie | POST /api/reviews/:id/reply | HTTP 401 UNAUTHORIZED |
| TC-006: Not owner | User doesn't own business | POST /api/reviews/:id/reply | HTTP 403 FORBIDDEN |

**Dependencies**: T-001
**Status**: [x] completed

### T-003: Update reviews GET to include reply data
**Description**: Modify GET /api/reviews to return reply fields

**References**: AC-US3-04

**BDD Test Plan**:
| Scenario | Given | When | Then |
|----------|-------|------|------|
| TC-001: GET returns reply | Reviews with replies exist | GET /api/reviews?businessPageId=X | Reply fields included |

**Dependencies**: T-002
**Status**: [x] completed

---

## Phase 3: Admin API Endpoints

### T-004: Admin reviews list with search/filter
**Description**: `GET /api/admin/reviews` with search/filter/pagination

**References**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04

**BDD Test Plan**:
| Scenario | Given | When | Then |
|----------|-------|------|------|
| TC-001: Admin list | Admin session | GET /api/admin/reviews | HTTP 200, all reviews |
| TC-002: Search | Reviews with "cafe" | GET /api/admin/reviews?search=cafe | Filtered by business/user/comment |
| TC-003: Rating filter | Various ratings | GET /api/admin/reviews?rating=5 | Only 5-star reviews |
| TC-004: Non-admin | Regular user | GET /api/admin/reviews | HTTP 403 |

**Dependencies**: T-003
**Status**: [x] completed

### T-005: Admin delete endpoint
**Description**: `DELETE /api/admin/reviews/:id`

**References**: AC-US2-05, AC-US2-06, AC-US2-07, AC-US3-06

**BDD Test Plan**:
| Scenario | Given | When | Then |
|----------|-------|------|------|
| TC-001: Delete | Admin session | DELETE /api/admin/reviews/:id | HTTP 200, review deleted |
| TC-002: Non-admin | Regular user | DELETE /api/admin/reviews/:id | HTTP 403 |
| TC-003: Rating update | Review deleted | DELETE /api/admin/reviews/:id | Business rating recalculated |

**Dependencies**: T-004
**Status**: [x] completed

---

## Phase 4: Frontend

### T-006: Update account page with reviews section
**Description**: Add reviews list with reply button to `/account`

**References**: AC-US1-01

**BDD Test Plan**:
| Scenario | Given | When | Then |
|----------|-------|------|------|
| TC-001: Shows reviews | User has business with reviews | Visit /account | Reviews displayed |
| TC-002: Reply button | Unreplied review | Click Reply | Modal opens |
| TC-003: Edit reply | Own reply exists | Click Edit | Modal with current reply |
| TC-004: Delete reply | Own reply exists | Click Delete | Reply removed |

**Dependencies**: T-003
**Status**: [x] completed

### T-007: Update business page with replies
**Description**: Display reviews with replies on `/business/:slug`

**References**: AC-US1-06

**BDD Test Plan**:
| Scenario | Given | When | Then |
|----------|-------|------|------|
| TC-001: Shows reply | Review has reply | View business page | Reply displayed below review |

**Dependencies**: T-006
**Status**: [x] completed

### T-008: Create admin reviews page
**Description**: Create `/admin/reviews` with search/filter/delete

**References**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04, AC-US2-05

**BDD Test Plan**:
| Scenario | Given | When | Then |
|----------|-------|------|------|
| TC-001: Search | Input search term | Type in search box | Reviews filtered |
| TC-002: Rating filter | Select rating | Choose 4 stars | Only 4-star shown |
| TC-003: Date filter | Select date range | Pick from/to dates | Reviews in range |
| TC-004: Delete | Click Delete | Confirm in modal | Review removed |

**Dependencies**: T-005
**Status**: [x] completed

---

## Phase 5: Migration

### T-009: Generate and push D1 migration
**Description**: `pnpm db:generate` and `pnpm db:push`

**BDD Test Plan**:
| Scenario | Given | When | Then |
|----------|-------|------|------|
| TC-001: Migration | Schema updated | pnpm db:push | New columns in D1 |

**Dependencies**: T-001
**Status**: [x] completed

---

## Summary

| Task | Status |
|------|--------|
| T-001 Schema | [x] completed |
| T-002 Reply CRUD API | [x] completed |
| T-003 Reviews GET update | [x] completed |
| T-004 Admin list API | [x] completed |
| T-005 Admin delete API | [x] completed |
| T-006 Account page | [x] completed |
| T-007 Business page | [x] completed |
| T-008 Admin page | [x] completed |
| T-009 Migration | [x] completed |
