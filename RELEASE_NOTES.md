## v0.5.6 – Violet Pool Card

✅ **STABLE RELEASE**

### ✨ Features

- **ORP and free chlorine are separate dosing choices:**
  - `dosing_type: chlorine` now consistently shows the Redox/ORP reading and target in mV.
  - The new `dosing_type: free_chlorine` shows the direct free-chlorine reading and target in mg/l or ppm.
  - Both choices use the same physical chlorine dosing channel, while the visual editor exposes only the sensor and setpoint fields relevant to the selected measurement.
- **Electrolysis is a supported dosing channel:** The card discovers current and legacy electrolysis entities, shows chlorine or ORP data when available, and reports daily production in mg.
- **Previously documented card types now render:** `maintenance`, `alerts`, `statistics`, and `comparison` are available in YAML and the visual editor instead of producing “Unknown Card Type”.

### 🐛 Bug Fixes

- **Chlorine setpoint discovery uses the integration's real registry key,** so `number.*_chlor_sollwert` / `chlorine_setpoint` is found reliably.
- **Electrolysis controls are safe:** only `OFF` and `AUTO` are offered; chemical manual-dose services are never called for an electrolysis channel.
- **Backwash and refill stay read-only for non-switch entities,** preventing mode selects and status sensors from being rendered as unsafe start/stop controls.
- **The alert dashboard is scoped to Violet entities:** unrelated integration errors are ignored, clear “no error” states no longer become a fabricated critical `#9004`, and last-error history is kept out of the current view.
- **Calibration status no longer invents dates** and only uses calibration entities belonging to the Violet integration.
- **Direct chlorine recommendations use concentration-sized tolerances** instead of the ORP tolerance intended for millivolt targets.

### 🧪 Verification

- Tested against a live Home Assistant 2026.8.3 installation with real Violet entities without triggering dosing or switch actions.
- 360 automated tests pass; TypeScript, ESLint (0 errors), and the production build pass.

### 📦 Installation

**HACS (Recommended):**
1. Open HACS in Home Assistant
2. Go to "Frontend"
3. Click "+" and search for "Violet Pool Card"
4. Click "Download"
5. Restart Home Assistant

**Manual:**
1. Download `violet-pool-card.js` from the assets below
2. Copy to `config/www/violet-pool-card.js`
3. Add resource in Configuration → Lovelace Dashboards → Resources
   - URL: `/local/violet-pool-card.js`
   - Type: `JavaScript Module`
4. Restart Home Assistant

### ❤️ Support

This card is built in my spare time. If it helps you, support is very welcome:

- ☕ **[Buy Me a Coffee](https://buymeacoffee.com/xerolux)**
- 🚗 **[Tesla Referral Code](https://ts.la/sebastian564489)**
- ⭐ **Star this repository**
