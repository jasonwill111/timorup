// Sync product_categories from remote to local
const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== Sync product_categories ===\n');

// Get from remote
const result = execSync('npx wrangler d1 execute timorup-db --remote --command "SELECT * FROM product_categories ORDER BY sort_order, id"', {
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
  return `REPLACE INTO product_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields, created_at, updated_at) VALUES (${[
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

const sqlContent = sqlLines.join('\n');
const sqlFile = 'D:/Dev Projects/timorup/scripts/product_categories.sql';
fs.writeFileSync(sqlFile, sqlContent);

// Execute
execSync(`npx wrangler d1 execute timorup-db --file "${sqlFile}"`, {
  encoding: 'utf8',
  cwd: 'D:/Dev Projects/timorup'
});

// Verify
const verify = execSync('npx wrangler d1 execute timorup-db --command "SELECT COUNT(*) as total FROM product_categories"', {
  encoding: 'utf8',
  cwd: 'D:/Dev Projects/timorup'
});
console.log('Local count:', verify.match(/"total"\s*:\s*(\d+)/)?.[1] || '?');

// Cleanup
fs.unlinkSync(sqlFile);
console.log('Done');