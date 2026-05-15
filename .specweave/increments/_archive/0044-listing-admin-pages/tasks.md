# Tasks: Listing Admin Pages

## T-001: Rewrite /admin/listings/index.astro
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01 | **Status**: [x] completed
**Test**: Given listings table → When visit /admin/listings → Then shows stats + CRUD table

---

## T-002: Create /admin/listings/new/index.astro
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02 | **Status**: [x] completed
**Test**: Given /admin/listings/new → When fill form + submit → Then listing created

---

## T-003: API Integration with /api/admin/listing
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01 | **Status**: [x] completed
**Test**: Given API calls → When GET/POST/PUT/DELETE → Then正确返回

---

## T-004: Status Toggle (Publish/Unpublish)
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02 | **Status**: [x] completed
**Test**: Given listing → When click Unpublish → Then status changes to draft