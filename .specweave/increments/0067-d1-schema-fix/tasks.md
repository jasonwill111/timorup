# Tasks: D1 Database Schema Fix

## Phase 1: Data Cleanup (CRITICAL - Must run before constraints)

### T-001: Clean up duplicate saved_items data
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-03 | **Status**: [x] completed

**Implementation Details**:
1. Query D1 for duplicate saved_items
2. Keep latest record per user+type+typeId combination
3. Delete duplicate records

**Test Plan**:
- **Command**: `wrangler d1 execute timorlist-db --remote --command "..."`
- **TC-001**: Verify duplicates removed
  - Given duplicate saved_items exist
  - When cleanup runs
  - Then only one record per user+type+typeId exists

---

### T-002: Clean up duplicate reviews data
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-03 | **Status**: [x] completed

**Implementation Details**:
1. Query D1 for duplicate reviews
2. Keep highest-rated record per user+business combination
3. Delete duplicate records

**Test Plan**:
- **Command**: `wrangler d1 execute timorlist-db --remote --command "..."`
- **TC-002**: Verify duplicates removed
  - Given duplicate reviews exist
  - When cleanup runs
  - Then only one record per user+business exists

---

## Phase 2: Add UNIQUE Constraints

### T-003: Add UNIQUE constraint to saved_items
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02 | **Status**: [x] completed

**Implementation Details**:
```sql
CREATE UNIQUE INDEX saved_items_user_type_typeId_idx ON saved_items(user_id, type, type_id);
```

**Test Plan**:
- **Command**: `wrangler d1 execute timorlist-db --remote --command "CREATE UNIQUE INDEX..."`
- **TC-003**: Verify constraint works
  - Given UNIQUE index created
  - When duplicate insert attempted
  - Then database returns constraint error

---

### T-004: Add UNIQUE constraint to reviews
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02 | **Status**: [x] completed

**Implementation Details**:
```sql
CREATE UNIQUE INDEX reviews_user_business_idx ON reviews(user_id, business_id);
```

**Test Plan**:
- **Command**: `wrangler d1 execute timorlist-db --remote --command "CREATE UNIQUE INDEX..."`
- **TC-004**: Verify constraint works
  - Given UNIQUE index created
  - When duplicate insert attempted
  - Then database returns constraint error

---

## Phase 3: Add Missing Columns

### T-005: Add government_data column to public_sectors
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01 | **Status**: [x] completed

**Implementation Details**:
```sql
ALTER TABLE public_sectors ADD COLUMN government_data TEXT;
```

**Test Plan**:
- **TC-005**: Column exists
  - Given public_sectors table
  - When PRAGMA table_info queried
  - Then government_data column exists with type TEXT

---

### T-006: Add sort_order column to products
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02, AC-US3-03 | **Status**: [x] completed

**Implementation Details**:
```sql
ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 0;
```

**Test Plan**:
- **TC-006**: Column exists with default
  - Given products table
  - When PRAGMA table_info queried
  - Then sort_order column exists with type INTEGER and default 0

---

## Phase 4: Add Performance Indexes

### T-007: Add indexes to products table
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01 | **Status**: [x] completed

**Implementation Details**:
```sql
CREATE INDEX products_business_idx ON products(business_id);
CREATE INDEX products_category_idx ON products(category_id);
CREATE UNIQUE INDEX products_slug_idx ON products(slug);
CREATE INDEX products_active_idx ON products(active);
```

**Test Plan**:
- **TC-007**: All indexes exist
  - Given products table
  - When PRAGMA index_list queried
  - Then shows: business_idx, category_idx, slug_idx, active_idx

---

### T-008: Add indexes to listings table
**User Story**: US-004 | **Satisfies ACs**: AC-US4-02 | **Status**: [x] completed

**Implementation Details**:
```sql
CREATE INDEX listings_owner_idx ON listings(owner_id);
CREATE INDEX listings_status_idx ON listings(status);
CREATE INDEX listings_category_idx ON listings(category_id);
CREATE INDEX listings_featured_idx ON listings(featured);
CREATE INDEX listings_expires_idx ON listings(expires_at);
```

**Test Plan**:
- **TC-008**: All indexes exist
  - Given listings table
  - When PRAGMA index_list queried
  - Then shows: owner_idx, status_idx, category_idx, featured_idx, expires_idx

---

### T-009: Add indexes to service_packages table
**User Story**: US-004 | **Satisfies ACs**: AC-US4-03 | **Status**: [x] completed

**Implementation Details**:
```sql
CREATE UNIQUE INDEX service_packages_slug_idx ON service_packages(slug);
CREATE INDEX service_packages_type_idx ON service_packages(type);
CREATE INDEX service_packages_category_idx ON service_packages(category);
CREATE INDEX service_packages_active_idx ON service_packages(is_active);
```

**Test Plan**:
- **TC-009**: All indexes exist
  - Given service_packages table
  - When PRAGMA index_list queried
  - Then shows: slug_idx (UNIQUE), type_idx, category_idx, active_idx

