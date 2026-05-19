<!-- SW:META template="claude" version="1.0.585" sections="hook-priority,header,claude-code-concepts,lsp,start,autodetect,metarule,rules,workflow,save-nested-repos,reflect,context,structure,taskformat,secrets,syncing,testing,tdd,api,limits,troubleshooting,lazyloading,principles,linking,mcp,auto,docs,non-claude" -->

<!-- SW:SECTION:hook-priority version="1.0.585" -->
## Hook Instructions Override Everything

`<system-reminder>` hook output = **BLOCKING PRECONDITIONS**.

| Hook Message | Action |
|---|---|
| **"RESTART REQUIRED"** | ALL tools blocked �?STOP, wait for restart |
| **"SKILL FIRST"** | Call shown skill FIRST �?chain domain skills �?implement |

**"SKILL FIRST" is mandatory** �?"simple", "quick", "basic" are NOT opt-out phrases. The ONLY exception: user explicitly says "don't create an increment" or similar. Perceived simplicity never overrides hook instructions.

**Setup actions are NOT implementation** �?"connect github", "setup sync", "import issues" �?route to the matching setup skill (`sw:sync-setup`, `sw:import`, `sw:progress-sync`), NOT `/sw:increment`.
<!-- SW:END:hook-priority -->

<!-- SW:SECTION:header version="1.0.585" -->
**Framework**: SpecWeave | **Truth**: `spec.md` + `tasks.md`
<!-- SW:END:header -->

<!-- SW:SECTION:claude-code-concepts version="1.0.585" -->
## Skills & Plugins

**Invoke**: `/skill-name` | auto-trigger by keywords | `Skill({ skill: "name" })`
**Parallel work**: Append "use subagents" to requests

**Key skills**: `sw:pm`, `sw:architect`, `sw:grill`, `sw:tdd-cycle`

**Skill chaining** �?skills are NOT "one and done":
1. **Planning**: `sw:pm` (specs) �?`sw:architect` (design)
2. **Implementation**: Use `sw:architect` for all domains. Optional domain plugins available via `vskill install` (mobile, marketing, etc.)
3. **Closure**: `sw:code-reviewer` + `/simplify` + `sw:grill` run automatically via `/sw:done`

**Complexity gate** �?before chaining domain skills:
1. **Tech stack specified?** �?Chain ONLY the matching skill. If unspecified, ASK or default to minimal (vanilla JS/HTML, simple Express)
2. **Complexity triage** �?Simple (calculator, todo) = 0 domain plugins. Medium (auth, dashboard) = 1-2. Complex (SaaS) = full chain
3. **Sanity check** �?Would a senior engineer use this tool for this task? If obviously not, don't invoke it
4. **Never** load all available plugins for a domain �?pick ONE per domain based on the actual tech stack

If auto-activation fails, invoke explicitly: `Skill({ skill: "name" })`
<!-- SW:END:claude-code-concepts -->

<!-- SW:SECTION:lsp version="1.0.585" -->
## LSP (Code Intelligence)

**Native LSP broken in v2.1.0+.** Use: `specweave lsp refs|def|hover src/file.ts SymbolName`
<!-- SW:END:lsp -->

<!-- SW:SECTION:start version="1.0.585" -->
## Getting Started

Your first increment starts at `0001`. Just describe what you want to build:

`/sw:increment "your-feature"`
<!-- SW:END:start -->

<!-- SW:SECTION:autodetect version="1.0.585" -->
## Auto-Detection

SpecWeave auto-detects product descriptions and routes to `/sw:increment`:

**Signals** (5+ = auto-route): Project name | Features list (3+) | Tech stack | Timeline/MVP | Problem statement | Business model

**Opt-out phrases**: "Don't plan yet" | "Quick discussion" | "Let's explore ideas"

**Brainstorm routing**: "Just brainstorm first" | "brainstorm" | "ideate" | "what are our options" �?routes to `/sw:brainstorm`

**NOT opt-out phrases**: "simple" | "quick" | "basic" | "small" �?these still require `/sw:increment`

**Setup/config requests bypass auto-detection** �?route directly to the matching skill (e.g., `sw:sync-setup`, `sw:import`)
<!-- SW:END:autodetect -->

