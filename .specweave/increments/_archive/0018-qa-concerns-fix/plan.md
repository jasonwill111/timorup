# Plan: Address QA Concerns from 0015/0001

## Context

QA flagged CONCERNS on 0015 (score 60) and 0001 (score 66):
- Completeness: missing test scenarios
- Edge cases: undocumented edge handling

## Approach

1. Add Acceptance Test Scenarios table to 0015 spec
2. Add Edge Cases table to 0015 spec
3. Add Edge Cases table to 0001 spec

## Files Changed

- `.specweave/increments/0015-hono-removal/spec.md`
- `.specweave/increments/0001-one-business-per-user/spec.md`

## Verification

Run `specweave qa 0018 --gate` after changes.
