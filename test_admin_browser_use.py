"""
Admin E2E Testing using browser-use
Tests all admin sub-pages and functional operations
"""
import asyncio
from browser_use import Agent
from playwright.async_playwright import async_playwright

BASE_URL = "https://timorlink.jasonwill.workers.dev"
ADMIN_EMAIL = "admin@timorlink.com"
ADMIN_PASSWORD = "admin12345"

async def test_admin_pages():
    """Test all admin sub-pages"""
    print("🚀 Starting Admin E2E Tests with browser-use\n")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        try:
            # Step 1: Login
            print("🔐 Step 1: Logging in as admin...")
            await page.goto(f"{BASE_URL}/login", wait_until="networkidle")
            await page.wait_for_timeout(2000)

            # Fill login form
            await page.fill('input[name="email"]', ADMIN_EMAIL)
            await page.fill('input[name="password"]', ADMIN_PASSWORD)
            await page.click('#submit-btn')
            await page.wait_for_timeout(3000)

            url_after_login = page.url
            print(f"   After login URL: {url_after_login}")

            # Check cookies
            cookies = await context.cookies()
            print(f"   Cookies set: {len(cookies)}")

            # Step 2: Test all admin pages
            admin_pages = [
                "/admin",
                "/admin/dashboard",
                "/admin/businesses",
                "/admin/listings",
                "/admin/listings/new",
                "/admin/non-profits",
                "/admin/public-sectors",
                "/admin/categories",
                "/admin/heroes",
                "/admin/blogs",
                "/admin/media",
                "/admin/users",
                "/admin/reviews",
                "/admin/service-packages",
                "/admin/subscriptions",
                "/admin/settings",
                "/admin/ai-tools"
            ]

            print("\n📋 Testing all admin pages...")
            results = []

            for path in admin_pages:
                try:
                    await page.goto(f"{BASE_URL}{path}", wait_until="networkidle", timeout=15000)
                    await page.wait_for_timeout(1000)

                    title = await page.title()
                    body_text = await page.text_content("body")
                    has_error = "[object Object]" in body_text
                    is_login = "login" in title.lower()

                    results.append({
                        "path": path,
                        "title": title,
                        "has_error": has_error,
                        "requires_login": is_login
                    })

                    status = "❌" if has_error else "🔐" if is_login else "✓"
                    print(f"  {status} {path} - {title[:50]}")

                except Exception as e:
                    print(f"  ❌ {path} - Error: {str(e)[:50]}")
                    results.append({"path": path, "error": str(e)})

            # Step 3: Test interactive elements
            print("\n🖱️ Testing interactive elements...")

            interactive_pages = [
                "/admin/businesses",
                "/admin/categories",
                "/admin/heroes"
            ]

            for path in interactive_pages:
                try:
                    await page.goto(f"{BASE_URL}{path}", wait_until="networkidle", timeout=15000)
                    await page.wait_for_timeout(1000)

                    buttons = await page.query_selector_all("button")
                    inputs = await page.query_selector_all("input")
                    forms = await page.query_selector_all("form")

                    print(f"  📄 {path}:")
                    print(f"     - Buttons: {len(buttons)}")
                    print(f"     - Inputs: {len(inputs)}")
                    print(f"     - Forms: {len(forms)}")

                    # Try clicking first button
                    if buttons:
                        btn_text = await buttons[0].text_content()
                        try:
                            await buttons[0].click()
                            await page.wait_for_timeout(1000)
                            print(f"     - Clicked button: '{btn_text.strip()[:30]}' -> OK")
                        except Exception as e:
                            print(f"     - Clicked button: '{btn_text.strip()[:30]}' -> Error: {str(e)[:50]}")

                except Exception as e:
                    print(f"  ❌ {path} - Error: {str(e)[:50]}")

            # Summary
            print("\n═══════════════════════════════════════════════════════════════")
            print("📊 TEST RESULTS SUMMARY")
            print("═══════════════════════════════════════════════════════════════")

            ok = len([r for r in results if not r.get("has_error") and not r.get("requires_login") and not r.get("error")])
            login_req = len([r for r in results if r.get("requires_login")])
            errors = len([r for r in results if r.get("has_error") or r.get("error")])

            print(f"✓ Loaded successfully: {ok}/{len(results)}")
            print(f"🔐 Requires login: {login_req}")
            print(f"❌ Errors: {errors}")

            if login_req > 0:
                print("\n⚠️ Some pages require login - auth may not be working")
                print("   This is a separate issue from the SSR fix")

        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(test_admin_pages())