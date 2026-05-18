/**
 * Fix boolean defaults in code to match integer schema
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = 'src';

const patterns = [
  { regex: /isActive: true/g, replacement: 'isActive: 1' },
  { regex: /isActive: false/g, replacement: 'isActive: 0' },
  { regex: /isPublic: true/g, replacement: 'isPublic: 1' },
  { regex: /isPublic: false/g, replacement: 'isPublic: 0' },
  { regex: /featured: true/g, replacement: 'featured: 1' },
  { regex: /featured: false/g, replacement: 'featured: 0' },
  { regex: /isEdited: true/g, replacement: 'isEdited: 1' },
  { regex: /isEdited: false/g, replacement: 'isEdited: 0' },
  { regex: /active: true/g, replacement: 'active: 1' },
  { regex: /active: false/g, replacement: 'active: 0' },
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

console.log('Fixing boolean defaults...\n');
const files = walkDir(ROOT);
let fixed = 0;
for (const file of files) {
  if (processFile(file)) fixed++;
}
console.log(`\nDone! Fixed ${fixed} files.`);