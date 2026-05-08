# Tasks: Admin Media Upload UI

## Phase 1: Categories Page

### T-001: Add upload UI to categories.astro
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04 | **Status**: [x] completed

**Test**: Given admin on categories page → When click upload → Then image uploads and preview shows

**Implementation**:
1. Replace image URL `<input>` (line 126-129) with upload dropzone + file input + preview ✅
2. Add `catImageId` variable and handlers after line 155 ✅
3. Update form submission to use `catImageId` ✅
4. Update edit mode to load existing image ✅
5. Update modal reset to clear image state ✅

---

## Phase 2: Heroes Page

### T-002: Add upload UI to heroes.astro
**User Story**: US-002 | **Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-04 | **Status**: [x] completed

**Test**: Given admin on heroes page → When click upload → Then image uploads and preview shows

**Implementation**:
1. Replace image URL `<input>` (line 48-50) with upload dropzone + file input + preview ✅
2. Add `heroImageId` variable and handlers after line 79 ✅
3. Update edit mode to load existing image ✅
4. Update modal reset to clear image state ✅

---

## Summary

| Task | Status |
|------|--------|
| T-001 Categories upload UI | [x] completed |
| T-002 Heroes upload UI | [x] completed |