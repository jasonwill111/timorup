// Debug sync - check file and data
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Debug Sync ===\n');

// Get from remote
const result = execSync('npx wrangler d1 execute timorup-db --remote --command "SELECT * FROM listing_categories ORDER BY sort_order, id"', {
  encoding: 'utf8',
  cwd: 'D:/Dev Projects/timorup'
});

const match = result.match(/"results"\s*:\s*(\[[\s\S]*?\])\s*,\s*"success"/);
const data = JSON.parse(match?.[1] || '[]');
console.log(`Got ${data.length} categories\n`);

// Generate SQL
const escape = (v) => {
  if (v === null || v === undefined) return 'NULL';
  const s = String(v);
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "''") + "'";
};

const sqlLines = data.map(row => {
  return `INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields, created_at, updated_at) VALUES (${[
    escape(row.id),
    escape(row.name),
    escape(row.slug),
    escape(row.description),
    escape(row.icon),
    row.parent_id ? escape(row.parent_id) : 'NULL',
    row.sort_order ?? 0,
    row.is_active ?? 1,
    escape(row.form_fields),
    row.created_at ?? 'NULL',
    row.updated_at ?? 'NULL'
  ].join(', ')});`;
});

// Write to file
const sqlFile = 'D:/Dev Projects/timorup/scripts/debug_categories.sql';
fs.writeFileSync(sqlFile, sqlLines.join('\n'));

console.log(`SQL file written: ${sqlFile}`);
console.log(`File size: ${fs.statSync(sqlFile).size} bytes`);
console.log(`First line length: ${sqlLines[0].length} chars`);
console.log(`\nFirst line:\n${sqlLines[0]}\n`);

// Check for duplicate slugs in source
const slugs = data.map(d => d.slug);
const unique = new Set(slugs);
console.log(`Total: ${slugs.length}, Unique: ${unique.size}`);
if (slugs.length !== unique.size) {
  const counts = {};
  slugs.forEach(s => counts[s] = (counts[s] || 0) + 1);
  const duplicates = Object.entries(counts).filter(([, c]) => c > 1);
  console.log('Duplicates:', duplicates);
}