# Mastra AI + MiniMax 集成配置

## 核心配置

### API Key 读取方式

`@mastra/core` 通过 `process.env.MINIMAX_API_KEY` 读取：

```typescript
const minimaxApiKey =
  (typeof import.meta !== 'undefined' ? import.meta.env?.MINIMAX_API_KEY : undefined)
  ?? (typeof process !== 'undefined' ? process.env?.MINIMAX_API_KEY : undefined)
  ?? ''
```

### MiniMax Provider

```typescript
model: {
  providerId: "minimax-cn-coding-plan",
  modelId: "MiniMax-M2.7",
  apiKey: minimaxApiKey,
}
```

## 文件结构

```
src/mastra/
├── index.ts          # Mastra 实例配置
└── agents/
    └── index.ts      # Agent 定义
```

## Cloudflare Pages 配置

### wrangler.toml
确保设置了 `nodejs_compat` compatibility flag：
```toml
compatibility_flags = ["nodejs_compat"]
```

### Secret 设置
```bash
npx wrangler secret put MINIMAX_API_KEY
```

## Agent 使用

```typescript
import { agents } from '@/mastra/agents'

const agent = agents.listingCreator
const response = await agent.generate(message)
const text = response.text
```

## 常见问题

### Q: 本地测试失败？
本地开发用 `.env` 文件设置 `MINIMAX_API_KEY`

### Q: Cloudflare 部署失败？
1. 检查 `MINIMAX_API_KEY` 是否通过 `wrangler secret put` 设置
2. 确保 `compatibility_flags = ["nodejs_compat"]` 已配置

---

*Created: 2026-04-26*
