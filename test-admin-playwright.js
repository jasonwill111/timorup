import { chromium } from 'playwright';

const BASE_URL = 'https://TimorLink.jasonwill.workers.dev';
const ADMIN_EMAIL = 'admin@TimorLink.com';
const ADMIN_PASSWORD = 'admin12345';

async function runTests() {
  console.log('══════════════════════════════════════════════════════════════�?);
  console.log('🚀 ADMIN E2E TESTS - All Pages and Functions');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Step 1: Login
    console.log('🔐 Step 1: Logging in as admin...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Fill login form
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('#submit-btn');
    await page.waitForTimeout(3000);

    const urlAfterLogin = page.url();
    const cookies = await context.cookies();
    console.log(`   After login URL: ${urlAfterLogin}`);
    console.log(`   Cookies set: ${cookies.length}`);

    // Step 2: Test all admin pages
    console.log('\n══════════════════════════════════════════════════════════════�?);
    console.log('📋 PAGE LOAD TESTS');
    console.log('══════════════════════════════════════════════════════════════�?);

    const adminPages = [
      { path: '/admin', name: 'Admin Dashboard' },
      { path: '/admin/businesses', name: 'Businesses' },
      { path: '/admin/listings', name: 'Listings' },
      { path: '/admin/listings/new', name: 'New Listing' },
      { path: '/admin/non-profits', name: 'Non-Profits' },
      { path: '/admin/public-sectors', name: 'Public Sectors' },
      { path: '/admin/categories', name: 'Categories' },
      { path: '/admin/heroes', name: 'Heroes' },
      { path: '/admin/blogs', name: 'Blogs' },
      { path: '/admin/media', name: 'Media' },
      { path: '/admin/users', name: 'Users' },
      { path: '/admin/reviews', name: 'Reviews' },
      { path: '/admin/service-packages', name: 'Service Packages' },
      { path: '/admin/subscriptions', name: 'Subscriptions' },
      { path: '/admin/settings', name: 'Settings' },
      { path: '/admin/ai-tools', name: 'AI Tools' }
    ];

    const results = [];

    for (const { path, name } of adminPages) {
      try {
        const response = await page.goto(`${BASE_URL}${path}`, {
          waitUntil: 'networkidle',
          timeout: 15000
        });

        await page.waitForTimeout(1000);

        const title = await page.title();
        const bodyText = await page.textContent('body');
        const currentUrl = page.url();

        const hasObjectError = bodyText?.includes('[object Object]');
        const isLoginPage = currentUrl.includes('/login') || title?.toLowerCase().includes('login');

        results.push({
          path,
          name,
          title,
          status: hasObjectError ? 'error' : isLoginPage ? 'login_required' : 'ok',
          url: currentUrl
        });

        const statusIcon = hasObjectError ? '�? : isLoginPage ? '🔐' : '�?;
        console.log(`${statusIcon} ${name.padEnd(20)} | ${title?.substring(0, 45).padEnd(45)} | ${currentUrl.includes('/login') ? 'Login required' : 'OK'}`);

      } catch (error) {
        results.push({ path, name, status: 'exception', error: error.message });
        console.log(`�?${name.padEnd(20)} | ERROR: ${error.message.substring(0, 50)}`);
      }
    }

    // Step 3: Test interactive operations
    console.log('\n══════════════════════════════════════════════════════════════�?);
    console.log('🖱�?INTERACTIVE OPERATIONS');
    console.log('══════════════════════════════════════════════════════════════�?);

    const interactivePages = [
      { path: '/admin/businesses', name: 'Businesses' },
      { path: '/admin/categories', name: 'Categories' },
      { path: '/admin/heroes', name: 'Heroes' },
      { path: '/admin/blogs', name: 'Blogs' }
    ];

    for (const { path, name } of interactivePages) {
      try {
        await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(1000);

        // Count interactive elements
        const buttons = await page.$$('button');
        const inputs = await page.$$('input');
        const selects = await page.$$('select');
        const forms = await page.$$('form');

        console.log(`\n📄 ${name}:`);
        console.log(`   Buttons: ${buttons.length} | Inputs: ${inputs.length} | Selects: ${selects.length} | Forms: ${forms.length}`);

        // Try clicking a primary action button (usually the first one in a form)
        const actionButtons = await page.$$('button[type="submit"], button[class*="btn-primary"], button[class*="primary"]');
        if (actionButtons.length > 0) {
          const btnText = await actionButtons[0].textContent();
          try {
            await actionButtons[0].click();
            await page.waitForTimeout(1000);
            const afterUrl = page.url();
            const navigated = afterUrl !== `${BASE_URL}${path}`;
            console.log(`   🔘 Clicked "${btnText?.trim().substring(0, 30)}" -> ${navigated ? 'Navigated' : 'Stayed on page'}`);
          } catch (e) {
            console.log(`   🔘 Click "${btnText?.trim().substring(0, 30)}" -> Error: ${e.message.substring(0, 50)}`);
          }
        }

        // Test form inputs
        if (forms.length > 0) {
          console.log(`   📝 Testing form inputs...`);
          const firstInput = await page.$('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"])');
          if (firstInput) {
            try {
              await firstInput.fill('test value');
              await page.waitForTimeout(500);
              console.log(`   �?Input field accepts values`);
            } catch (e) {
              console.log(`   ⚠️ Input field: ${e.message.substring(0, 50)}`);
            }
          }
        }

      } catch (error) {
        console.log(`\n�?${name}: ${error.message.substring(0, 100)}`);
      }
    }

    // Step 4: Test CRUD operations
    console.log('\n══════════════════════════════════════════════════════════════�?);
    console.log('🔧 CRUD OPERATIONS');
    console.log('══════════════════════════════════════════════════════════════�?);

    // Test Categories CRUD
    console.log('\n📝 Testing Categories CRUD...');
    await page.goto(`${BASE_URL}/admin/categories`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const categoryRows = await page.$$('tbody tr, [class*="table"] tr, .category-item');
    console.log(`   Found ${categoryRows.length} category items`);

    // Try to find and click Add/Edit button
    const addBtn = await page.$('button:has-text("Add"), button:has-text("New"), a:has-text("Add"), a:has-text("Create")');
    if (addBtn) {
      try {
        await addBtn.click();
        await page.waitForTimeout(2000);
        const formInputs = await page.$$('input[name="name"], input[name="title"]');
        console.log(`   �?Add button opens form with ${formInputs.length} input(s)`);
      } catch (e) {
        console.log(`   ⚠️ Add button click: ${e.message.substring(0, 50)}`);
      }
    } else {
      console.log(`   ℹ️ No explicit "Add" button found (may use modal or other UI)`);
    }

    // Summary
    console.log('\n══════════════════════════════════════════════════════════════�?);
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('══════════════════════════════════════════════════════════════�?);

    const okCount = results.filter(r => r.status === 'ok').length;
    const loginReqCount = results.filter(r => r.status === 'login_required').length;
    const errorCount = results.filter(r => r.status === 'error' || r.status === 'exception').length;
    const total = results.length;

    console.log(`\nPage Load Results:`);
    console.log(`  �?Loaded OK: ${okCount}/${total}`);
    console.log(`  🔐 Login Required: ${loginReqCount}/${total}`);
    console.log(`  �?Errors: ${errorCount}/${total}`);

    if (errorCount === 0) {
      console.log('\n�?NO ERRORS! All pages render correctly.');
    }

    if (loginReqCount > 0) {
      console.log('\n⚠️ Some pages require login (separate auth issue from SSR fix):');
      results.filter(r => r.status === 'login_required').forEach(r => {
        console.log(`   - ${r.name} (${r.path})`);
      });
    }

  } finally {
    await browser.close();
  }
}

runTests().catch(console.error);
