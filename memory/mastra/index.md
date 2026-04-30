# Mastra (timorlist)

> v1.28.0 | AI Agent Framework | Cloudflare Workers

## Agent 定义

```typescript
// src/mastra/agents/index.ts
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';

export const listingAgent = new Agent({
  name: 'listing-assistant',
  model: openai('gpt-4o'),
  instructions: `
    You are a listing assistant for TIMORLIST.
    Help users create and manage their business listings.
  `,
  tools: [],
});
```

## Memory

```typescript
import { VectorMemory } from '@mastra/memory';

const memory = new VectorMemory({
  type: 'pinecone',
  embeddingModel: openaiEmbedding('text-embedding-3-small'),
});
```

## Workflow

```typescript
import { Workflow } from '@mastra/core/workflows';

const listingWorkflow = new Workflow({
  name: 'create-listing',
  trigger: {},
  steps: [/* workflow steps */],
});
```

## Deploy

```typescript
import { CloudflareWorkerDeployer } from '@mastra/deployer-cloudflare';

const deployer = new CloudflareWorkerDeployer();
await deployer.deploy(agent);
```
