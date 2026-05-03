// Update the wrangler dev D1 database with test accounts
const db = require('better-sqlite3')('./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/b35dc1252703368fd322588b14dfdbedf063db1b9844683bfee80e94dd327afa.sqlite');
const crypto = require('crypto');

// Import better-auth's password module (direct path to ensure exact match)
const { hashPassword, verifyPassword } = require('./node_modules/.pnpm/@better-auth+utils@0.4.0/node_modules/@better-auth/utils/dist/password.node.cjs');

// Test password
const TEST_PASSWORD = 'TestPassword123!';

async function main() {
  const now = Math.floor(Date.now() / 1000);

  // Get admin user
  const adminUser = db.prepare("SELECT id FROM users WHERE email = 'admin@timorlist.test'").get();

  if (!adminUser) {
    console.log('No admin@timorlist.test user found. Creating one...');

    // Insert admin user
    db.prepare(`
      INSERT INTO users (id, email, email_verified, phone, name, image, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('user-admin-1', 'admin@timorlist.test', 0, '+6707700000', 'Admin User', null, 'admin', now, now);

    const adminUser2 = db.prepare("SELECT id FROM users WHERE email = 'admin@timorlist.test'").get();
    console.log('Created admin user:', adminUser2.id);

    // Create account using better-auth's hash (exact match)
    const passwordHash = await hashPassword(TEST_PASSWORD);
    db.prepare(`
      INSERT INTO accounts (id, account_id, provider_id, user_id, password, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), crypto.randomUUID().replace(/-/g, '').substring(0, 32), 'credential', adminUser2.id, passwordHash, now, now);
    console.log('Created admin account');
  } else {
    console.log('Admin user found:', adminUser.id);

    // Delete existing account and create new one
    db.prepare('DELETE FROM accounts WHERE user_id = ?').run(adminUser.id);

    const passwordHash = await hashPassword(TEST_PASSWORD);
    db.prepare(`
      INSERT INTO accounts (id, account_id, provider_id, user_id, password, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(crypto.randomUUID(), crypto.randomUUID().replace(/-/g, '').substring(0, 32), 'credential', adminUser.id, passwordHash, now, now);
    console.log('Reset admin account with new password');
  }

  // Verify the password using better-auth's verify function
  const account = db.prepare('SELECT * FROM accounts WHERE user_id = ?').get(adminUser.id);

  const match = await verifyPassword(account.password, TEST_PASSWORD);
  console.log('Password verification:', match ? 'SUCCESS' : 'FAILED');

  console.log('\nTest credentials: admin@timorlist.test /', TEST_PASSWORD);
}

main().catch(console.error);