<!-- SW:SECTION:metarule version="1.0.585" -->
## Workflow Orchestration

### 1. Plan Mode Default (MANDATORY)
- **ALWAYS enter plan mode** for ANY non-trivial task (3+ steps or architectural decisions)
- Call `EnterPlanMode` BEFORE writing specs, plans, or task breakdowns
- Do NOT start implementation until the plan is reviewed and approved
- If something goes sideways, **STOP and re-plan** -- do not keep pushing
- Write detailed specs upfront to reduce ambiguity
- `/sw:increment` REQUIRES plan mode -- never skip it

### 2. Subagent Strategy (Context Economy)
- **Protect main context** �?the main agent's context window is precious; delegate anything that produces large output
- **Research via subagents** �?when the user provides URLs, links, or references external docs, spawn a subagent to fetch and summarize instead of loading raw content into main context
- **Codebase exploration** �?use Explore subagents for broad searches; only bring concise findings back to main context
- **One task per subagent** �?focused execution produces better results and cleaner summaries
- **Parallel research** �?launch multiple subagents concurrently when investigating independent questions
- **Summarize, don't relay** �?subagent results should be distilled to actionable insights before acting on them in main context
- Append "use subagents" to requests for safe parallelization
- In team mode, sub-agents submit plans for team lead review before implementing

### 3. Verification Before Done
- Never mark a task complete without proving it works
- Run tests after every task: `npx vitest run` + `npx playwright test`
- `sw:code-reviewer` writes `code-review-report.json` �?CLI blocks closure if critical/high/medium findings remain
- `/simplify` runs after code-review �?catches duplication, readability issues, and inefficiencies via 3 parallel review agents
- `/sw:grill` writes `grill-report.json` �?CLI blocks closure without it
- `/sw:judge-llm` writes `judge-llm-report.json` �?WAIVED if consent denied
- Ask yourself: **"Would a staff engineer approve this?"**

### 5. Auto-Closure After Implementation (MANDATORY)
- When `/sw:do` completes all tasks, IMMEDIATELY invoke `/sw:done` �?do NOT stop to ask for review
- The quality gates inside `/sw:done` (code-review, simplify, grill, judge-llm, PM validation) ARE the review �?no user confirmation needed
- `/sw:done` handles: code-review loop, simplify, grill report, judge-llm, PM gates, closure, sync to GitHub/Jira/ADO
- If a gate fails, the increment stays open automatically �?no risk of premature closure
- If the user disagrees, they can re-open the increment
- **Anti-pattern**: "All tasks complete. Should I close?" �?NEVER ask this. Just close it.

### 4. Think-Before-Act (Dependencies)
**Satisfy dependencies BEFORE dependent operations.**
```
Bad:  node script.js �?Error �?npm run build
Good: npm run build �?node script.js �?Success
```
<!-- SW:END:metarule -->

<!-- SW:SECTION:rules version="1.0.585" -->
## Rules

1. **Files** �?`.specweave/increments/####-name/` (see Structure section for details)
2. **Update immediately**: `Edit("tasks.md", "[ ] pending", "[x] completed")` + `Edit("spec.md", "[ ] AC-", "[x] AC-")`
3. **Unique IDs**: Check ALL folders (active, archive, abandoned):
   ```bash
   find .specweave/increments -maxdepth 2 -type d -name "[0-9]*" | grep -oE '[0-9]{4}E?' | sort -u | tail -5
   ```
4. **Emergency**: "emergency mode" �?1 edit, 50 lines max, no agents
5. **Initialization guard**: `.specweave/` folders MUST ONLY exist where `specweave init` was run
6. **Plugin refresh**: Use `specweave refresh-plugins` CLI (not `scripts/refresh-marketplace.sh`)
7. **Numbered folder collisions**: Before creating `docs/NN-*` folders, CHECK existing prefixes
8. **Multi-repo**: ALL repos MUST be at `repositories/{org}/{repo-name}/` �?NEVER directly under `repositories/`
<!-- SW:END:rules -->

<!-- SW:SECTION:workflow version="1.0.585" -->
## Workflow

