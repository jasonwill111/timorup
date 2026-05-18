/**
 * TypeScript Batch Fixer for Cloudflare Workers + Astro SSR
 * Fixes common patterns across the codebase
 * Run: node scripts/batch-fix-types.js
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = 'src';

const patterns = [
  // Fix 1: Add null check after getDb() - expanded pattern
  {
    regex: /const db = await getDb\(\);/g,
    replacement: 'const db = await getDb();\nif (!db) throw new Error("Database not available");',
    description: 'Add null check after getDb()'
  },
  // Fix 1b: Handle case where db is already used in line
  {
    regex: /const db = await getDb\(\);(\n\s+if \(db\) throw new Error\("Database not available"\);)?/g,
    replacement: 'const db = await getDb();\nif (!db) throw new Error("Database not available");',
    description: 'Ensure single null check after getDb()'
  },
  // Fix 2: env.* binding type assertions
  {
    regex: /const (\w+) = (env\.\w+) as \w+ \| undefined;/g,
    replacement: 'const $1 = ($2 as string | undefined) ?? "";',
    description: 'Fix env bindings with null coalescing'
  },
  // Fix 3: db.all() type annotations with generic type
  {
    regex: /await db\.all\(`/g,
    replacement: 'await db.all<Record<string, unknown>>(`',
    description: 'Add type annotation to db.all()'
  },
  // Fix 4: Fix db.select().all() with type cast
  {
    regex: /\.from\((\w+)\)\.all\(\)/g,
    replacement: '.from($1).all() as Record<string, unknown>[]',
    description: 'Add type cast to .all()'
  },
  // Fix 5: Fix .get() with null coalescing
  {
    regex: /\.get\(\);(\n)/g,
    replacement: '.get() ?? undefined;$1',
    description: 'Add null coalescing to .get()'
  },
  // Fix 6: Handle const result = await db.select()
  {
    regex: /const result = await db\.select\(\)\.from\(/g,
    replacement: 'const result = await db.select().from(',
    description: 'Keep result for later handling'
  }
];

function processFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    let original = content;

    for (const { regex, replacement } of patterns) {
      if (typeof replacement === 'function') {
        content = content.replace(regex, (m) => replacement(m));
      } else {
        content = content.replace(regex, replacement);
      }
    }

    if (content !== original) {
      writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (e) {
    console.error(`Error processing ${filePath}: ${e.message}`);
    return false;
  }
}

function walkDir(dir, extensions = ['.ts', '.tsx']) {
  const files = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
        files.push(...walkDir(fullPath, extensions));
      } else if (extensions.includes(extname(entry))) {
        files.push(fullPath);
      }
    }
  } catch {
    // Skip
  }
  return files;
}

// Run
console.log('Fixing TypeScript errors...\n');
const files = walkDir(ROOT);
let fixed = 0;
for (const file of files) {
  if (processFile(file)) fixed++;
}
console.log(`\nDone! Fixed ${fixed} files.`);
console.log('Run `npx tsc --noEmit` to check remaining errors.');