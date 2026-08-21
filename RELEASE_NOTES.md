## v0.4.5 – Violet Pool Card

✅ **STABLE RELEASE**

### 🐛 Bug Fixes

- **The example dashboards named entities that no longer exist.** Every id in
  `dashboard.yaml`, `dashboard_config.yaml`, `VIOLET_CARD_EXAMPLES.yaml`,
  README.md and `info.md` used the old German spelling -
  `sensor.…_beckenwasser`, `switch.…_filterpumpe`, `climate.…_heizung`. The
  integration derives its ids from the English names since 2.5.0, so anyone
  copying a dashboard into a current installation got cards pointing at
  nothing. 322 ids rewritten, resolved from the integration's own English
  translations rather than guessed.
- Two of them could not be resolved mechanically: the German names for pH plus
  and pH minus differ only by a character that slugifies away, so both
  collapsed to `dosierung_ph` and Home Assistant appended `_2` to whichever
  came second. That is where the old `dosierung_ph_2` came from. The examples
  label them, so they are now `dosing_ph_plus` and `dosing_ph_minus`.

### 🧪 Tests

- 208 → 224. Every markdown and YAML file is checked for German entity ids, so
  an example cannot drift back to a spelling the integration stopped using.

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
