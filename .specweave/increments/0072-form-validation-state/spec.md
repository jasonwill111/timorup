---
status: completed
---
# Feature: Form Validation & State Enhancement

## Overview

Add visual error states to form components (Input, Select), a loading spinner to Button, and real-time validation feedback to AuthCard forms for improved UX.

---

## User Stories

### US-001: Input Error State
**Project**: timorup
**As a** user **I want** to see clear error feedback on invalid form inputs **So that** I can quickly identify and correct mistakes

**Acceptance Criteria**:
- [x] **AC-US1-01**: Input component accepts `error?: boolean` prop
- [x] **AC-US1-01**: When `error={true}`, input shows red border (`border-red-500`)
- [x] **AC-US1-01**: When `error={true}`, input displays `aria-invalid="true"` for accessibility
- [x] **AC-US1-02**: Select component accepts `error?: boolean` prop
- [x] **AC-US1-02**: When `error={true}`, select shows red border (`border-red-500`)

---

### US-002: Button Loading Spinner
**Project**: timorup
**As a** user **I want** to see a loading indicator when a form is submitting **So that** I know my action is being processed

**Acceptance Criteria**:
- [x] **AC-US2-01**: Button component accepts `loading?: boolean` prop
- [x] **AC-US2-01**: When `loading={true}`, button is disabled and shows a spinning loader
- [x] **AC-US2-01**: Loading spinner uses CSS animation (no external dependencies)
- [x] **AC-US2-01**: Button text/icon remains visible during loading state

---

### US-003: AuthCard Real-Time Validation
**Project**: timorup
**As a** user **I want** immediate feedback when I enter invalid data in auth forms **So that** I can fix errors before submitting

**Acceptance Criteria**:
- [x] **AC-US3-01**: AuthCard forms validate email format on blur with inline error messages
- [x] **AC-US3-01**: AuthCard forms validate password requirements on blur (min 8 chars)
- [x] **AC-US3-01**: Error messages appear below respective input fields using Input error state
- [x] **AC-US3-01**: Valid inputs show subtle success indicator (green checkmark)
- [x] **AC-US3-02**: On form submit, all fields are validated and errors displayed if any
- [x] **AC-US3-02**: Submit button shows loading spinner during submission

---

## Technical Notes

| Component | File | Required Changes |
|-----------|------|------------------|
| Input | `src/components/ui/Input.astro` | Add `error` prop, red border, aria-invalid |
| Select | `src/components/ui/Select.astro` | Add `error` prop, red border |
| Button | `src/components/ui/Button.astro` | Add `loading` prop, CSS spinner |
| AuthCard | `src/components/forms/AuthCard.astro` | Integrate validation logic |

## Out of Scope

- Backend validation logic (forms call existing server actions)
- Client-side validation library integration
- Custom error message theming

## Dependencies

- Existing Input, Select, Button components
- Existing toast store (already supports success variant)
- Existing AuthCard forms (signIn, signUp, forgotPassword, resetPassword)
