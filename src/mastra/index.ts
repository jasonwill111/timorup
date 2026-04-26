import { Mastra } from "@mastra/core";
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";
import { agents } from "./agents";

export const providers = {
  default: "minimax-cn-coding-plan",
} as const;

export type ProviderName = typeof providers.default;

export const mastra = new Mastra({
  agents,
  deployer: new CloudflareDeployer({
    name: 'timorlist-ai',
    vars: {
      NODE_ENV: 'production',
    },
  }),
});