`/sw:increment "X"` �?`/sw:do` �?`/sw:progress` �?`/sw:done 0001`

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

**Natural language**: "Let's build X" �?`/sw:increment` | "What's status?" �?`/sw:progress` | "We're done" �?`/sw:done` | "Ship while sleeping" �?`/sw:auto`

**Large-scale changes**: For codebase-wide migrations or bulk refactors, use `/batch` �?decomposes work into parallel agents with worktree isolation, each producing its own PR. Example: `/batch migrate from Solid to React`
<!-- SW:END:workflow -->

<!-- SW:SECTION:save-nested-repos version="1.0.585" -->
## Nested Repos

Before git operations, scan: `for d in repositories packages services apps libs workspace; do [ -d "$d" ] && find "$d" -maxdepth 2 -name ".git" -type d; done`
<!-- SW:END:save-nested-repos -->

<!-- SW:SECTION:reflect version="1.0.585" -->
## Skill Memories

SpecWeave learns from corrections. Learnings saved here automatically. Edit or delete as needed.

**Disable**: Set `"reflect": { "enabled": false }` in `.specweave/config.json`
<!-- SW:END:reflect -->

<!-- SW:SECTION:context version="1.0.585" -->
## Context

**Before implementing**: Check ADRs at `.specweave/docs/internal/architecture/adr/`

**Load context**: `/sw:docs <topic>` loads relevant living docs into conversation
<!-- SW:END:context -->

## Agent skills

### Issue tracker

Issues tracked in GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical label vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout (global CONTEXT.md + ADRs). See `docs/agents/domain.md`.
<!-- SW:END:agent-skills -->

<!-- SW:SECTION:structure version="1.0.585" -->
## Structure

```
.specweave/
├── increments/####-name/     # metadata.json, spec.md, plan.md, tasks.md
├── docs/internal/specs/      # Living docs
└── config.json
```

**Increment root**: ONLY `metadata.json`, `spec.md`, `plan.md`, `tasks.md`

**Everything else �?subfolders**: `reports/` | `logs/` | `scripts/` | `backups/`
<!-- SW:END:structure -->

<!-- SW:SECTION:taskformat version="1.0.585" -->
## Task Format

```markdown
### T-001: Title
**User Story**: US-001 | **Satisfies ACs**: AC-US1-01 | **Status**: [x] completed
**Test**: Given [X] �?When [Y] �?Then [Z]
```
<!-- SW:END:taskformat -->

<!-- SW:SECTION:secrets version="1.0.585" -->
## Secrets

Before CLI tools, check existing config (`grep -q` only �?never display values).
<!-- SW:END:secrets -->

<!-- SW:SECTION:syncing version="1.0.585" -->
## External Sync

Primary: `/sw:progress-sync`. Individual: `/sw-github:push`, `/sw-github:close`. Mapping: Feature→Milestone | Story→Issue | Task→Checkbox.
<!-- SW:END:syncing -->

<!-- SW:SECTION:testing version="1.0.585" -->
## Testing Pipeline (MANDATORY)

**Testing is a pipeline step, not an afterthought.**

### During Design (`/sw:increment`)
- `/sw:increment` generates tasks.md with BDD test plans (Given/When/Then) for every AC via the sw-planner agent
- Every task MUST have a `**Test Plan**:` block before implementation begins
- E2E test scenarios MUST be specified for user-facing features

### During Implementation (`/sw:do`)
- TDD cycle: `/sw:tdd-red` �?`/sw:tdd-green` �?`/sw:tdd-refactor`
- Run tests after EVERY task: `npx vitest run` (unit) + `npx playwright test` (E2E when applicable)
- Never mark a task `[x]` until its tests pass

### Before Closing (`/sw:done`)
- `sw:code-reviewer` writes `code-review-report.json` �?blocks closure if critical/high/medium findings remain (fix loop, max 3 iterations)
- `/simplify` runs after code-review passes �?cleans up code before grill
- `/sw:grill` writes `grill-report.json` �?CLI blocks closure without it
- `/sw:judge-llm` writes `judge-llm-report.json` �?WAIVED if consent denied
- `/sw:validate` �?130+ rule checks
- E2E: `npx playwright test` (blocking gate)

