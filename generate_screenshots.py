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
            # Premium Theme Gallery
            "luxury-pump-large": "theme_luxury_pump.png",
            "modern-heater-medium": "theme_modern_heater.png",
            "glass-solar-large": "theme_glass_solar.png",
            "neon-dosing-medium": "theme_neon_dosing.png",
            "premium-pump-fullscreen": "theme_premium_pump.png",

            # Card Types
            "pump-card": "pump_card.png",
            "heater-card": "heater_card.png",
            "solar-card": "solar_card.png",
            "dosing-card": "dosing_card.png",
            "overview-card": "overview_card.png",
            "compact-card": "compact_card.png",

            # Examples
            "system-fullscreen-premium": "example_system_fullscreen.png",
            "overview-luxury-large": "example_overview_large.png",
            "compact-modern-pump-small": "example_compact_pump.png",
            "compact-modern-heater-small": "example_compact_heater.png",
            "compact-modern-solar-small": "example_compact_solar.png"
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
