import { chromium } from 'playwright';

const BASE_URL = 'https://timorup.jasonwill.workers.dev';
const ADMIN_EMAIL = 'admin@timorup.com';
const ADMIN_PASSWORD = 'admin12345';

async function loginAsAdmin(browser) {
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🔐 Logging in as admin...');

  // Method 1: Try the login page with proper form submission
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Fill using evaluate to ensure we find the right elements
  const formFilled = await page.evaluate(() => {
    const emailInput = document.querySelector('input[name="email"], input[type="email"], input[id*="email"]');
    const passwordInput = document.querySelector('input[name="password"], input[type="password"]');
    const submitBtn = document.querySelector('#submit-btn, button[type="submit"]');

    if (!emailInput || !passwordInput) {
      console.log('Form inputs not found');
      return false;
    }

    (emailInput).value = 'admin@timorup.com';
    (passwordInput).value = 'admin12345';

    // Trigger input events for Astro
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

    if (submitBtn) {
      submitBtn.click();
      return true;
    }
    return false;
  });

  if (!formFilled) {
    console.log('❌ Could not fill login form');
    return null;
  }

  await page.waitForTimeout(4000);
  await page.waitForLoadState('networkidle');

  const url = page.url();
  console.log('After login URL:', url);

  // Check for error messages on page
  const bodyText = await page.textContent('body');
  const hasLoginError = bodyText?.includes('Invalid') || bodyText?.includes('error') || bodyText?.includes('Error');
  console.log('Page has error text:', hasLoginError ? '⚠️' : '✓');

  return { page, context, url };
}

async function testPage(page, path, description) {
  console.log(`\n📄 ${description} (${path})`);

  try {
    await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);

    const title = await page.title();
    const bodyText = await page.textContent('body');
    const url = page.url();

    const hasObjectError = bodyText?.includes('[object Object]');
    const isLoginPage = url.includes('/login') && (title?.includes('Login') || bodyText?.includes('email'));

    console.log(`  Status: ${url.includes('/login') ? '🔐 Login' : '✓'} | Title: ${title?.substring(0, 40)}`);
    console.log(`  [object Object]: ${hasObjectError ? '❌' : '✓ none'}`);

    if (hasObjectError) {
      return { status: 'error', type: 'object_error', path, title };
    }

    if (isLoginPage) {
      return { status: 'login_required', type: 'redirected_to_login', path, title };
    }

    return { status: 'ok', type: 'loaded', path, title };
  } catch (e) {
    return { status: 'error', type: 'exception', path, error: e.message };
  }
}

async function testInteractive(page, path, description) {
  console.log(`\n🖱️ ${description}`);

  try {
    await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);

    const buttons = await page.$$('button');
    const inputs = await page.$$('input');
    const forms = await page.$$('form');

    // Try clicking a button if available
    let clickResult = null;
    if (buttons.length > 0) {
      const firstBtn = buttons[0];
      const btnText = await firstBtn.textContent();
      try {
        await firstBtn.click();
        await page.waitForTimeout(1000);
        const afterUrl = page.url();
        clickResult = { text: btnText?.trim(), navigated: afterUrl !== `${BASE_URL}${path}` };
      } catch (e) {
        clickResult = { text: btnText?.trim(), error: e.message };
      }
    }

    return {
      status: 'ok',
      buttons: buttons.length,
      inputs: inputs.length,
      forms: forms.length,
      clickTest: clickResult
    };
  } catch (e) {
    return { status: 'error', error: e.message };
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🚀 ADMIN E2E TESTS - All Pages and Features');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`Base: ${BASE_URL}\n`);

  const browser = await chromium.launch({ headless: true });

  try {
    const loginResult = await loginAsAdmin(browser);

    if (!loginResult?.page) {
      console.log('\n❌ LOGIN FAILED - Cannot test protected pages');
      console.log('This may be expected if admin credentials are not set up.');
      return;
    }

    const { page, url: loginUrl } = loginResult;

    // Test all admin pages
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📋 PAGE LOAD TESTS');
    console.log('═══════════════════════════════════════════════════════════════');

    const pages = [
      ['/admin', 'Dashboard'],
      ['/admin/businesses', 'Businesses'],
      ['/admin/listings', 'Listings'],
      ['/admin/listings/new', 'New Listing'],
      ['/admin/listings/abc/edit', 'Edit Listing'],
      ['/admin/non-profits', 'Non-Profits'],
      ['/admin/public-sectors', 'Public Sectors'],
      ['/admin/categories', 'Categories'],
      ['/admin/heroes', 'Heroes'],
      ['/admin/blogs', 'Blogs'],
      ['/admin/blogs/new', 'New Blog'],
      ['/admin/media', 'Media'],
      ['/admin/users', 'Users'],
      ['/admin/reviews', 'Reviews'],
      ['/admin/service-packages', 'Service Packages'],
      ['/admin/subscriptions', 'Subscriptions'],
      ['/admin/settings', 'Settings'],
      ['/admin/ai-tools', 'AI Tools'],
    ];

    let results = [];
    for (const [path, desc] of pages) {
      const result = await testPage(page, path, desc);
      results.push({ path, desc, ...result });
    }

    // Test interactive features on key pages
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🖱️ INTERACTIVE TESTS');
    console.log('═══════════════════════════════════════════════════════════════');

    const interactivePages = [
      ['/admin/businesses', 'Businesses'],
      ['/admin/categories', 'Categories'],
      ['/admin/heroes', 'Heroes'],
      ['/admin/blogs', 'Blogs'],
    ];

    for (const [path, desc] of interactivePages) {
      const result = await testInteractive(page, path, desc);
      console.log(`  ${desc}: ${result.buttons} buttons, ${result.inputs} inputs, ${result.forms} forms`);
      if (result.clickTest) {
        console.log(`    Click test: "${result.clickTest.text}" -> ${result.clickTest.navigated ? 'navigated' : 'stayed'}`);
      }
    }

    // Summary
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📊 RESULTS SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════');

    const ok = results.filter(r => r.status === 'ok').length;
    const loginRequired = results.filter(r => r.status === 'login_required').length;
    const errors = results.filter(r => r.status === 'error').length;

    console.log(`✓ Loaded: ${ok}/${results.length}`);
    console.log(`🔐 Login required: ${loginRequired}`);
    console.log(`❌ Errors: ${errors}`);

    if (loginRequired > 0) {
      console.log('\n⚠️ Some pages redirected to login - auth may not be working properly');
      console.log('   This could mean:');
      console.log('   1. Session not persisting after login');
      console.log('   2. Auth cookies not being set correctly');
      console.log('   3. Better Auth session store issue');
    }

    if (errors === 0 && loginRequired === 0) {
      console.log('\n✅ ALL PAGES WORKING!');
    } else if (errors === 0 && loginRequired > 0) {
      console.log('\n⚠️ PAGES WORK BUT LOGIN FLOW NEEDS ATTENTION');
    }

  } finally {
    await browser.close();
  }
}

runTests().catch(console.error);