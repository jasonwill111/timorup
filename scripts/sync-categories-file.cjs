// Use file-based approach for sync
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Sync listing_categories (file approach) ===\n');

// Get from remote
console.log('1. Fetching from remote...');
const result = execSync('npx wrangler d1 execute timorup-db --remote --command "SELECT * FROM listing_categories ORDER BY sort_order, id"', {
  encoding: 'utf8',
  cwd: 'D:/Dev Projects/timorup'
});

const match = result.match(/"results"\s*:\s*(\[[\s\S]*?\])\s*,\s*"success"/);
const data = JSON.parse(match?.[1] || '[]');
console.log(`   Got ${data.length} categories\n`);

// Generate SQL file
console.log('2. Generating SQL file...');

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

const sqlContent = sqlLines.join('\n');
const sqlFile = 'D:/Dev Projects/timorup/scripts/temp_categories.sql';
fs.writeFileSync(sqlFile, sqlContent);
console.log(`   Written ${sqlLines.length} statements\n`);

// Execute via file
console.log('3. Importing via --file...');
try {
  execSync(`npx wrangler d1 execute timorup-db --file "${sqlFile}"`, {
    encoding: 'utf8',
    cwd: 'D:/Dev Projects/timorup'
  });
  console.log('   ✅ Import complete!');
} catch (e) {
  console.log('   Import error:', e.message?.slice(-200));
}

// Verify
console.log('\n4. Verifying...');
const verify = execSync('npx wrangler d1 execute timorup-db --command "SELECT COUNT(*) as total FROM listing_categories"', {
  encoding: 'utf8',
  cwd: 'D:/Dev Projects/timorup'
});
const vMatch = verify.match(/"total"\s*:\s*(\d+)/);
console.log(`   Local count: ${vMatch ? vMatch[1] : '?'}`);

if (vMatch && parseInt(vMatch[1]) === 134) {
  console.log('\n✅ Sync complete!');
} else {
  console.log('\n⚠️  Need manual sync');
}

// Cleanup
if (fs.existsSync(sqlFile)) {
  fs.unlinkSync(sqlFile);
}