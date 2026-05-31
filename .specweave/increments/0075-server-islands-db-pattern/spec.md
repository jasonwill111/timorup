# 0075: Server Islands DB Pattern Unification

## Context

Server Islands 运行在隔离的 V8 上下文中，必须使用正确的 DB 访问模式。

## User Stories

### US-001: Fix listing page Server Islands pattern
**Project**: timorup

**As a** developer
**I want** to ensure `/listing/[slug]` page works with Server Islands
**So that** users can view listing details correctly

**Acceptance Criteria**:
- [ ] **AC-0075-01**: `/listing/[slug]` returns full HTML page with listing details
- [ ] **AC-0075-02**: Listing page displays product title, description, price, contact info
- [ ] **AC-0075-03**: Database queries use `getDb()` pattern, not `initDb()` + `getDbInstance()`
- [ ] **AC-0075-04**: All dynamic pages (businesses, listings, non-profits, public-sectors) use consistent DB pattern
