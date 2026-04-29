/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { DrizzleD1Database } from 'drizzle-orm/d1';

declare global {
  namespace App {
    interface Locals {
      db?: DrizzleD1Database<any>;
    }
  }
}
