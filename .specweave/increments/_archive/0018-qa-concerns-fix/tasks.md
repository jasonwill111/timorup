# Tasks: Address QA Concerns from 0015/0001

## Phase 1: Add BDD to 0015

### T-001: Add Acceptance Test Scenarios to 0015
**Description**: Add BDD scenarios table to 0015 spec

**References**: AC-US1-01, AC-US1-02, AC-US1-03

**Implementation**:
```
## Acceptance Test Scenarios
| Scenario | Given | When | Then |
|----------|-------|------|------|
| AT-01 | Authenticated request | GET /api/auth/session | Returns session data |
| AT-02 | Authenticated request | POST /api/businesses | Returns 201 with business |
| ... |
```

**Test Plan**: N/A (documentation only)
**Dependencies**: None
**Status**: [x] completed

---

### T-002: Add Edge Cases to 0015
**Description**: Add edge cases table to 0015 spec

**References**: AC-US2-01, AC-US2-02

**Implementation**:
```
## Edge Cases
| Case | Handling |
|------|----------|
| Session expired | Return 401 |
| Duplicate slug | Return 400 SLUG_EXISTS |
| ...
```

**Test Plan**: N/A (documentation only)
**Dependencies**: T-001
**Status**: [x] completed

---

## Phase 2: Add Edge Cases to 0001

### T-003: Add Edge Cases to 0001
**Description**: Add edge cases table to 0001 spec

**References**: AC-US3-01, AC-US3-02

**Implementation**:
```
## Edge Cases
| Case | Handling |
|------|----------|
| Race: fast consecutive creates | Both succeed if races — admin handles |
| ...
```

**Test Plan**: N/A (documentation only)
**Dependencies**: None
**Status**: [x] completed

---

## Summary

| Task | Status |
|------|--------|
| T-001 BDD 0015 | [x] completed |
| T-002 Edge Cases 0015 | [x] completed |
| T-003 Edge Cases 0001 | [x] completed |
