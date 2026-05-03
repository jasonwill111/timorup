import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

console.log('Testing registration page...');
await page.goto('http://localhost:4325/register', { timeout: 10000 });
console.log('Page loaded:', page.url());

// Check form exists
const formCount = await page.locator('form').count();
console.log('Forms found:', formCount);

// Check if page has errors
const bodyText = await page.locator('body').textContent();
const hasError = bodyText.includes('503') || bodyText.includes('Error');
console.log('Has error:', hasError);

await browser.close();
console.log('Test complete');
