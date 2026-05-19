const { chromium } = require('playwright');

async function runFullTest() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = [];
  
  // Helper to log
  const log = (msg) => {
    console.log(msg);
    results.push(msg);
  };
  
  try {
    // ========== PUBLIC PAGES ==========
    log('\n=== PUBLIC PAGES ===');
    
    await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
    log(`âœ?Homepage: ${page.url()}`);
    
    await page.goto('http://localhost:4322/businesses', { waitUntil: 'networkidle' });
    log(`âœ?Businesses: ${page.url()}`);
    
    await page.goto('http://localhost:4322/listings', { waitUntil: 'networkidle' });
    log(`âœ?Listings: ${page.url()}`);
    
    // ========== USER REGISTRATION ==========
    log('\n=== USER REGISTRATION ===');
    
    await page.goto('http://localhost:4322/register', { waitUntil: 'networkidle' });
    log(`âœ?Register page: ${page.url()}`);
    
    // Fill registration form
    await page.fill('#name', 'Test User QA');
    await page.fill('#email', `qa_${Date.now()}@test.com`);
    await page.fill('#password', 'test12345');
    await page.fill('#confirmPassword', 'test12345');
    await page.click('#submit-btn');
    await page.waitForTimeout(2000);
    
    // Check for success message or redirect
    const currentUrl = page.url();
    if (currentUrl.includes('/account') || currentUrl.includes('success')) {
      log(`âœ?Registration successful, redirected to: ${currentUrl}`);
    } else {
      log(`âš?Registration redirect: ${currentUrl}`);
    }
    
    // ========== USER LOGIN ==========
    log('\n=== USER LOGIN ===');
    
    await page.goto('http://localhost:4322/login', { waitUntil: 'networkidle' });
    log(`âœ?Login page: ${page.url()}`);
    
    await page.fill('#email', 'user@TimorUp.com');
    await page.fill('#password', 'user12345');
    await page.click('#submit-btn');
    await page.waitForTimeout(2000);
    
    log(`âœ?After login: ${page.url()}`);
    
    // ========== ACCOUNT PAGE ==========
    log('\n=== ACCOUNT PAGE ===');
    
    await page.goto('http://localhost:4322/account', { waitUntil: 'networkidle' });
    log(`âœ?Account page: ${page.url()}`);
    
    // Check if logged in (should not redirect)
    if (!page.url().includes('/login')) {
      log(`âœ?User is logged in, on account page`);
    }
    
    // ========== ADMIN LOGIN ==========
    log('\n=== ADMIN LOGIN ===');
    
    await page.goto('http://localhost:4322/admin/login', { waitUntil: 'networkidle' });
    log(`âœ?Admin login page: ${page.url()}`);
    
    await page.fill('#email', 'admin@TimorUp.com');
    await page.fill('#password', 'admin12345');
    await page.click('#submit-btn');
    await page.waitForTimeout(2000);
    
    log(`âœ?After admin login: ${page.url()}`);
    
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
      log(`âœ?${adminPage} - "${title}"`);
    }
    
    // ========== LOGOUT ==========
    log('\n=== LOGOUT ===');
    
    await page.goto('http://localhost:4322', { waitUntil: 'networkidle' });
    
    // Try to find logout button
    const logoutBtn = await page.$('a[href*="sign-out"], button:has-text("Logout"), button:has-text("Log out"), button:has-text("Sign Out")');
    if (logoutBtn) {
      await logoutBtn.click();
      await page.waitForTimeout(1000);
      log(`âœ?Logged out, now at: ${page.url()}`);
    } else {
      log(`âš?No logout button found`);
    }
    
    log('\n=== ALL TESTS COMPLETE ===');
    
  } catch (error) {
    log(`\nâ?ERROR: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  return results;
}

runFullTest().then(results => {
  console.log('\n========== TEST SUMMARY ==========');
  results.forEach(r => console.log(r));
}).catch(console.error);

