/**
 * Remove duplicate `if (!db) throw` lines
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = 'src';

function processFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Find lines with duplicate pattern: consecutive `if (!db) throw`
    const cleaned = [];
    let prevWasDbCheck = false;

    for (const line of lines) {
      const trimmed = line.replace(/\t/g, '  ');
      const isDbCheck = /^(\s*)if \(!db\) throw new Error/.test(trimmed);

      if (isDbCheck && prevWasDbCheck) {
        // Skip duplicate
        continue;
      }

      cleaned.push(line);
      prevWasDbCheck = isDbCheck;
    }

    const newContent = cleaned.join('\n');

    if (newContent !== content) {
      writeFileSync(filePath, newContent);
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

console.log('Removing duplicate db checks...\n');
const files = walkDir(ROOT);
let fixed = 0;
for (const file of files) {
  if (processFile(file)) {
    console.log('Fixed:', file);
    fixed++;
  }
}
console.log('\nDone! Fixed', fixed, 'files.');