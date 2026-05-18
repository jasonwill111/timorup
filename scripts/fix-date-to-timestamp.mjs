/**
 * Fix Date to timestamp conversion for updatedAt/createdAt/expiresAt fields
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = 'src';

// Pattern: updatedAt: new Date() -> updatedAt: Math.floor(Date.now() / 1000)
const patterns = [
  {
    regex: /updatedAt: new Date\(\)/g,
    replacement: 'updatedAt: Math.floor(Date.now() / 1000)',
    description: 'updatedAt: new Date()'
  },
  {
    regex: /createdAt: new Date\(\)/g,
    replacement: 'createdAt: Math.floor(Date.now() / 1000)',
    description: 'createdAt: new Date()'
  },
  {
    regex: /expiresAt: new Date\(\)/g,
    replacement: 'expiresAt: Math.floor(Date.now() / 1000)',
    description: 'expiresAt: new Date()'
  },
  {
    regex: /paidDate: new Date\(\)/g,
    replacement: 'paidDate: Math.floor(Date.now() / 1000)',
    description: 'paidDate: new Date()'
  },
  // Handle newExpiryDate = new Date()
  {
    regex: /newExpiryDate = new Date\(\)/g,
    replacement: 'newExpiryDate = Math.floor(Date.now() / 1000)',
    description: 'newExpiryDate = new Date()'
  },
  // Handle newExpiryDate = new Date() with semicolon
  {
    regex: /newExpiryDate = new Date\(\);/g,
    replacement: 'newExpiryDate = Math.floor(Date.now() / 1000);',
    description: 'newExpiryDate = new Date();'
  },
];

function processFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    let original = content;
    let fixed = 0;

    for (const { regex, replacement, description } of patterns) {
      const newContent = content.replace(regex, replacement);
      if (newContent !== content) {
        fixed++;
        content = newContent;
      }
    }

    if (content !== original) {
      writeFileSync(filePath, content);
      console.log(`Fixed ${fixed} pattern(s) in: ${filePath}`);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

function walkDir(dir) {
  const files = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      try {
        const stat = statSync(fullPath);
        if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
          files.push(...walkDir(fullPath));
        } else if (['.ts', '.tsx'].includes(extname(entry))) {
          files.push(fullPath);
        }
      } catch {}
    }
  } catch {}
  return files;
}

console.log('Fixing Date -> timestamp conversions...\n');
const files = walkDir(ROOT);
let fixed = 0;
for (const file of files) {
  if (processFile(file)) fixed++;
}
console.log(`\nDone! Fixed ${fixed} files.`);
console.log('Run `npx tsc --noEmit` to check.');