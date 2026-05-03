import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
await page.setViewportSize({ width: 1280, height: 720 });

// Register
await page.goto('http://localhost:4320/register');
await page.fill('#name', 'Test User');
await page.fill('#email', `test${Date.now()}@example.com`);
await page.fill('#password', 'Password123!');
await page.fill('#confirmPassword', 'Password123!');
await page.evaluate(() => {
  document.getElementById('register-form')?.dispatchEvent(new Event('submit', { bubbles: true }));
});
await page.waitForTimeout(5000);

// Get session token
const cookies = await context.cookies();
const token = cookies.find(c => c.name === 'better-auth.session_token')?.value;
console.log('Token:', token?.slice(0, 20) + '...');

// Call API directly to test session
const resp = await page.request.get('http://localhost:4325/api/auth/session', {
  headers: { cookie: `better-auth.session_token=${token}` }
});
console.log('Session API status:', resp.status());
const data = await resp.json();
console.log('Session data:', JSON.stringify(data).slice(0, 200));

await browser.close();
