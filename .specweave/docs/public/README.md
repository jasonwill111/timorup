# Public Documentation

## For Users

| Document | Description |
|----------|-------------|
| [Overview](overview/README.md) | Project overview and tech stack |
| [API Reference](api/README.md) | API documentation for developers |
| [User Guide](user-guide.md) | End-user documentation |

## For Developers

### Quick Links

- [Tech Stack](../internal/architecture/tech-stack.md) - Dependencies and versions
- [Module Docs](../internal/modules/README.md) - Code architecture
- [Database Schema](../internal/modules/db.md) - Drizzle ORM schema

### Development Setup

```bash
# Clone and install
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test        # Unit tests
pnpm test:e2e   # E2E tests
```

## Project Structure

```
src/
├── pages/           # Astro pages and APIs
├── components/       # UI components
├── actions/         # Server Actions
├── layouts/         # Page layouts
├── lib/             # Utilities
└── db/              # Database schema
```

---
*Updated 2026-05-30*
