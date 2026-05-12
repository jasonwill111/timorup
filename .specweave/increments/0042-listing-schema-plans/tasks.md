# Tasks: Listing Schema and Plans

## T-001: Add Personal entityType
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01 | **Status**: [x] completed
**Test**: Given user → When POST /api/listings with entityType='personal' → Then listing created with entityType='personal'

---

## T-002: Personal Listing Route
**User Story**: US-001 | **Satisfies ACs**: AC-US1-03 | **Status**: [ ] pending
**Test**: Given personal listing → When visit /personal/[slug] → Then page shows with owner name

---

## T-003: One Personal Listing Per User
**User Story**: US-001 | **Satisfies ACs**: AC-US1-04 | **Status**: [ ] pending
**Test**: Given user with personal listing → When create another → Then error returned

---

## T-004: Add New Plan Periods
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01 | **Status**: [x] completed
**Test**: Given plans table → When query by period='trial_3d' → Then plan returned

---

## T-005: Plan Selection During Creation
**User Story**: US-002 | **Satisfies ACs**: AC-US2-02 | **Status**: [ ] pending
**Test**: Given new user → When select plan during registration → Then planType set on listing

---

## T-006: Trial to Active Conversion
**User Story**: US-002 | **Satisfies ACs**: AC-US2-03 | **Status**: [ ] pending
**Test**: Given trial listing → When payment completes → Then subscriptionStatus='active' and trialStartedAt set

---

## T-007: Subscription Status Enum
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01 | **Status**: [x] completed
**Test**: Given business_pages → When query by status='trial' → Then trial listings returned

---

## T-008: Expired Subscription Blocks Access
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02 | **Status**: [ ] pending
**Test**: Given expired subscription → When user accesses /business/[slug]/edit → Then 403 returned

---

## T-009: Subscription Expiry Job
**User Story**: US-003 | **Satisfies ACs**: AC-US3-04 | **Status**: [ ] pending
**Test**: Given trial expires today → When _mark-expired runs → Then status='expired'

---

## T-010: Active Listings Filter
**User Story**: US-004 | **Satisfies ACs**: AC-US4-01, AC-US4-02 | **Status**: [ ] pending
**Test**: Given expired listing → When search → Then expired NOT in results

---

## T-011: Expired Banner
**User Story**: US-004 | **Satisfies ACs**: AC-US4-03 | **Status**: [ ] pending
**Test**: Given expired listing → When visit /business/[slug] → Then "Expired" banner shown

---

## T-012: Public Plans API
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01 | **Status**: [x] completed
**Test**: Given GET /api/plans/active → When no auth → Then public plans returned