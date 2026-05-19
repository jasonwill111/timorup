import { chromium } from 'playwright';

const BASE_URL = 'https://TimorUp.jasonwill.workers.dev';
const ADMIN_EMAIL = 'admin@TimorUp.com';
const ADMIN_PASSWORD = 'admin12345';

async function runTests() {
  console.log('🔍 Debugging Login Flow\n');

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Enable console log capture from browser
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('  [Browser Error]:', msg.text());
      }
    });

    page.on('request', request => {
      if (request.url().includes('signIn') || request.url().includes('login') || request.method() === 'POST') {
        console.log('  [Request]:', request.method(), request.url().substring(0, 100));
      }
    });

    page.on('response', response => {
      if (response.url().includes('signIn') || response.url().includes('login') || response.request().method() === 'POST') {
        console.log('  [Response]:', response.status(), response.url().substring(0, 100));
      }
    });

    // 1. Go to login page
    console.log('1️⃣ Loading login page...');
    const response = await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    console.log('   HTTP Status:', response?.status());
    await page.waitForTimeout(2000);

    // 2. Check form elements
    const formHtml = await page.evaluate(() => {
      const form = document.querySelector('form');
      return form ? form.outerHTML.substring(0, 500) : 'No form found';
    });
    console.log('\n2️⃣ Form HTML:', formHtml.substring(0, 300));

    // 3. Fill form
    console.log('\n3️⃣ Filling form...');
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.waitForTimeout(500);

    // 4. Check filled values
    const filledValues = await page.evaluate(() => {
      const email = document.querySelector('input[name="email"]');
      const password = document.querySelector('input[name="password"]');
      return {
        email: email?.value,
        password: password?.value ? '***' : null
      };
    });
    console.log('   Filled values:', filledValues);

    // 5. Get form before submit
    const formBefore = await page.evaluate(() => {
      const form = document.querySelector('form');
      return {
        action: form?.action,
        method: form?.method,
        hasSubmitBtn: !!document.querySelector('#submit-btn')
      };
    });
    console.log('\n4️⃣ Form config:', formBefore);

    // 6. Submit and wait
    console.log('\n5️⃣ Submitting form...');
    await page.click('#submit-btn');

    // 7. Wait and observe
    console.log('   Waiting 5 seconds for response...');
    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle');

    // 8. Check result
    const url = page.url();
    const title = await page.title();
    const bodyText = await page.textContent('body');

    console.log('\n6️⃣ Result:');
    console.log('   URL:', url);
    console.log('   Title:', title);

    // 9. Check for error messages
    const errorMsg = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('[class*="error"], [class*="alert"], [class*="message"]');
      return Array.from(errorElements).map(el => el.textContent?.trim()).filter(Boolean);
    });
    console.log('   Error messages:', errorMsg);

    // 10. Check cookies
    const cookies = await context.cookies();
    console.log('\n7️⃣ Cookies after submit:', cookies.length);
    cookies.forEach(c => {
      console.log('   -', c.name, ':', c.value.substring(0, 30), '...');
    });

    // 11. Try direct navigation to admin
    console.log('\n8️⃣ Trying direct admin navigation...');
    const adminPage = await context.newPage();
    await adminPage.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle' });
    const adminUrl = adminPage.url();
    const adminTitle = await adminPage.title();
    console.log('   Admin URL:', adminUrl);
    console.log('   Admin Title:', adminTitle);

    // Summary
    console.log('\n══════════════════════════════════════════════════════════════�?);
    console.log('📊 LOGIN DEBUG SUMMARY');
    console.log('══════════════════════════════════════════════════════════════�?);
    console.log('Final URL:', url);
    console.log('Login successful:', !url.includes('/login'));
    console.log('Cookies set:', cookies.length);

    if (url.includes('/login') && cookies.length === 0) {
      console.log('\n�?LOGIN FAILED - Possible causes:');
      console.log('   1. User admin@TimorUp.com does not exist in database');
      console.log('   2. Password incorrect');
      console.log('   3. Auth API returning error (check console logs)');
      console.log('   4. Rate limiting blocking requests');
      console.log('   5. Database connection issue');
    }

  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    await browser.close();
  }
}

runTests().catch(console.error);
