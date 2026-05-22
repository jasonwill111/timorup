<!-- SW:META template="claude" version="1.0.585" sections="hook-priority,header,claude-code-concepts,lsp,start,autodetect,metarule,rules,workflow,save-nested-repos,reflect,context,structure,taskformat,secrets,syncing,testing,tdd,api,limits,troubleshooting,lazyloading,principles,linking,mcp,auto,docs,non-claude" -->

<!-- SW:SECTION:hook-priority -->
## Hook Instructions Override Everything
`<system-reminder>` hook output = **BLOCKING PRECONDITIONS**.
| Hook Message | Action |
|---|---|
| **"RESTART REQUIRED"** | ALL tools blocked → STOP, wait for restart |
| **"SKILL FIRST"** | Call shown skill FIRST → chain domain skills → implement |

**"SKILL FIRST" is mandatory** — "simple", "quick", "basic" are NOT opt-out phrases.
**Setup actions** → route to matching setup skill (`sw:sync-setup`, `sw:import`), NOT `/sw:increment`.
<!-- SW:END:hook-priority -->

<!-- SW:SECTION:header -->
**Framework**: SpecWeave | **Truth**: `spec.md` + `tasks.md`
<!-- SW:END:header -->

<!-- SW:SECTION:claude-code-concepts -->
## Skills & Plugins
**Key skills**: `sw:pm`, `sw:architect`, `sw:grill`, `sw:tdd-cycle`
**Skill chaining**: Planning → `sw:pm` → `sw:architect` → Implementation → `/sw:done`
<!-- SW:END:claude-code-concepts -->

<!-- SW:SECTION:lsp -->
## LSP
**Native LSP broken in v2.1.0+.** Use: `specweave lsp refs|def|hover src/file.ts SymbolName`
<!-- SW:END:lsp -->

<!-- SW:SECTION:start -->
## Getting Started
`/sw:increment "your-feature"`
<!-- SW:END:start -->

<!-- SW:SECTION:workflow -->
## Workflow
`/sw:increment "X"` → `/sw:do` → `/sw:progress` → `/sw:done 0001`

| Cmd | Action |
|-----|--------|
| `/sw:increment` | Plan feature |
| `/sw:do` | Execute tasks |
| `/sw:auto` | Autonomous execution |
| `/sw:done` | Close |
| `/sw:progress-sync` | Sync to GitHub/Jira |
<!-- SW:END:workflow -->

<!-- SW:SECTION:rules -->
## Rules
1. **Files** → `.specweave/increments/####-name/`
2. **Update immediately**: `Edit("tasks.md", "[ ]", "[x]")` + spec AC checkboxes
3. **Unique IDs**: `find .specweave/increments -maxdepth 2 -name "[0-9]*" | grep -oE '[0-9]{4}E?'`
4. **Emergency**: "emergency mode" → 1 edit, 50 lines max, no agents
<!-- SW:END:rules -->

<!-- SW:SECTION:structure -->
## Structure
```
.specweave/
├── increments/####-name/     # metadata.json, spec.md, plan.md, tasks.md
├── docs/internal/specs/      # Living docs
└── config.json
```
<!-- SW:END:structure -->

<!-- SW:SECTION:taskformat -->
## Task Format
```markdown
### T-001: Title
**User Story**: US-001 | **AC**: AC-US1-01 | **Status**: [x] completed
**Test**: Given [X] → When [Y] → Then [Z]
```
<!-- SW:END:taskformat -->

<!-- SW:SECTION:secrets -->
## Secrets
Before CLI tools, check existing config (`grep -q` only — never display values).
<!-- SW:END:secrets -->

<!-- SW:SECTION:testing -->
## Testing
- TDD cycle: `/sw:tdd-red` → `/sw:tdd-green` → `/sw:tdd-refactor`
- Run tests after EVERY task: `npx vitest run` + `npx playwright test`
- Before close: `sw:code-reviewer` + `/sw:grill` + `npx playwright test`
<!-- SW:END:testing -->

<!-- SW:SECTION:troubleshooting -->
## Troubleshooting
| Issue | Fix |
|-------|-----|
| Skills missing | Restart Claude Code |
| Session stuck | `rm -f .specweave/state/*.lock` + restart |
| Duplicate increments | `sw:fix-duplicates` |
<!-- SW:END:troubleshooting -->

<!-- SW:SECTION:principles -->
## Principles
1. **Spec-first**: `/sw:increment` before coding — mandatory
2. **Simplicity First**: Minimal code, minimal impact
3. **Test before ship**: Tests pass at every step
<!-- SW:END:principles -->

---

# TimorUp — 东帝汶商业目录平台

## 技术栈
Astro 6 SSR | Drizzle + D1 | TailwindCSS | better-auth

## 外置文档（按需加载）
| 内容 | 文件 |
|------|------|
| Entity 结构 | `.claude/ENTITY-STRUCTURE.md` |
| Server Actions | `.claude/SERVER-ACTIONS.md` |
| 设计系统 | `.claude/DESIGN.md` |

## 项目配置
- **类型**: 商业目录 + 分类信息平台
- **Tech**: Astro SSR | Drizzle + D1 | TailwindCSS 4
- **部署**: Cloudflare Workers

## 开发命令
```bash
pnpm dev          # 开发服务器 (端口 8787)
pnpm build        # 生产构建
pnpm test         # Vitest 单元测试
pnpm playwright test  # E2E 测试
```

## Server Islands (重要)

**Server Islands 运行在隔离的 V8 上下文中**，必须使用正确的 DB 访问模式：

```astro
// ✅ 正确 - 直接从 env 获取 DB
const { getDb } = await import('../lib/db');
const db = await getDb();

// ❌ 错误 - 依赖全局状态 (Isolated Context 中不可见)
const { initDb } = await import('../lib/db');
initDb(env.DB);
const db = getDbInstance();  // 可能返回 null!
```

**规则**: Server Islands 必须使用 `await getDb()` 而不是 `initDb()` + `getDbInstance()` 组合。

## ⚠️ 强制验证
1. `pnpm build` — 必须 exit 0
2. `npx vitest run` — 单元测试通过
3. `npx playwright test` — E2E 测试通过

## 知识库
| 内容 | 位置 |
|------|------|
| 测试/Playwright | `~/.claude/memory/playwright.md` |
| Drizzle | `~/.claude/memory/drizzle.md` |
| SpecWeave | `.specweave/` |

<!-- gitnexus:start -->
# GitNexus
Index: **timorup** (3653 symbols, 5255 relationships, 76 execution flows)
**Must do before edit**: `gitnexus_impact({target: "SymbolName", direction: "upstream"})`
**Must do before commit**: `gitnexus_detect_changes()`
<!-- gitnexus:end -->
