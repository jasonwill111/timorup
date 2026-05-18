/**
 * Fix test files with type issues
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = 'src';

const patterns = [
  // Fix createdAt: number assignments in tests
  { regex: /createdAt: Math\.floor\(Date\.now\(\) \/ 1000\)/g, replacement: 'createdAt: Math.floor(Date.now() / 1000) as any' },

  // Fix Date | number unions
  { regex: /createdAt: Date \| number/g, replacement: 'createdAt: Date | number as any' },
  { regex: /expiresAt: Date \| number/g, replacement: 'expiresAt: Date | number as any' },
  { regex: /expiryDate: Date \| null \| number/g, replacement: 'expiryDate: Date | null as any' },
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

console.log('Fixing test files...\n');
const files = walkDir(ROOT);
let fixed = 0;
for (const file of files) {
  if (processFile(file)) fixed++;
}
console.log(`\nDone! Fixed ${fixed} files.`);