import { chromium } from 'playwright';

async function runFullTest() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = [];
  const log = (msg) => {
    console.log(msg);
    results.push(msg);
  };
  
  try {
    // ========== PUBLIC PAGES ==========
    log('\n=== PUBLIC PAGES ===');
    
    await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
    log(`✓ Homepage: ${page.url()}`);
    
    await page.goto('http://localhost:4322/businesses', { waitUntil: 'networkidle' });
    log(`✓ Businesses: ${page.url()}`);
    
    await page.goto('http://localhost:4322/listings', { waitUntil: 'networkidle' });
    log(`✓ Listings: ${page.url()}`);
    
    // ========== USER REGISTRATION ==========
    log('\n=== USER REGISTRATION ===');
    
    await page.goto('http://localhost:4322/register', { waitUntil: 'networkidle' });
    log(`✓ Register page: ${page.url()}`);
    
    // Check if form exists
    const nameInput = await page.$('#name');
    if (nameInput) {
      await page.fill('#name', 'Test User QA');
      await page.fill('#email', `qa_${Date.now()}@test.com`);
      
      // Find password fields
      const passwordInput = await page.$('#password');
      if (passwordInput) {
        await page.fill('#password', 'test12345');
        await page.fill('#confirmPassword', 'test12345');
        
        // Click submit
        const submitBtn = await page.$('#submit-btn');
        if (submitBtn) {
          await submitBtn.click();
          await page.waitForTimeout(3000);
          log(`✓ After registration submit: ${page.url()}`);
        }
      } else {
        log(`⚠ Password field not found`);
      }
    } else {
      log(`⚠ Name input not found`);
    }
    
    // ========== USER LOGIN ==========
    log('\n=== USER LOGIN ===');
    
    await page.goto('http://localhost:4322/login', { waitUntil: 'networkidle' });
    log(`✓ Login page: ${page.url()}`);
    
    await page.fill('#email', 'user@timorlist.com');
    await page.fill('#password', 'user12345');
    
    const loginBtn = await page.$('#submit-btn');
    if (loginBtn) {
      await loginBtn.click();
      await page.waitForTimeout(3000);
      log(`✓ After user login: ${page.url()}`);
    }
    
    // ========== ACCOUNT PAGE ==========
    log('\n=== ACCOUNT PAGE ===');
    
    await page.goto('http://localhost:4322/account', { waitUntil: 'networkidle' });
    log(`✓ Account page: ${page.url()}`);
    
    // ========== ADMIN LOGIN ==========
    log('\n=== ADMIN LOGIN ===');

    await page.goto('http://localhost:4322/admin/login', { waitUntil: 'networkidle' });
    log(`✓ Admin login page: ${page.url()}`);

    await page.fill('#email', 'admin@timorlist.com');
    await page.fill('#password', 'admin12345');

    // Admin login uses button[type="submit"]
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);  // Wait longer for admin auth

    log(`✓ After admin login: ${page.url()}`);

    // Only check error message if still on login page
    if (page.url().includes('/admin/login')) {
      const errorMsg = await page.textContent('#error-message');
      if (errorMsg) log(`  Error: ${errorMsg}`);
    }
    
    // ========== ADMIN PAGES ==========
    log('\n=== ADMIN PAGES ===');
    
    const adminPages = [
      '/admin',
      '/admin/blogs',
      '/admin/businesses',
      '/admin/skus',
      '/admin/categories',
      '/admin/heroes',
      '/admin/media',
      '/admin/service-packages',
      '/admin/subscriptions',
      '/admin/users',
      '/admin/reviews',
      '/admin/settings',
      '/admin/ai-tools'
    ];
    
    for (const adminPage of adminPages) {
      await page.goto(`http://localhost:4322${adminPage}`, { waitUntil: 'networkidle' });
      const title = await page.title();
      log(`✓ ${adminPage} - "${title}"`);
    }
    
    log('\n=== ALL TESTS COMPLETE ===');
    
  } catch (error) {
    log(`\n❌ ERROR: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  return results;
}

runFullTest().then(() => {
  console.log('\n========== TEST COMPLETE ==========');
}).catch(console.error);
