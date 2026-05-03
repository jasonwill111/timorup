import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Capture all network requests
page.on('response', async response => {
  const url = response.url();
  if (url.includes('api/auth')) {
    console.log(`API Response: ${response.status()} ${url}`);
    const text = await response.text();
    console.log('Response preview:', text.slice(0, 200));
  }
});

page.on('console', msg => {
  if (msg.type() === 'error') {
    console.log('Console Error:', msg.text());
  }
});

console.log('Testing login flow...');
await page.goto('http://localhost:4325/login');
await page.waitForTimeout(1000);

await page.fill('#email', 'test@example.com');
await page.fill('#password', 'Password123!');

await page.evaluate(() => {
  const form = document.getElementById('login-form');
  if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
});

await page.waitForTimeout(5000);
console.log('Final URL:', page.url());

await browser.close();
