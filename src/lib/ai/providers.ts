// Unified AI Provider Configuration
// Centralized provider settings for Mastra and Workers AI

// Get MINIMAX_API_KEY from env
const minimaxApiKey: string =
  (typeof import.meta !== 'undefined' ? (import.meta.env as Record<string, string>)?.MINIMAX_API_KEY : undefined)
  ?? (typeof process !== 'undefined' ? process.env?.MINIMAX_API_KEY : undefined)
  ?? '';

// MiniMax provider config (primary - for complex tasks)
export const minimaxProvider = {
  providerId: 'minimax-cn-coding-plan' as const,
  modelId: 'MiniMax-M2.7' as const,
  apiKey: minimaxApiKey,
};

// Cloudflare Workers AI config (fallback - for lightweight tasks)
export const workersAIProvider = {
  // Built-in Workers AI models
  // @see https://developers.cloudflare.com/workers-ai/models/
  models: {
    // Text generation
    '@cf/meta/llama-3-8b-instruct': 'Meta Llama 3 8B Instruct',
    '@cf/meta/llama-3-70b-instruct': 'Meta Llama 3 70B Instruct',

    // Code generation
    '@cf/defog/llama-3-8b-instruct-sql': 'SQL generation',
    '@cf/codellama/llama-3-8b-instruct': 'Code generation',

    // Embeddings
    '@cf/baai/bge-base-en-v1.5': 'English embeddings',
    '@cf/baai/bge-large-zh-v1.5': 'Chinese embeddings',

    // Vision
    '@cf/unum/uplug-og': 'Image understanding',
    '@cf/llava-hf/llava-1.5-7b-hf': 'Image understanding (LLava)',
  } as const,
} as const;

// Unified model selector
export type ModelType = 'minimax' | 'workers-sql' | 'workers-code' | 'workers-embed';

export function getModelConfig(type: ModelType) {
  switch (type) {
    case 'minimax':
      return {
        provider: minimaxProvider,
        description: 'Complex tasks - MiniMax M2.7',
      };
    case 'workers-sql':
      return {
        modelId: workersAIProvider.models['@cf/defog/llama-3-8b-instruct-sql'],
        description: 'SQL generation - Workers AI',
      };
    case 'workers-code':
      return {
        modelId: workersAIProvider.models['@cf/codellama/llama-3-8b-instruct'],
        description: 'Code generation - Workers AI',
      };
    case 'workers-embed':
      return {
        modelId: workersAIProvider.models['@cf/baai/bge-base-en-v1.5'],
        description: 'Embeddings - Workers AI',
      };
    default:
      return {
        provider: minimaxProvider,
        description: 'Default - MiniMax',
      };
  }
}

// Export for type safety
export type MinimaxProvider = typeof minimaxProvider;
export type WorkersAIProvider = typeof workersAIProvider;
