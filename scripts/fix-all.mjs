/**
 * Comprehensive TypeScript error batch fixer
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = 'src';

const patterns = [
  // Date() -> timestamp for DB fields
  { regex: /publishedAt: new Date\(\)/g, replacement: 'publishedAt: Math.floor(Date.now() / 1000)' },
  { regex: /updatedAt: new Date\(\)/g, replacement: 'updatedAt: Math.floor(Date.now() / 1000)' },
  { regex: /createdAt: new Date\(\)/g, replacement: 'createdAt: Math.floor(Date.now() / 1000)' },
  { regex: /expiresAt: new Date\(\)/g, replacement: 'expiresAt: Math.floor(Date.now() / 1000)' },

  // Boolean -> integer for schema fields
  { regex: /isActive: true/g, replacement: 'isActive: 1' },
  { regex: /isActive: false/g, replacement: 'isActive: 0' },
  { regex: /featured: true/g, replacement: 'featured: 1' },
  { regex: /featured: false/g, replacement: 'featured: 0' },

  // z.record fixes
  { regex: /z\.record\(z\.unknown\(\)\)/g, replacement: 'z.record(z.string(), z.unknown())' },

  // Remove entityType from queries where not in schema
  { regex: /,\s*entityType: input\.entityType/g, replacement: '' },
  { regex: /if \(input\.entityType !== undefined\) updateData\.entityType = input\.entityType;/g, replacement: '' },

  // Remove ratingAverage sort case for nonProfits/publicSectors
  { regex: /case 'rating':\s*results\.sort\(\(a, b\) => \(b\.ratingAverage \|\| 0\) - \(a\.ratingAverage \|\| 0\)\);\s*break;/g, replacement: '' },

  // Fix auth.ts cookies access
  { regex: /cookies\.get\('better-auth\.session_token'\)/g, replacement: "Object.fromEntries(request.headers.get('cookie')?.split('; ').map(c => c.split('=')) || [])['better-auth.session_token']" },
];

function processFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf8');
    let original = content;
    let count = 0;

    for (const { regex, replacement } of patterns) {
      const newContent = content.replace(regex, replacement);
      if (newContent !== content) {
        count++;
        content = newContent;
      }
    }

    if (count > 0) {
      writeFileSync(filePath, content);
      console.log(`Fixed ${count} in: ${filePath}`);
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

console.log('Running comprehensive TypeScript fixes...\n');
const files = walkDir(ROOT);
let fixed = 0;
for (const file of files) {
  if (processFile(file)) fixed++;
}
console.log(`\nDone! Fixed ${fixed} files.`);