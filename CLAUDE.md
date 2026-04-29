<!-- SW:META template="claude" version="1.0.581" sections="hook-priority,header,claude-code-concepts,lsp,start,autodetect,metarule,rules,workflow,save-nested-repos,reflect,context,structure,taskformat,secrets,syncing,testing,tdd,api,limits,troubleshooting,lazyloading,principles,linking,mcp,auto,docs,non-claude,agents-md" -->

<!-- SW:SECTION:hook-priority -->
## Hook Instructions Override Everything

`<system-reminder>` hook output = **BLOCKING PRECEDENTS**.

| Hook Message | Action |
|---|---|
| **"RESTART REQUIRED"** | ALL tools blocked → STOP, wait for restart |
| **"SKILL FIRST"** | Call shown skill FIRST → chain domain skills → implement |

**"SKILL FIRST" is mandatory** — "simple", "quick", "basic" are NOT opt-out phrases. Perceived simplicity never overrides hook instructions.
<!-- SW:END:hook-priority -->

<!-- SW:SECTION:header -->
**Framework**: SpecWeave | **Truth**: `spec.md` + `tasks.md`
<!-- SW:END:header -->

<!-- SW:SECTION:claude-code-concepts -->
## Skills & Plugins

**Key skills**: `sw:pm`, `sw:architect`, `sw:grill`, `sw:tdd-cycle`

**Skill chaining**: sw:pm → sw:architect → implement → sw:done
<!-- SW:END:claude-code-concepts -->

<!-- SW:SECTION:start -->
## Getting Started

`/sw:increment "your-feature"`
<!-- SW:END:start -->

<!-- SW:SECTION:autodetect -->
## Auto-Detection

**Opt-out phrases**: "Don't plan yet" | "Quick discussion" | "Let's explore ideas"
**NOT opt-out**: "simple" | "quick" | "basic" | "small"
<!-- SW:END:autodetect -->

<!-- SW:SECTION:metarule -->
## Workflow

| Cmd | Action |
|-----|--------|
| `/sw:increment` | Plan feature |
| `/sw:do` | Execute tasks |
| `/sw:done` | Close |
| `/sw:validate` | Quality check |

**禁止绕过**: 即使"简单"任务也要走流程
<!-- SW:END:metarule -->

<!-- SW:SECTION:rules -->
## Rules

1. **Files** → `.specweave/increments/####-name/`
2. **Update immediately**: tasks.md + spec.md
3. **Emergency**: "emergency mode" → 1 edit, 50 lines max, no agents
<!-- SW:END:rules -->

<!-- SW:SECTION:workflow -->
## SpecWeave Workflow

`/sw:increment "X"` → `/sw:do` → `/sw:progress` → `/sw:done 0001`
<!-- SW:END:workflow -->

<!-- SW:SECTION:reflect -->
## Skill Memories
<!-- SW:END:reflect -->

<!-- SW:SECTION:context -->
## Context
**Before implementing**: Check ADRs at `.specweave/docs/internal/architecture/adr/`
<!-- SW:END:context -->

<!-- SW:SECTION:structure -->
## Structure

```
.specweave/
├── increments/####-name/  # metadata.json, spec.md, plan.md, tasks.md
└── docs/internal/specs/    # Living docs
```
<!-- SW:END:structure -->

<!-- SW:SECTION:testing -->
## Testing Pipeline (MANDATORY)

- TDD cycle: `/sw:tdd-red` → `/sw:tdd-green` → `/sw:tdd-refactor`
- Run tests after EVERY task
- Never mark a task `[x]` until its tests pass
<!-- SW:END:testing -->

<!-- SW:SECTION:tdd -->
## TDD

`testing.defaultTestMode: "TDD"` → Use `/sw:tdd-cycle`
<!-- SW:END:tdd -->

<!-- SW:SECTION:limits -->
## Limits

**Max 1500 lines/file**
<!-- SW:END:limits -->

<!-- SW:SECTION:troubleshooting -->
## Troubleshooting

| Issue | Fix |
|-------|-----|
| Skills missing | Restart Claude Code |
<!-- SW:END:troubleshooting -->

<!-- SW:SECTION:lazyloading -->
## Plugin Auto-Loading

