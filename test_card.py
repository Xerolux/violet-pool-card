from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Page Error: {err}"))
        page.goto("http://localhost:8000/demo/index.html")
        page.wait_for_selector("violet-pool-card", timeout=5000)
        browser.close()

if __name__ == "__main__":
    run()
