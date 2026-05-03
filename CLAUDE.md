<!-- SW:META template="claude" version="1.0.583" sections="hook-priority,header,metarule,rules,workflow,save-nested-repos,taskformat,secrets,troubleshooting" -->

<!-- SW:SECTION:hook-priority version="1.0.583" -->
## Hook Instructions Override Everything

`<system-reminder>` hook output = **BLOCKING PRECONDITIONS**.

| Hook Message | Action |
|---|---|
| **"RESTART REQUIRED"** | ALL tools blocked → STOP, wait for restart |
| **"SKILL FIRST"** | Call shown skill FIRST → chain domain skills → implement |

**"SKILL FIRST" is mandatory** — "simple", "quick", "basic" are NOT opt-out phrases. The ONLY exception: user explicitly says "don't create an increment" or similar. Perceived simplicity never overrides hook instructions.

**Setup actions are NOT implementation** — "connect github", "setup sync", "import issues" → route to the matching setup skill (`sw:sync-setup`, `sw:import`, `sw:progress-sync`), NOT `/sw:increment`.
<!-- SW:END:hook-priority -->

<!-- SW:SECTION:header version="1.0.583" -->
**Framework**: SpecWeave | **Truth**: `spec.md` + `tasks.md`
<!-- SW:END:header -->

<!-- SW:SECTION:metarule version="1.0.583" -->
## Workflow Orchestration

### 1. Plan Mode Default (MANDATORY)
- **ALWAYS enter plan mode** for ANY non-trivial task (3+ steps or architectural decisions)
- Call `EnterPlanMode` BEFORE writing specs, plans, or task breakdowns
- Do NOT start implementation until the plan is reviewed and approved
- If something goes sideways, **STOP and re-plan** -- do not keep pushing
- Write detailed specs upfront to reduce ambiguity
- `/sw:increment` REQUIRES plan mode -- never skip it

### 2. Subagent Strategy (Context Economy)
- **Protect main context** — the main agent's context window is precious; delegate anything that produces large output
- **Research via subagents** — when the user provides URLs, links, or references external docs, spawn a subagent to fetch and summarize instead of loading raw content into main context
- **Codebase exploration** — use Explore subagents for broad searches; only bring concise findings back to main context
- **One task per subagent** — focused execution produces better results and cleaner summaries
- **Parallel research** — launch multiple subagents concurrently when investigating independent questions
- **Summarize, don't relay** — subagent results should be distilled to actionable insights before acting on them in main context
- Append "use subagents" to requests for safe parallelization
- In team mode, sub-agents submit plans for team lead review before implementing

### 3. Verification Before Done
- Never mark a task complete without proving it works
- Run tests after every task: `npx vitest run` + `npx playwright test`
- `sw:code-reviewer` writes `code-review-report.json` — CLI blocks closure if critical/high/medium findings remain
- `/simplify` runs after code-review — catches duplication, readability issues, and inefficiencies via 3 parallel review agents
- `/sw:grill` writes `grill-report.json` — CLI blocks closure without it
- `/sw:judge-llm` writes `judge-llm-report.json` — WAIVED if consent denied
- Ask yourself: **"Would a staff engineer approve this?"**

### 5. Auto-Closure After Implementation (MANDATORY)
- When `/sw:do` completes all tasks, IMMEDIATELY invoke `/sw:done` — do NOT stop to ask for review
- The quality gates inside `/sw:done` (code-review, simplify, grill, judge-llm, PM validation) ARE the review — no user confirmation needed
- `/sw:done` handles: code-review loop, simplify, grill report, judge-llm, PM gates, closure, sync to GitHub/Jira/ADO
- If a gate fails, the increment stays open automatically — no risk of premature closure
- If the user disagrees, they can re-open the increment
- **Anti-pattern**: "All tasks complete. Should I close?" — NEVER ask this. Just close it.

### 4. Think-Before-Act (Dependencies)
**Satisfy dependencies BEFORE dependent operations.**
```
Bad:  node script.js → Error → npm run build
Good: npm run build → node script.js → Success
```
<!-- SW:END:metarule -->

