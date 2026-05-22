const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== Sync listing_categories (v3) ===\n');

// Get from remote
console.log('1. Fetching from remote...');
const result = execSync('npx wrangler d1 execute timorup-db --remote --command "SELECT * FROM listing_categories ORDER BY sort_order, id"', {
  encoding: 'utf8',
  cwd: 'D:/Dev Projects/timorup'
});

const match = result.match(/"results"\s*:\s*(\[[\s\S]*?\])\s*,\s*"success"/);
const data = JSON.parse(match?.[1] || '[]');
console.log(`   Got ${data.length} categories\n`);

// Clear
console.log('2. Clearing local...');
execSync('npx wrangler d1 execute timorup-db --command "DELETE FROM listing_categories"', {
  encoding: 'utf8',
  cwd: 'D:/Dev Projects/timorup'
});

// Helper: encode value for SQL
function sqlEncode(v) {
  if (v === null || v === undefined) return 'NULL';
  const s = String(v);
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "''") + "'";
}

// Insert one by one
console.log('3. Inserting one by one...');
let success = 0;
let errors = 0;

for (let i = 0; i < data.length; i++) {
  const row = data[i];
  const values = [
    sqlEncode(row.id),
    sqlEncode(row.name),
    sqlEncode(row.slug),
    sqlEncode(row.description),
    sqlEncode(row.icon),
    row.parent_id ? sqlEncode(row.parent_id) : 'NULL',
    row.sort_order ?? 0,
    row.is_active ?? 1,
    sqlEncode(row.form_fields),
    row.created_at ?? 'NULL',
    row.updated_at ?? 'NULL'
  ].join(', ');

  const sql = `INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields, created_at, updated_at) VALUES (${values})`;

  // Escape for shell
  const escaped = sql.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/`/g, '\\`');

  try {
    execSync(`npx wrangler d1 execute timorup-db --command "${escaped}"`, {
      encoding: 'utf8',
      cwd: 'D:/Dev Projects/timorup'
    });
    success++;
  } catch (e) {
    errors++;
    if (errors <= 3) {
      console.log(`Error on ${row.name}:`, e.message?.slice(-80));
    }
  }

  if ((i + 1) % 20 === 0) {
    console.log(`   Progress: ${i + 1}/${data.length} (${success} OK, ${errors} errors)`);
  }
}

console.log(`\n   Total: ${success} OK, ${errors} errors\n`);

// Verify
console.log('4. Verifying...');
const verify = execSync('npx wrangler d1 execute timorup-db --command "SELECT COUNT(*) as total FROM listing_categories"', {
  encoding: 'utf8',
  cwd: 'D:/Dev Projects/timorup'
});
console.log(verify.slice(-200));