`specweave refresh-plugins`
<!-- SW:END:lazyloading -->

<!-- SW:SECTION:principles -->
## Principles

1. **Spec-first**: `/sw:increment` before coding
2. **Docs = truth**: Specs guide implementation
3. **Simplicity First**: Minimal code, minimal impact
4. **No Laziness**: Root causes, senior standards
5. **DRY**: Don't Repeat Yourself
6. **Plan Review**: Review the plan thoroughly before making any code changes
7. **Test before ship**: Tests pass at every step
<!-- SW:END:principles -->

<!-- SW:SECTION:linking -->
## Bidirectional Linking

Tasks ↔ User Stories auto-linked via AC-IDs
<!-- SW:END:linking -->

<!-- SW:SECTION:mcp -->
## External Services

CLI tools first → MCP for complex integrations
<!-- SW:END:mcp -->

<!-- SW:SECTION:auto -->
## Auto Mode

`/sw:auto` | `/sw:auto-status` | `/sw:cancel-auto`
<!-- SW:END:auto -->

<!-- SW:SECTION:docs -->
## Docs

[verified-skill.com](https://verified-skill.com)
<!-- SW:END:docs -->

<!-- SW:SECTION:non-claude -->
## Using SpecWeave with Other AI Tools

See **AGENTS.md** for Cursor, Copilot, Windsurf, Aider instructions.
<!-- SW:END:non-claude -->

<!-- SW:SECTION:agents-md -->
## AGENTS.md

**通用 AI agent 规范在 `AGENTS.md`**

`AGENTS.md` 包含：
- 本地知识库加载顺序
- 验证触发词 (强制)
- Tech Stack, Commands, Code Standards
- Project Structure, Testing Requirements

**本文件仅包含 Claude Code + SpecWeave 专用配置**
<!-- SW:END:agents-md -->

---

# CLAUDE.md

> **重要**: 通用规范见 `AGENTS.md`。本文件仅包含项目特定配置。

## Project Overview

**timorlist** - Timor-Leste 商业目录平台

## Entity Types

| Type | Route | Features |
|------|-------|----------|
| `business` | `/business/[slug]` | Products, reviews, hours, ratings |
| `government` | `/govs/[slug]` | Simplified (info + contact) |
| `nonprofit` | `/ngos/[slug]` | Simplified (info + contact) |

## Business Features

- `entityType`: `'business'` | `'government'` | `'nonprofit'`
- `socialLinks`: {facebook, instagram, tiktok}
- `photoGallery`: up to 6 images + 1 video
- `latestUpdate`: 500 chars, weekly cooldown

## SKU Service Types

- product, service, rental, food, accommodation, project

## Auth API

```typescript
const authApi = (auth as unknown as { api: typeof auth.api }).api;
```

## Error Handling

```typescript
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
```

## Cloudflare Cache

```typescript
const cache = caches.default;
const cached = await cache.match(request);
if (!cached) {
  await cache.put(request, response);
}
```

**See `AGENTS.md` for full specs, testing, and deployment.**

## AI Tools

AI功能通过 Mastra + MiniMax API 实现：

| Generator | Route | 功能 |
|-----------|-------|------|
| Listing | `/admin/ai-tools` (tab 1) | 生成 business/gov/nonprofit listing |
| SKU | `/admin/ai-tools` (tab 2) | 生成 product/service/rental 等 |
| Blog | `/admin/ai-tools` (tab 3) | 生成文章 (local-highlight/how-to等) |
| Landing | `/admin/ai-tools` (tab 4) | 生成 promotion/event 等落地页 |

**API**: `POST /api/admin/ai-generate`
**Agents**: `src/mastra/agents/index.ts`

### MiniMax API Key

本地: `.dev.vars` 设置 `MINIMAX_API_KEY`
生产: `wrangler secret put MINIMAX_API_KEY`

---

## Agent skills

### Issue tracker

GitHub Issues for `jasonwill111/timorlist`. See `docs/agents/issue-tracker.md`.

### Triage labels

AI-driven workflow: `needs-triage` → `needs-info` / `ready-for-agent` → `in-progress` → closed. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context at `.specweave/docs/internal/`. See `docs/agents/domain.md`.