<!-- SW:SECTION:rules version="1.0.583" -->
## Rules

1. **Files** → `.specweave/increments/####-name/` (see Structure section for details)
2. **Update immediately**: `Edit("tasks.md", "[ ] pending", "[x] completed")` + `Edit("spec.md", "[ ] AC-", "[x] AC-")`
3. **Unique IDs**: Check ALL folders (active, archive, abandoned):
   ```bash
   find .specweave/increments -maxdepth 2 -type d -name "[0-9]*" | grep -oE '[0-9]{4}E?' | sort -u | tail -5
   ```
4. **Emergency**: "emergency mode" → 1 edit, 50 lines max, no agents
5. **Initialization guard**: `.specweave/` folders MUST ONLY exist where `specweave init` was run
6. **Plugin refresh**: Use `specweave refresh-plugins` CLI (not `scripts/refresh-marketplace.sh`)
7. **Numbered folder collisions**: Before creating `docs/NN-*` folders, CHECK existing prefixes
8. **Multi-repo**: ALL repos MUST be at `repositories/{org}/{repo-name}/` — NEVER directly under `repositories/`
<!-- SW:END:rules -->

<!-- SW:SECTION:workflow version="1.0.583" -->
## Workflow

`/sw:increment "X"` → `/sw:do` → `/sw:progress` → `/sw:done 0001`

| Cmd | Action |
|-----|--------|
| `/sw:increment` | Plan feature |
| `/sw:do` | Execute tasks |
| `/sw:auto` | Autonomous execution |
| `/sw:auto-status` | Check auto session |
| `/sw:cancel-auto` | EMERGENCY ONLY manual cancel |
| `/sw:validate` | Quality check |
| `/sw:done` | Close |
| `/sw:progress-sync` | Sync progress to all external tools |
| `/sw-github:push` | Push progress to GitHub |
| `/sw:sync-setup` | Connect GitHub/Jira/ADO integration |
| `/sw:import` | Import issues from external tools |

**Natural language**: "Let's build X" → `/sw:increment` | "What's status?" → `/sw:progress` | "We're done" → `/sw:done` | "Ship while sleeping" → `/sw:auto`

**Large-scale changes**: For codebase-wide migrations or bulk refactors, use `/batch` — decomposes work into parallel agents with worktree isolation, each producing its own PR. Example: `/batch migrate from Solid to React`
<!-- SW:END:workflow -->

<!-- SW:SECTION:save-nested-repos version="1.0.583" -->
## Nested Repos

Before git operations, scan: `for d in repositories packages services apps libs workspace; do [ -d "$d" ] && find "$d" -maxdepth 2 -name ".git" -type d; done`
<!-- SW:END:save-nested-repos -->

<!-- SW:SECTION:taskformat version="1.0.583" -->
## Task Format

```markdown
### T-001: Title
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01 | **Status**: [x] completed
**Test**: Given [X] → When [Y] → Then [Z]
```
<!-- SW:END:taskformat -->

<!-- SW:SECTION:secrets version="1.0.583" -->
## Secrets

Before CLI tools, check existing config (`grep -q` only — never display values).
<!-- SW:END:secrets -->

<!-- SW:SECTION:troubleshooting version="1.0.583" -->
## Troubleshooting

| Issue | Fix |
|-------|-----|
| Skills missing | Restart Claude Code |
| Plugins outdated | `specweave refresh-plugins` |
| Out of sync | `/sw:sync-progress` |
| Session stuck | `rm -f .specweave/state/*.lock` + restart |
| npm E401 on update | `npm i -g specweave --registry https://registry.npmjs.org --userconfig /dev/null` |
<!-- SW:END:troubleshooting -->

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **timorlist** (3178 symbols, 4191 relationships, 115 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/timorlist/context` | Codebase overview, check index freshness |
| `gitnexus://repo/timorlist/clusters` | All functional areas |
| `gitnexus://repo/timorlist/processes` | All execution flows |
| `gitnexus://repo/timorlist/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