---

### T-010: Add indexes to reviews table
**User Story**: US-004 | **Satisfies ACs**: AC-US4-04 | **Status**: [x] completed

**Implementation Details**:
```sql
CREATE INDEX reviews_business_idx ON reviews(business_id);
CREATE INDEX reviews_user_idx ON reviews(user_id);
CREATE INDEX reviews_status_idx ON reviews(status);
```

**Test Plan**:
- **TC-010**: All indexes exist
  - Given reviews table
  - When PRAGMA index_list queried
  - Then shows: business_idx, user_idx, status_idx, user_business_idx

---

### T-011: Add indexes to saved_items table
**User Story**: US-004 | **Satisfies ACs**: AC-US4-05 | **Status**: [x] completed

**Implementation Details**:
```sql
CREATE INDEX saved_items_user_idx ON saved_items(user_id);
CREATE INDEX saved_items_type_idx ON saved_items(type);
CREATE INDEX saved_items_type_id_idx ON saved_items(type_id);
```

**Test Plan**:
- **TC-011**: All indexes exist
  - Given saved_items table
  - When PRAGMA index_list queried
  - Then shows: user_idx, type_idx, type_id_idx, user_type_typeId_idx (UNIQUE)

---

### T-012: Add indexes to latest_updates table
**User Story**: US-004 | **Satisfies ACs**: AC-US4-06 | **Status**: [x] completed

**Implementation Details**:
```sql
CREATE UNIQUE INDEX latest_updates_unique ON latest_updates(type, type_id);
CREATE INDEX latest_updates_type_idx ON latest_updates(type);
CREATE INDEX latest_updates_type_id_idx ON latest_updates(type_id);
```

**Test Plan**:
- **TC-012**: All indexes exist
  - Given latest_updates table
  - When PRAGMA index_list queried
  - Then shows: unique (UNIQUE), type_idx, type_id_idx

---

### T-013: Add indexes to media table
**User Story**: US-004 | **Satisfies ACs**: AC-US4-07 | **Status**: [x] completed

**Implementation Details**:
```sql
CREATE INDEX media_entity_idx ON media(entity_type, entity_id);
CREATE INDEX media_purpose_idx ON media(purpose);
CREATE INDEX media_deleted_idx ON media(deleted_at);
```

**Test Plan**:
- **TC-013**: All indexes exist
  - Given media table
  - When PRAGMA index_list queried
  - Then shows: entity_idx, purpose_idx, deleted_idx

---

### T-014: Add UNIQUE index to sessions table
**User Story**: US-004 | **Satisfies ACs**: AC-US4-08 | **Status**: [x] completed

**Implementation Details**:
```sql
CREATE UNIQUE INDEX sessions_token_idx ON sessions(token);
```

**Test Plan**:
- **TC-014**: UNIQUE index exists
  - Given sessions table
  - When PRAGMA index_list queried
  - Then shows: token_idx with UNIQUE flag

---

### T-015: Add index to blog_posts table
**User Story**: US-004 | **Satisfies ACs**: AC-US4-09 | **Status**: [x] completed

**Implementation Details**:
```sql
CREATE INDEX blog_posts_status_idx ON blog_posts(status);
```

**Test Plan**:
- **TC-015**: Index exists
  - Given blog_posts table
  - When PRAGMA index_list queried
  - Then shows: status_idx

---

### T-016: Add UNIQUE index to site_settings table
**User Story**: US-004 | **Satisfies ACs**: AC-US4-10 | **Status**: [x] completed

**Implementation Details**:
```sql
CREATE UNIQUE INDEX site_settings_key_idx ON site_settings(key);
```

**Test Plan**:
- **TC-016**: UNIQUE index exists
  - Given site_settings table
  - When PRAGMA index_list queried
  - Then shows: key_idx with UNIQUE flag

---

## Phase 5: Verification

### T-017: Final verification
**User Story**: All | **Satisfies ACs**: All | **Status**: [x] completed

**Implementation Details**:
1. Query all tables for indexes
2. Query all tables for columns
3. Test application functionality

**Test Plan**:
- **TC-017**: Full verification
  - Given all migrations executed
  - When we query PRAGMA index_list for all tables
  - Then all expected indexes exist
  - When we query PRAGMA table_info
  - Then all expected columns exist
  - When we test admin pages
  - Then all CRUD operations work

---

## Execution Order

1. T-001: Clean saved_items duplicates (CRITICAL - must run first)
2. T-002: Clean reviews duplicates (CRITICAL - must run first)
3. T-003: Add saved_items UNIQUE constraint
4. T-004: Add reviews UNIQUE constraint
5. T-005: Add public_sectors column
6. T-006: Add products column
7. T-007: products indexes
8. T-008: listings indexes
9. T-009: service_packages indexes
10. T-010: reviews indexes
11. T-011: saved_items indexes
12. T-012: latest_updates indexes
13. T-013: media indexes
14. T-014: sessions index
15. T-015: blog_posts index
16. T-016: site_settings index
17. T-017: Final verification