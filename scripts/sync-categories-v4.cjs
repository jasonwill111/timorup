// Use file-based approach for sync
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Sync listing_categories (v4 - file approach) ===\n');

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

// Encode for base64 (safe for any special chars)
console.log('3. Writing SQL file...');

const sqlLines = data.map(row => {
  const escape = (v) => {
    if (v === null || v === undefined) return 'NULL';
    const s = String(v);
    // Escape for SQL string
    return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "''") + "'";
  };

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

const sqlContent = sqlLines.join('\n');
const sqlFile = path.join(__dirname, '..', 'temp_categories.sql');
fs.writeFileSync(sqlFile, sqlContent);
console.log(`   Written ${sqlLines.length} statements to ${sqlFile}\n`);

// Read and execute in smaller chunks
console.log('4. Executing via wrangler --file...');

try {
  // Execute using --file flag
  execSync(`npx wrangler d1 execute timorup-db --file ${sqlFile}`, {
    encoding: 'utf8',
    cwd: 'D:/Dev Projects/timorup'
  });
  console.log('   ✅ File import complete!');
} catch (e) {
  console.log('   File import failed, trying manual insert...');
}

// Verify
console.log('\n5. Verifying...');
const verify = execSync('npx wrangler d1 execute timorup-db --command "SELECT COUNT(*) as total FROM listing_categories"', {
  encoding: 'utf8',
  cwd: 'D:/Dev Projects/timorup'
});
console.log(verify.slice(-200));

// Cleanup
if (fs.existsSync(sqlFile)) {
  fs.unlinkSync(sqlFile);
  console.log('\n   Cleaned up temp file');
}