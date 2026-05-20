# Tasks: Form Validation & State Enhancement (0072)

---

## US-001: Input Error State

### T-001: Add `error` prop to Input component
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01
**Status**: [x] completed
**Test Plan**:
- **TC-001**: Given an Input component with `error={true}` When rendered Then the input element has class `border-red-500`
- **TC-002**: Given an Input component with `error={true}` When rendered Then the input element has attribute `aria-invalid="true"`
- **TC-003**: Given an Input component with `error={false}` or undefined When rendered Then the input has no red border and no `aria-invalid` attribute
- **TC-004**: Given an Input component with `error={true}` and `disabled={true}` When rendered Then both error styling and disabled styling are applied

### T-002: Add `error` prop to Select component
**User Story**: US-001 | **Satisfies ACs**: AC-US1-02
**Status**: [x] completed
**Test Plan**:
- **TC-005**: Given a Select component with `error={true}` When rendered Then the select element has class `border-red-500`
- **TC-006**: Given a Select component with `error={false}` or undefined When rendered Then the select has no red border
- **TC-007**: Given a Select component with `error={true}` and `disabled={true}` When rendered Then both error styling and disabled styling are applied

---

## US-002: Button Loading Spinner

### T-003: Add `loading` prop and CSS spinner to Button component
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01
**Status**: [x] completed
**Test Plan**:
- **TC-008**: Given a Button component with `loading={true}` When rendered Then the button is disabled (`disabled` attribute present)
- **TC-009**: Given a Button component with `loading={true}` When rendered Then a spinning loader is visible inside the button
- **TC-010**: Given a Button component with `loading={true}` When rendered Then the spinner uses CSS animation (keyframes) with no external dependencies
- **TC-011**: Given a Button component with `loading={true}` and a child slot containing text/icon When rendered Then the slot content remains visible alongside the spinner
- **TC-012**: Given a Button component with `loading={false}` or undefined When rendered Then no spinner is rendered

---

## US-003: AuthCard Real-Time Validation

### T-004: Implement email validation on AuthCard forms
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01
**Status**: [x] completed
**Test Plan**:
- **TC-013**: Given an AuthCard form with an email input When the user blurs out of the email field with an invalid email (no @) Then an inline error message appears below the input using the Input error state (`border-red-500`)
- **TC-014**: Given an AuthCard form with an email input When the user blurs out of the email field with a valid email address Then a subtle green checkmark success indicator is shown
- **TC-015**: Given an AuthCard form with an email input When the user types and the email becomes valid after being invalid Then the error clears and a success indicator appears

### T-005: Implement password validation on AuthCard forms
**User Story**: US-003 | **Satisfies ACs**: AC-US3-01
**Status**: [x] completed
**Test Plan**:
- **TC-016**: Given an AuthCard form with a password input When the user blurs with fewer than 8 characters Then an inline error message appears below the input using the Input error state
- **TC-017**: Given an AuthCard form with a password input When the user blurs with 8 or more characters Then a subtle green checkmark success indicator is shown
- **TC-018**: Given an AuthCard form with a password input When the user types and the password reaches 8 characters after being shorter Then the error clears and a success indicator appears

### T-006: Handle form submit with validation and loading state
**User Story**: US-003 | **Satisfies ACs**: AC-US3-02
**Status**: [x] completed
**Test Plan**:
- **TC-019**: Given an AuthCard form with invalid fields When the user clicks submit Then all fields are validated, errors displayed below respective inputs, and no submission occurs
- **TC-020**: Given an AuthCard form with valid fields When the user clicks submit Then the submit button shows a loading spinner
- **TC-021**: Given an AuthCard form during submission (loading) When the submission completes Then the loading spinner is removed and the form resets or navigates as appropriate

---

## Out of Scope (not covered by tasks)

| Item | Reason |
|------|--------|
| Backend validation logic | Forms call existing server actions |
| Custom error message theming | Out of scope per spec |
| Client-side validation library | Custom implementation per spec |
