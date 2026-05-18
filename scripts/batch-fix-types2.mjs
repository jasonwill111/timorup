/**
 * Round 2 TypeScript Batch Fixer
 * Fixes remaining error patterns
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = 'src';

const patterns = [
  // Fix CacheStorage type cast
  {
    regex: /caches\.default/g,
    replacement: '(caches as unknown as { default: Cache }).default',
    description: 'Fix CacheStorage type cast'
  },
  // Fix .get() with explicit type assertion
  {
    regex: /\.get\(\);(\n)/g,
    replacement: '.get() as unknown;$1',
    description: 'Add type assertion to .get()'
  }
];

function processFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    let original = content;

    for (const { regex, replacement } of patterns) {
      content = content.replace(regex, replacement);
    }

    if (content !== original) {
      writeFileSync(filePath, content);
      console.log('Fixed:', filePath);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

function walkDir(dir, extensions = ['.ts', '.tsx']) {
  const files = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      try {
        const stat = statSync(fullPath);
        if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
          files.push(...walkDir(fullPath, extensions));
        } else if (extensions.includes(extname(entry))) {
          files.push(fullPath);
        }
      } catch {
        // Skip
      }
    }
  } catch {
    // Skip
  }
  return files;
}

console.log('Round 2 TypeScript fixes...\n');
const files = walkDir(ROOT);
let fixed = 0;
for (const file of files) {
  if (processFile(file)) fixed++;
}
console.log('\nDone! Fixed', fixed, 'files.');
console.log('Run `npx tsc --noEmit` to check.');