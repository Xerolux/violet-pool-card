from playwright.sync_api import sync_playwright, expect
import time
import os

def generate_screenshots():
    # Create screenshots directory
    os.makedirs("screenshots", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the demo page
        # Note: http server must be running on port 8000
        page.goto("http://localhost:8000/demo/index.html")

        # Wait for the cards to be rendered
        # We can wait for the 'violet-pool-card' elements to be visible
        page.wait_for_selector("violet-pool-card")

        # Give a little extra time for the components to fully initialize and render styles
        time.sleep(2)

        # Take a full page screenshot
        page.screenshot(path="screenshots/full_page.png", full_page=True)
        print("Captured full_page.png")

        # Take individual card screenshots
        cards = {
            "pump-card": "pump_card.png",
            "heater-card": "heater_card.png",
            "solar-card": "solar_card.png",
            "dosing-card": "dosing_card.png",
            "overview-card": "overview_card.png",
            "compact-card": "compact_card.png"
        }

        for card_id, filename in cards.items():
            try:
                locator = page.locator(f"#{card_id}")
                if locator.count() > 0:
                    # Capture the element screenshot
                    locator.screenshot(path=f"screenshots/{filename}")
                    print(f"Captured {filename}")
                else:
                    print(f"Card {card_id} not found")
            except Exception as e:
                print(f"Error capturing {card_id}: {e}")

        browser.close()

if __name__ == "__main__":
    generate_screenshots()
