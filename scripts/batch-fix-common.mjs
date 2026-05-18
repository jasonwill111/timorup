/**
 * Batch fix common TypeScript errors
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = 'src';

// Common patterns to fix
const patterns = [
  // Fix z.record(z.unknown()) -> z.record(z.string(), z.unknown())
  { regex: /z\.record\(z\.unknown\(\)\)/g, replacement: 'z.record(z.string(), z.unknown())' },

  // Fix Date() for timestamps (but not new Date(b.createdAt) style)
  { regex: /publishedAt: new Date\(\)/g, replacement: 'publishedAt: Math.floor(Date.now() / 1000)' },

  // Fix entityType references in category code
  { regex: /entityType: input\.entityType,/g, replacement: '' },
  { regex: /if \(input\.entityType !== undefined\) updateData\.entityType = input\.entityType;/g, replacement: '' },

  // Fix ratingAverage sort (nonProfits/publicSectors don't have this)
  { regex: /case 'rating':\s+results\.sort\(\(a, b\) => \(b\.ratingAverage \|\| 0\) - \(a\.ratingAverage \|\| 0\)\);/g, replacement: '' },
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

console.log('Batch fixing TypeScript errors...\n');
const files = walkDir(ROOT);
let fixed = 0;
for (const file of files) {
  if (processFile(file)) fixed++;
}
console.log(`\nDone! Fixed ${fixed} files.`);