### Test Stack
- Unit/Integration: Vitest (`.test.ts`), ESM mocking with `vi.hoisted()` + `vi.mock()`
- E2E: Playwright CLI (`npx playwright test`)
- Coverage targets: unit 95%, integration 90%, e2e 100% of AC scenarios
<!-- SW:END:testing -->

<!-- SW:SECTION:tdd version="1.0.585" -->
## TDD

When `testing.defaultTestMode: "TDD"` in config.json: RED→GREEN→REFACTOR. Use `/sw:tdd-cycle`. Enforcement via `testing.tddEnforcement` (strict|warn|off).
<!-- SW:END:tdd -->

<!-- SW:SECTION:api version="1.0.585" -->
<!-- API: Enable `apiDocs` in config.json. Commands: /sw:api-docs -->
<!-- SW:END:api -->

<!-- SW:SECTION:limits version="1.0.585" -->
## Limits

**Max 1500 lines/file** �?extract before adding
<!-- SW:END:limits -->

<!-- SW:SECTION:troubleshooting version="1.0.585" -->
## Troubleshooting

| Issue | Fix |
|-------|-----|
| Skills missing | Restart Claude Code |
| Plugins outdated | `specweave refresh-plugins` |
| Out of sync | `/sw:sync-progress` |
| Session stuck | `rm -f .specweave/state/*.lock` + restart |
| npm E401 on update | `npm i -g specweave --registry https://registry.npmjs.org --userconfig /dev/null` |
| Duplicate increments | `sw:fix-duplicates` |
| Status inconsistent | Check metadata.json vs spec.md vs tasks.md. Update to match actual state. |
<!-- SW:END:troubleshooting -->

<!-- SW:SECTION:lazyloading version="1.0.585" -->
## Plugin Auto-Loading

Plugins load automatically. Manual: `specweave refresh-plugins` or `claude plugin install <name>@specweave`. Disable: `export SPECWEAVE_DISABLE_AUTO_LOAD=1`
<!-- SW:END:lazyloading -->

<!-- SW:SECTION:principles version="1.0.585" -->
## Principles

1. **Spec-first**: `/sw:increment` before coding �?mandatory for ALL implementation requests, no exceptions unless user explicitly opts out
2. **Docs = truth**: Specs guide implementation
3. **Simplicity First**: Minimal code, minimal impact
4. **No Laziness**: Root causes, senior standards
5. **DRY**: Don't Repeat Yourself �?flag and eliminate repetitions aggressively
6. **Plan Review**: Review the plan thoroughly before making any code changes
7. **Test before ship**: Tests pass at every step �?unit after each task, E2E before close, no exceptions
<!-- SW:END:principles -->

<!-- SW:SECTION:linking version="1.0.585" -->
## Bidirectional Linking

Tasks �?User Stories auto-linked via AC-IDs: `AC-US1-01` �?`US-001`

Task format: `**AC**: AC-US1-01, AC-US1-02` (CRITICAL for linking)
<!-- SW:END:linking -->

<!-- SW:SECTION:mcp version="1.0.585" -->
## External Services

CLI tools first (`gh`, `wrangler`, `supabase`) �?MCP for complex integrations.
<!-- SW:END:mcp -->

<!-- SW:SECTION:auto version="1.0.585" -->
## Auto Mode

`/sw:auto` (start) | `/sw:auto-status` (check) | `/sw:cancel-auto` (emergency)

Pattern: IMPLEMENT �?TEST �?FAIL? �?FIX �?PASS �?NEXT. STOP & ASK if spec conflicts or ambiguity.
<!-- SW:END:auto -->

<!-- SW:SECTION:docs version="1.0.585" -->
## Docs

