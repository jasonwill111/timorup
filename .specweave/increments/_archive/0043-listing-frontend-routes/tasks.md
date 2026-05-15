# Tasks: Listing Frontend Routes

## T-001: Rewrite /listings/index.astro
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01 | **Status**: [x] completed
**Test**: Given listings table → When visit /listings → Then shows listings with price/condition

---

## T-002: Create /listing/[slug].astro
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02, AC-US1-03 | **Status**: [x] completed
**Test**: Given listing exists → When visit /listing/slug → Then shows full detail

---

## T-003: Entity Type Badge
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02 | **Status**: [x] completed
**Test**: Given any listing page → Then entity type badge visible

---

## T-004: 404 for Non-existent Personal
**User Story**: US-001 | **Satisfies ACs**: AC-US1-04 | **Status**: [x] completed
**Test**: Given /personal/non-existent → Then 404 page shown

---

## T-005: Keep Business Routes Working
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01 | **Status**: [x] completed
**Test**: Given /business/existing → Then listing page loads

---

## T-006: Directory Filter by Entity Type
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01 | **Status**: [ ] pending
**Test**: Given directory page → When click "Personal" filter → Then personal only shown