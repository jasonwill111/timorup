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
    
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
    log(`âœ?Homepage: ${page.url()}`);
    
    await page.goto('http://localhost:4321/businesses', { waitUntil: 'networkidle' });
    log(`âœ?Businesses: ${page.url()}`);
    
    await page.goto('http://localhost:4321/listings', { waitUntil: 'networkidle' });
    log(`âœ?Listings: ${page.url()}`);
    
    // ========== USER REGISTRATION ==========
    log('\n=== USER REGISTRATION ===');
    
    await page.goto('http://localhost:4321/register', { waitUntil: 'networkidle' });
    log(`âœ?Register page: ${page.url()}`);
    
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
          log(`âœ?After registration submit: ${page.url()}`);
        }
      } else {
        log(`âš?Password field not found`);
      }
    } else {
      log(`âš?Name input not found`);
    }
    
    // ========== USER LOGIN ==========
    log('\n=== USER LOGIN ===');
    
    await page.goto('http://localhost:4321/login', { waitUntil: 'networkidle' });
    log(`âœ?Login page: ${page.url()}`);
    
    await page.fill('#email', 'user@TimorUp.com');
    await page.fill('#password', 'user12345');
    
    const loginBtn = await page.$('#submit-btn');
    if (loginBtn) {
      await loginBtn.click();
      await page.waitForTimeout(3000);
      log(`âœ?After user login: ${page.url()}`);
    }
    
    // ========== ACCOUNT PAGE ==========
    log('\n=== ACCOUNT PAGE ===');
    
    await page.goto('http://localhost:4321/account', { waitUntil: 'networkidle' });
    log(`âœ?Account page: ${page.url()}`);
    
    // ========== ADMIN LOGIN ==========
    log('\n=== ADMIN LOGIN ===');

    await page.goto('http://localhost:4321/admin/login', { waitUntil: 'networkidle' });
    log(`âœ?Admin login page: ${page.url()}`);

    await page.fill('#email', 'admin@TimorUp.com');
    await page.fill('#password', 'admin12345');

    // Admin login uses button[type="submit"]
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);  // Wait longer for admin auth

    log(`âœ?After admin login: ${page.url()}`);

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
      await page.goto(`http://localhost:4321${adminPage}`, { waitUntil: 'networkidle' });
      const title = await page.title();
      log(`âœ?${adminPage} - "${title}"`);
    }
    
    log('\n=== ALL TESTS COMPLETE ===');
    
  } catch (error) {
    log(`\nâ?ERROR: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  return results;
}

runFullTest().then(() => {
  console.log('\n========== TEST COMPLETE ==========');
}).catch(console.error);

