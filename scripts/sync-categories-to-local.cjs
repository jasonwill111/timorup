// Sync listing_categories from remote to local D1
// Run: node scripts/sync-categories-to-local.cjs

const { execSync } = require('child_process');

console.log('=== Sync listing_categories from Remote to Local ===\n');

// 1. Get all categories from remote
console.log('Fetching remote categories...');
try {
  const result = execSync('npx wrangler d1 execute timorup-db --remote --command "SELECT * FROM listing_categories ORDER BY sort_order, id"', {
    encoding: 'utf8',
    cwd: 'D:/Dev Projects/timorup'
  });

  // Parse JSON
  const match = result.match(/"results"\s*:\s*(\[[\s\S]*?\])\s*,\s*"success"/);
  const data = JSON.parse(match?.[1] || '[]');

  console.log(`Got ${data.length} categories from remote\n`);

  // 2. Clear local table
  console.log('Clearing local table...');
  execSync('npx wrangler d1 execute timorup-db --command "DELETE FROM listing_categories"', {
    encoding: 'utf8',
    cwd: 'D:/Dev Projects/timorup'
  });
  console.log('Cleared\n');

  // 3. Insert each category
  console.log('Inserting categories...');
  let success = 0;
  let errors = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const escape = (v) => v === null || v === undefined ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`;

    const values = [
      escape(row.id),
      escape(row.name),
      escape(row.slug),
      escape(row.description),
      escape(row.icon),
      row.parent_id ? escape(row.parent_id) : 'NULL',
      row.sort_order ?? 0,
      row.is_active ?? 1,
      row.form_fields ? escape(row.form_fields) : 'NULL',
      row.created_at ?? 'NULL',
      row.updated_at ?? 'NULL'
    ].join(', ');

    const sql = `INSERT INTO listing_categories (id, name, slug, description, icon, parent_id, sort_order, is_active, form_fields, created_at, updated_at) VALUES (${values})`;

    try {
      execSync(`npx wrangler d1 execute timorup-db --command "${sql.replace(/"/g, '\\"')}"`, {
        encoding: 'utf8',
        cwd: 'D:/Dev Projects/timorup'
      });
      success++;
    } catch (e) {
      errors++;
      if (errors <= 3) {
        console.log(`Error on ${row.name}:`, e.message?.slice(-100));
      }
    }

    if ((i + 1) % 20 === 0) {
      console.log(`Progress: ${i + 1}/${data.length} (${success} OK, ${errors} errors)`);
    }
  }

  console.log(`\n=== Results ===`);
  console.log(`Success: ${success}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total: ${success + errors}`);

  // Verify
  console.log('\nVerifying local...');
  const verify = execSync('npx wrangler d1 execute timorup-db --command "SELECT COUNT(*) as total, SUM(CASE WHEN parent_id IS NULL THEN 1 ELSE 0 END) as tops FROM listing_categories"', {
    encoding: 'utf8',
    cwd: 'D:/Dev Projects/timorup'
  });
  console.log(verify.slice(-200));

} catch (e) {
  console.error('Error:', e.message);
}