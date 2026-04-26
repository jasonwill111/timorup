import { createClient } from '@libsql/client';

const client = createClient({ url: 'file:local.db' });

async function addColumn(table, column, type, defaultValue = null) {
  try {
    const sql = defaultValue
      ? `ALTER TABLE ${table} ADD COLUMN ${column} ${type} DEFAULT ${defaultValue}`
      : `ALTER TABLE ${table} ADD COLUMN ${column} ${type}`;
    await client.execute(sql);
    console.log(`Added ${column} to ${table}`);
  } catch (e) {
    if (e.message.includes('duplicate column name') || e.message.includes('already exists')) {
      console.log(`${column} already exists in ${table}`);
    } else {
      console.error(`Error adding ${column}: ${e.message}`);
    }
  }
}

async function main() {
  // business_pages columns
  await addColumn('business_pages', 'industry', 'TEXT');
  await addColumn('business_pages', 'entity_type', 'TEXT', "'business'");
  await addColumn('business_pages', 'registration_url', 'TEXT');
  await addColumn('business_pages', 'verified_badge', 'INTEGER', '0');
  await addColumn('business_pages', 'location_lng', 'REAL');

  // products columns
  await addColumn('products', 'price_fields', 'TEXT');
  await addColumn('products', 'service_type', 'TEXT', "'product'");

  console.log('Done!');
  client.close();
}

main();
