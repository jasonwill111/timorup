# timorlist

**Business Directory Platform for Timor-Leste** - A SpecWeave-driven project enabling businesses to create listings, products, and services with user reviews and admin dashboard.

## Features

- Local Directory (`/listing`) with Businesses/Govs/NGOs tabs
- Create Listing (`/listing/create`) - unified creation for all entity types
- Products & Services page (`/products-services`) with SKU detail pages
- Featured sections on homepage (12 businesses, 3 govs, 3 ngos)
- Business/Government/Nonprofit entity types with dedicated detail pages
- SKU product detail pages (`/business/[slug]/product/[id]`)
- Industry classification (14 ISIC-based categories)
- Flexible SKU pricing (hourly/daily/monthly/unit-based)
- Admin listing management (`/admin/listing`)
- Admin SKU management with dynamic pricing
- Admin AI Tools (`/admin/ai-tools`) - Generate listing/SKU/blog/landing pages
- User reviews and ratings
- TipTap rich text editor for product descriptions
- Leaflet maps integration
- WhatsApp inquiry integration
- User authentication with better-auth
- SSR pages with instant rendering
- Seed data: 23 businesses, 128 products, 37 reviews

## User Model

| Entity Type | Creation | SKU Limit |
|-------------|----------|-----------|
| Business | Paid (Basic/Pro/Max) | 10/30/60 |
| Government | Free | Unlimited |
| Nonprofit | Free | Unlimited |

**Each account can only create ONE listing (any type).**

## Subscription Flow

1. User selects plan at `/pricing`
2. Redirects to `/subscribe?plan=xxx`
3. System creates unpaid order
4. User pays offline (cash/bank transfer)
5. User contacts admin via WhatsApp
6. Admin confirms payment at `/admin/subscriptions`
7. System updates business page with plan + expiry date

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Astro 6.x (SSR) |
| Database | D1 (SQLite) via Drizzle ORM |
| Auth | better-auth 1.5.x |
| Styling | TailwindCSS v4 |
| Editor | TipTap 3.x |
| Validation | Zod 4.x |
| Media | Cloudflare R2 |

## Quick Start

Your project is initialized! Now describe what you want to build.

### Next Steps

1. **Open your AI assistant** (Claude Code, Cursor, Windsurf, or any AI-powered IDE)

2. **Use SpecWeave commands** to start building:

```
# Plan a new feature
sw:increment "user authentication with JWT"

# Execute the implementation
sw:do

# Check progress
sw:progress

# Close when done
sw:done 0001
```

> **Invocation varies by tool**: Claude Code uses `/sw:do`, Cursor/Copilot users type `sw:do` or describe the action. See AGENTS.md for details.

3. **Or describe your project** in natural language (works with command workflows):

```
"Build a real estate listing platform with search, images, and admin dashboard"
"Create a task management API with authentication"
"Build an e-commerce platform with Stripe payments"
```

4. **SpecWeave will automatically**:
   - Detect your tech stack (or ask you to choose)
   - Use the right agents and skills (all pre-installed)
   - Create strategic documentation
   - Generate specifications (spec.md, plan.md, tasks.md)
   - Guide implementation
   - Generate tests

That's it! All components ready - just use `sw:increment` to start!

---

## Project Structure

```
timorlist/
├── .specweave/             # SpecWeave framework
│   ├── config.json         # Project configuration
│   ├── increments/         # Features (created via sw:increment)
│   │   └── 0001-feature/
│   │       ├── spec.md     # WHAT & WHY
│   │       ├── plan.md     # HOW
│   │       ├── tasks.md    # Implementation steps
│   │       └── reports/    # Analysis reports
│   └── docs/               # Strategic documentation
│       ├── internal/       # Internal docs (strategy, architecture)
│       └── public/         # Published docs
├── CLAUDE.md               # Instructions for AI assistant
└── README.md               # This file
```

---

## What is SpecWeave?

SpecWeave is a specification-first development framework where:
- **Specifications are the source of truth** (code follows specs, not reverse)
- **Commands drive workflow** (`sw:increment` → `sw:do` → `sw:done`)
- **AI agents work autonomously** (PM, Architect, Security, QA, DevOps)
- **Works with ANY tech stack** (TypeScript, Python, Go, Rust, Java, .NET, etc.)
- **Works with multiple AI assistants** (Claude Code, Cursor, Windsurf, etc.)

---

## Core Workflow

```
sw:increment "feature" → sw:do → sw:progress → sw:done → repeat
```

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `sw:increment "feature"` | Plan new increment | Starting new feature |
| `sw:do` | Execute tasks | Ready to implement |
| `sw:progress` | Check status | Want to see progress |
| `sw:validate 0001` | Validate quality | Before completion |
| `sw:done 0001` | Close increment | Feature finished |
| `sw:team-lead "feature"` | Parallel agents | Complex multi-domain features |
| `sw:progress-sync` | Sync to external tools | Export to GitHub/JIRA/ADO |

For complex features spanning frontend, backend, and database — `sw:team-lead` splits work across parallel agents for faster delivery. [Learn more](https://verified-skill.com/docs/guides/agent-teams-and-swarms).

See `CLAUDE.md` for complete workflow guide.

---

## File Organization

**Keep project root clean!** All AI-generated files go into increment folders:

```
CORRECT:
.specweave/increments/0001-auth/
├── reports/analysis.md
└── logs/execution.log

WRONG:
project-root/
├── execution.log
└── analysis.md
```

---

## AI Assistant Compatibility

SpecWeave works with:
- **Claude Code** (recommended) - Full command support with auto-activation
- **Cursor** - Commands via composer
- **Windsurf** - Cascade mode compatible
- **Any AI IDE** - Supports commands via prompts or native integrations

**Setup**: See `CLAUDE.md` for AI assistant instructions.

---

## Learn More

- **Documentation**: https://verified-skill.com
- **GitHub**: https://github.com/anton-abyzov/specweave
- **Quick Reference**: See `CLAUDE.md` in your project

---

## Ready to Build?

**Start with your first feature**:
```bash
sw:increment "describe your feature here"
```

Or just describe what you want to build, and SpecWeave will guide you through the process!

---

**Documentation Philosophy**: {{DOCUMENTATION_APPROACH}}

**Tech Stack**: Auto-detected from project files (package.json, requirements.txt, etc.)
