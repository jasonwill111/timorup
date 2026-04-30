# Delivery Documentation

## Deployment Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   Push   │ -> │   CI     │ -> │  Build   │ -> │ Deploy   │
│   Code   │    │  Tests   │    │  Assets  │    │ Workers  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

## CI/CD Configuration

See `.github/workflows/` for GitHub Actions pipelines.

## Environment Branches

| Branch | Environment | Auto-deploy |
|--------|-------------|--------------|
| `main` | Production | ✅ Yes |
| `develop` | Staging | Optional |

## Build Commands

```bash
# Development build
pnpm build

# Production build (CI)
pnpm build
```

## Deployment

**Never deploy manually**. All deployments go through CI/CD:
1. Push to `main` branch
2. CI runs tests and build
3. CI deploys to Cloudflare Workers

## Release Process

1. Create feature branch from `main`
2. Implement changes
3. Push and verify CI passes
4. Merge via PR to `main`
5. CI automatically deploys

---
*Updated 2026-04-30*