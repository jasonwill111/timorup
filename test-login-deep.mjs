import { chromium } from 'playwright';

const BASE_URL = 'https://timorlist.jasonwill.workers.dev';
const ADMIN_EMAIL = 'admin@timorlist.com';
const ADMIN_PASSWORD = 'admin12345';

async function runTests() {
  console.log('🔍 Deep Login Debug - Checking API Response\n');

  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // 1. Capture all responses
    let apiResponse = null;

    page.on('response', async response => {
      if (response.url().includes('api/auth')) {
        console.log('📥 API Response intercepted:', response.url());
        console.log('   Status:', response.status());

        try {
          const body = await response.json();
          console.log('   Body:', JSON.stringify(body, null, 2).substring(0, 500));
          apiResponse = body;
        } catch (e) {
          const text = await response.text();
          console.log('   Text:', text.substring(0, 500));
        }
      }
    });

    // 2. Go to login
    console.log('1️⃣ Loading login page...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 3. Fill and submit
    console.log('\n2️⃣ Submitting login...');
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('#submit-btn');

    // 4. Wait for response
    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle');

    // 5. Check form message element
    console.log('\n3️⃣ Checking form message...');
    const formMessage = await page.evaluate(() => {
      const el = document.getElementById('form-message');
      return {
        exists: !!el,
        classList: el?.className,
        textContent: el?.textContent,
        innerHTML: el?.innerHTML?.substring(0, 200)
      };
    });
    console.log('   Form message:', formMessage);

    // 6. Check for any error displayed on page
    console.log('\n4️⃣ Checking page for error displays...');
    const errors = await page.evaluate(() => {
      const errorEls = document.querySelectorAll('[class*="error"], [class*="alert"], [class*="danger"], [role="alert"]');
      return Array.from(errorEls).map(el => ({
        tag: el.tagName,
        class: el.className.substring(0, 50),
        text: el.textContent?.trim().substring(0, 100)
      }));
    });
    console.log('   Error elements found:', errors.length);
    errors.forEach((e, i) => console.log(`   ${i+1}. <${e.tag}> ${e.class}: "${e.text}"`));

    // 7. Check network requests for any 4xx/5xx
    console.log('\n5️⃣ Checking all failed requests...');
    const failedRequests = await page.evaluate(() => {
      return window.performance?.getEntriesByType?.('resource')
        ?.filter(r => r.responseStatus >= 400)
        .map(r => ({ url: r.name, status: r.responseStatus })) || [];
    });
    console.log('   Failed requests:', failedRequests.length);
    failedRequests.forEach(r => console.log('   -', r.status, r.url.substring(0, 80)));

    // 8. Check localStorage/sessionStorage for any auth data
    console.log('\n6️⃣ Checking storage...');
    const storage = await page.evaluate(() => {
      return {
        localStorage: Object.keys(localStorage),
        sessionStorage: Object.keys(sessionStorage),
        cookies: document.cookie
      };
    });
    console.log('   LocalStorage keys:', storage.localStorage);
    console.log('   SessionStorage keys:', storage.sessionStorage);
    console.log('   Cookies:', storage.cookies || 'none');

    // 9. Try to check if there's an issue with the action
    console.log('\n7️⃣ Testing API directly...');
    const directApi = await fetch(`${BASE_URL}/api/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });
    console.log('   Direct API call status:', directApi.status);
    const apiText = await directApi.text();
    console.log('   Direct API response:', apiText.substring(0, 300));

    // Summary
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📊 ANALYSIS');
    console.log('═══════════════════════════════════════════════════════════════');

    if (apiResponse?.success === false) {
      console.log('❌ API returned error');
      console.log('   Code:', apiResponse?.error?.code);
      console.log('   Message:', apiResponse?.error?.message);
    } else if (apiResponse?.success === true) {
      console.log('✅ API returned success');
      console.log('   User:', apiResponse?.user?.email);
    }

    console.log('\nLogin result URL:', page.url());

  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    await browser.close();
  }
}

runTests().catch(console.error);