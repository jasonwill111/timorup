// Sync listing_categories with improved escaping
const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== Sync listing_categories (v2) ===\n');

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
  // Replace backslash first, then single quotes
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "''") + "'";
}

// Build batch INSERT (100 at a time)
console.log('3. Inserting in batches...');
const batchSize = 100;
const batches = [];

for (let i = 0; i < data.length; i += batchSize) {
  const batch = data.slice(i, i + batchSize);
  const values = batch.map(row => {
    return `(${[
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
    ].join(', ')})`;
  }).join(',\n');

  batches.push(values);
}

let success = 0;
let errors = 0;

for (let i = 0; i < batches.length; i++) {
  const sql = `INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields, created_at, updated_at) VALUES ${batches[i]}`;
  try {
    execSync(`npx wrangler d1 execute timorup-db --command "${sql.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8',
      cwd: 'D:/Dev Projects/timorup'
    });
    success++;
  } catch (e) {
    errors++;
    console.log(`Batch ${i + 1} error`);
  }
}

console.log(`   Batches: ${success} OK, ${errors} errors\n`);

// Verify
console.log('4. Verifying...');
const verify = execSync('npx wrangler d1 execute timorup-db --command "SELECT COUNT(*) as total, SUM(CASE WHEN parent_id IS NULL THEN 1 ELSE 0 END) as tops, SUM(CASE WHEN parent_id IS NOT NULL THEN 1 ELSE 0 END) as subs FROM listing_categories"', {
  encoding: 'utf8',
  cwd: 'D:/Dev Projects/timorup'
});

const vMatch = verify.match(/"total"\s*:\s*(\d+)/);
const total = vMatch ? vMatch[1] : '?';

console.log(`   Local count: ${total} (expected 134)\n`);

if (parseInt(total) === 134) {
  console.log('✅ Sync complete!');
} else {
  console.log('⚠️  Partial sync - may need retry');
}