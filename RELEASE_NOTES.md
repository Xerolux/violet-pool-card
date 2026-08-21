## v0.4.4 – Violet Pool Card

✅ **STABLE RELEASE**

Reported on the forum after 0.4.3: only the overview card worked, the pump card
showed the pump as off while it was running, and the dosing card was broken.
Two separate causes.

### 🐛 Bug Fixes

- **The dosing card crashed, and every control on the equipment cards was
  dead.** 0.4.3 made the entity optional and resolved it for *display*, but
  roughly twenty other places still read the unresolved `config.entity`,
  including every service call. With no entity configured - now the normal
  case - `_detectDosingType(undefined)` threw, and the pump, heater and solar
  buttons called their services with `undefined`. Each card resolves its
  entity id once now and uses that everywhere.
- **A running pump was drawn as "OFF".** The card read raw controller keys off
  the entity (`PUMPSTATE`, `PUMP_RPM_0..3`, `DOS_*_STATE`), but the
  integration does not pass those through - it publishes its own attributes:
  `pump_speed_level`, `mode`, `dosing_status`, `daily_amount_ml`. Every one of
  those reads came back undefined, so the speed fell back to 0. The card reads
  the integration's attributes now and keeps the raw keys as a fallback.
- **The daily runtime always showed 0.** The controller delivers
  `"04h 33m 12s"` and the integration passes the string through; the card did
  `Number(...) / 3600`, which is `NaN`. That format, `HH:MM:SS` and plain
  seconds are all parsed now.
- The "entity not found" message named the configured entity, which is empty
  when the card resolved one itself. It names the id actually looked up.

### 🧪 Tests

- 190 → 208. `src/utils/integration-attributes.ts` is covered against fixtures
  taken from what the integration's switch platform really publishes, so the
  contract between the two repositories is pinned on this side: a running pump
  must not read as level 0, `"04h 33m 12s"` must be 16392 seconds, and a
  reported level of 0 stays distinct from "no level reported".

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
