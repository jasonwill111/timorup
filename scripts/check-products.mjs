import { createClient } from '@libsql/client';

const client = createClient({ url: 'file:local.db' });

async function main() {
  const result = await client.execute("PRAGMA table_info(products)");
  console.log('Products table columns:');
  result.rows.forEach(row => {
    console.log(`  ${row.name} (${row.type})`);
  });

  client.close();
}

main();
