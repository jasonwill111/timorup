---
increment: 0008-ui-refresh
title: "UI Color & Layout Refresh"
generated: 2026-04-19
source: planner
version: "1.0"
status: active
---

# Quality Contract: UI Color & Layout Refresh

## Quality Gates

| Gate | Criterion | Status |
|------|-----------|--------|
| G1 | Primary color `#FFD700` applied globally | [x] PASS |
| G2 | Dark background `#1E1E2E` in dark mode | [x] PASS |
| G3 | Cards use rounded-xl with hover lift | [x] PASS |
| G4 | Search bar uses rounded-full design | [!] PARTIAL — padding mismatch (px-5 vs px-6) |
| G5 | Admin sidebar dark with icons | [x] PASS |
| G6 | All pages build without errors | [x] PASS |
| G7 | Typography (Inter + Oswald) | [!] FAIL — DM Sans used instead of Inter |
| G8 | Theme color meta tag | [!] FAIL — still uses #FFD150 | |

## Visual Checklist

### Light Mode
- [ ] Primary buttons: `#FFD700` background
- [ ] Links: `#FFD700` color
- [ ] Focus rings: `#FFD700`
- [ ] Background: `#FDFBF7`

### Dark Mode
- [ ] Background: `#1E1E2E`
- [ ] Cards: `#2A2A3E`
- [ ] Primary: `#FFD700`
- [ ] Borders: `#3A3A4E`

### Components
- [ ] Cards: rounded-xl + hover lift
- [ ] Search: rounded-full pill
- [ ] Tags: rounded-full pill
- [ ] Admin sidebar: dark + icons