[verified-skill.com](https://verified-skill.com)
<!-- SW:END:docs -->

<!-- SW:SECTION:non-claude version="1.0.585" -->
## Using SpecWeave with Other AI Tools

See **AGENTS.md** for Cursor, Copilot, Windsurf, Aider instructions.

**Command format note**: This file uses `/sw:do` (Claude Code slash-command format). AGENTS.md uses `sw:do` (tool-agnostic format). Both refer to the same commands.
<!-- SW:SECTION:entity-structure version="1.0.586" -->
## Entity Structure

### 4 种实体类型（独立数据库表，无 entityType�?
| 实体 | 数据库表 | 分类�?| 列表�?| 详情�?| Admin |
|------|---------|--------|-------|--------|-------|
| **Business** | businesses | business_categories | /businesses | /business/[slug] | /admin/businesses |
| **Non-Profit** | non_profits | non_profit_categories | /non-profits | /non-profit/[slug] | /admin/non-profits |
| **Public Sector** | public_sectors | public_sector_categories | /public-sectors | /public-sector/[slug] | /admin/public-sectors |
| **Listing** | listings | listing_categories | /listings | /listing/[slug] | /admin/listings |

### 各实体特性对�?
| 特�?| Businesses | Non-Profits | Public Sectors | Listings |
|------|:----------:|:-----------:|:-------------:|:--------:|
| **套餐** | �?付费套餐 | �?免费 | �?免费 | �?�?天免�?|
| **续费** | �?年套�?| - | - | 7�?/ 30�?/ 365�?|
| **过期处理** | 降级/删除 | 免费无限�?| 免费无限�?| 7天后直接删除 |
| **独有小节** | Products/Services, Reviews | �?| �?| �?|
| **SKU/Products** | �?| �?| �?| �?|
| **Reviews** | �?| �?| �?| �?|
| **Industry分类** | �?二级分类 | �?| �?| �?|
| **LatestUpdate** | �?| �?| �?| �?|
| **Photo Gallery** | �?| �?| �?| �?|
| **图片限制** | 16+2视频 | 16+2视频 | 16+2视频 | 8+1视频 |
| **二级分类** | �?parentId | �?parentId | �?parentId | �?parentId |

### 分类表结构（4个独立表，结构相同）

| 字段 | 说明 |
|------|------|
| id | 主键 |
| name | 分类名称 |
| slug | URL slug |
| description | 描述 |
| icon | 图标 |
| **parentId** | **父分类ID（二级分类）** |
| createdAt/updatedAt | 时间�?|

### Listing 可见性规�?
| 条件 | 状�?|
|------|------|
| 创建 �?3 �?| �?公开可见 |
| 到期前续�?| �?公开可见�?�?30�?365天） |
| 未续费过�?| �?7天后直接删除 |

### URL 命名约定

- 复数形式 = 列表页（�?/businesses�?- 单数形式 + slug = 详情页（�?/business/timor-cafe�?- /admin/复数 = CRUD 管理页（�?/admin/businesses�?<!-- SW:END:entity-structure -->

### Server Actions Structure

| 目录 | Actions | 用�?|
|------|---------|------|
| `src/actions/auth/` | signIn, signUp, signOut, verifyEmail, forgotPassword, resetPassword | 用户认证 |
| `src/actions/admin/` | categories, plans, subscriptions, blogs, heroes, listings, settings, aiTools | 管理员CRUD |
| `src/actions/business/` | create, update, like, updates | 商业列表操作 |
| `src/actions/products/` | create, update, delete | 产品/SKU管理 |
| `src/actions/media/` | create, update, upload | 媒体上传 |
| `src/actions/reviews/` | create, update, delete, reply | 评论管理 |
| `src/actions/banners/` | create, update, delete | 横幅管理 |

### REST API 状�?(2026-05-11)

| 分类 | 数量 | 说明 |
|------|------|------|
| **Public APIs** | 3 | `/api/businesses`, `/api/non-profits`, `/api/public-sectors` |
| Admin APIs | ~15 | Admin CRUD，需认证 |
| Category APIs | 1 | `/api/categories/[slug]/listings` |
| Orphaned | 26 | 已被actions替代，待删除 |
| External | 2 | OAuth外部集成，保�?|
| Scheduled | 4 | Cron定时任务，保�?|

> **重要**: 每个实体有独立API，查询各自表。`/api/businesses` 只查 `businesses` 表，不再混合查询�?
<!-- �?ORIGINAL �?-->

<!-- gitnexus:start -->
# GitNexus �?Code Intelligence

This project is indexed by GitNexus as **TimorLink** (3301 symbols, 5020 relationships, 103 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol �?callers, callees, which execution flows it participates in �?use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace �?use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/TimorLink/context` | Codebase overview, check index freshness |
| `gitnexus://repo/TimorLink/clusters` | All functional areas |
| `gitnexus://repo/TimorLink/processes` | All execution flows |
| `gitnexus://repo/TimorLink/process/{name}` | Step-by-step execution trace |

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


## Server Actions (Astro 6)

### Structure
```
src/actions/
├── auth/           # User authentication actions
�?  ├── signUp.ts
�?  ├── signIn.ts
�?  ├── signOut.ts
�?  └── index.ts
├── business/        # Business listing actions
�?  ├── create.ts
�?  ├── update.ts
�?  ├── updates.ts
�?  └── like.ts
├── admin/          # Admin CRUD actions
�?  ├── categories.ts
�?  ├── plans.ts
�?  ├── listings.ts
�?  └── index.ts
├── media/          # Media upload/delete
�?  ├── upload.ts
�?  ├── update.ts
�?  └── delete.ts
├── products/       # Product/SKU actions
├── reviews/        # Review actions
└── banners/        # Banner actions
```

### Usage
```astro
---
import { actions } from 'astro:actions';

// Call action
const result = await actions.auth.signIn({ email, password });
```

### Migration (2026-05-09)
- All write REST APIs �?Server Actions (41 actions)
- Read-only APIs kept as REST for caching
- Page imports updated to use actions

---

## Design Context

### Users
- **Primary**: Timor-Leste local community (Timorese, expats, NGOs, businesses, government)
- **Use cases**: Find businesses, discover government/NGO services, browse classified ads
- **Context**: Mobile-first, limited connectivity, mix of urban/rural users

### Brand Personality
- **3 Words**: Vibrant, Cultural, Local
- **Emotional**: Pride in local businesses, trust in community
- **Reference**: Gumtree-style listings + professional business directory hybrid

### Design Principles
1. **Local pride** �?Celebrate Timor-Leste, not generic Western patterns
2. **Trust & clarity** �?Clear hierarchy, honest listings, no dark patterns
3. **Warmth** �?Yellow/cream evokes approachability
4. **Mobile-first** �?44px touch targets, works on slow connections
5. **Fast & functional** �?Quick loads, efficient search

### Color System
| Token | Light | Dark |
|-------|-------|------|
| Background | #FDFBF7 | #09090b |
| Primary | #FFD150 | #FFD150 |
| Card | #ffffff | #18181b |
| Muted | #f5f5f4 | #27272a |
| Brand-500 | #FFD150 | #FFD150 |

### Entity Card Display (2026-05-11 Enhanced)
| Entity | Badge | Info |
|--------|-------|------|
| Business | Industry (yellow bg) | Title (bold), Address (pin), 5-star rating, Likes (heart), Views (eye) |
| Non-Profit | Category (rose bg) | Title (bold), Address (pin), Likes (heart), Views (eye) |
| Public Sector | Category (blue bg) | Title (bold), Address (pin), Likes (heart), Views (eye) |
| Listing | Type + Price (color-coded) | Title (bold), Location (pin), Price (yellow bg), Likes (heart), Views (eye) |

**Card Design (2026-05-11)**:
- Aspect ratio 4:3 for images
- Pagination: 12 items/page
- Hover: yellow border (`border-primary/40`) + shadow lift
- `rounded-2xl` border radius
- **Image bg**: `from-primary/10 to-primary/5` (brand yellow tint)
- **Title**: `font-bold` + `line-clamp-2`
- **Address**: `text-sm` with `w-4 h-4` pin icon
- **Rating**: Full 5-star display (filled amber / empty gray)
- **Stats**: `w-3.5 h-3.5` icons, `gap-4` spacing
- Listing type colors: Job (blue), Product (emerald), Service (purple), Property (amber), Vehicle (red), Wanted (teal)

### Admin Sidebar (2026-05-11)
- **Width**: `w-48` (compact)
- **Nav items**: `px-2 py-2 gap-2 min-h-9`
- **Links**: Dashboard, Listings, Businesses, Non-Profits, Gov & NGOs, Users, SKUs, Categories, Heroes, Blogs, Media, Plans, Settings

