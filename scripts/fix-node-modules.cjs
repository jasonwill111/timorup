// Post-build script to fix Node.js module imports for Cloudflare Workers
const path = require('path');

// Fix path for module resolution
const projectRoot = path.resolve(__dirname, '..');
const fs = require('fs');

const chunksDir = path.join(projectRoot, 'dist/server/chunks');

// Modules to rename
const nodeModules = ['os', 'fs', 'path', 'crypto', 'buffer', 'events', 'module', 'url'];

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  for (const mod of nodeModules) {
    // Replace bare imports: from "os" -> from "node:os"
    const regex = new RegExp(`from ["']${mod}["']`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `from "node:${mod}"`);
      modified = true;
      console.log(`Fixed ${mod} imports in ${path.basename(filePath)}`);
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.mjs')) {
      fixImports(fullPath);
    }
  }
}

console.log('Processing dist/server/chunks for Node.js module imports...');
processDir(chunksDir);
console.log('Done!');