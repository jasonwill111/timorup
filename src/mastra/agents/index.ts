// AI Agents - Mastra Agents with MiniMax M2.7
import { Agent } from "@mastra/core/agent";
import {
  LISTING_INSTRUCTIONS,
  SKU_INSTRUCTIONS,
  BLOG_INSTRUCTIONS,
  LANDING_INSTRUCTIONS,
} from '@/lib/ai/validation';

// NOTE: In Cloudflare Workers, process.env is NOT available by default.
// We MUST use the nodejs_compat_populate_process_env compatibility flag in wrangler.jsonc
// For local dev: Vite loads .env into import.meta.env
//
// IMPORTANT: For Cloudflare Workers, we read env vars via globalThis.env (Workers runtime)
// For local dev with Vite, we use import.meta.env

// API key - must be accessible at module load time
const getApiKey = (): string => {
  // Try Workers env first (cloudflare:workers runtime)
  if (typeof globalThis !== 'undefined' && (globalThis as any).env?.MINIMAX_API_KEY) {
    return (globalThis as any).env.MINIMAX_API_KEY;
  }
  // Try import.meta.env (Vite)
  if (typeof import.meta !== 'undefined') {
    const env = import.meta.env as Record<string, string | undefined>;
    if (env?.MINIMAX_API_KEY) return env.MINIMAX_API_KEY;
  }
  // Try process.env (Node.js)
  if (typeof process !== 'undefined' && process.env?.MINIMAX_API_KEY) {
    return process.env.MINIMAX_API_KEY;
  }
  return '';
};

const minimaxApiKey = getApiKey();

// Log API key status at module load
const apiKeyStatus = minimaxApiKey ? `SET (length: ${minimaxApiKey.length})` : 'NOT SET';
console.log('[Mastra Agents] API Key status:', apiKeyStatus);

// Model config - use type assertion to avoid Workers type issues
const minimaxModel = {
  providerId: "minimax-cn-coding-plan",
  modelId: "MiniMax-M2.7",
  apiKey: minimaxApiKey || undefined,
} as Parameters<typeof Agent>[0]['model'];

// ============================================
// Listing Creator Agent
// ============================================
export const listingCreator = new Agent({
  id: "listing-creator",
  name: "Listing Creator",
  instructions: LISTING_INSTRUCTIONS,
  model: minimaxModel as any,
});

// ============================================
// SKU Creator Agent
// ============================================
export const skuCreator = new Agent({
  id: "sku-creator",
  name: "SKU Creator",
  instructions: SKU_INSTRUCTIONS,
  model: minimaxModel as any,
});

// ============================================
// Blog Creator Agent
// ============================================
export const blogCreator = new Agent({
  id: "blog-creator",
  name: "Blog Creator",
  instructions: BLOG_INSTRUCTIONS,
  model: minimaxModel as any,
});

// ============================================
// Landing Page Creator Agent
// ============================================
export const landingPageCreator = new Agent({
  id: "landing-page-creator",
  name: "Landing Page Creator",
  instructions: LANDING_INSTRUCTIONS,
  model: minimaxModel as any,
});

export const agents = {
  listingCreator,
  skuCreator,
  blogCreator,
  landingPageCreator,
};