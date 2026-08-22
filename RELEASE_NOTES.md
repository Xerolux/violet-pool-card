## v0.5.0 – Violet Pool Card

✅ **STABLE RELEASE**

### ✨ Features

- **The chemistry card can show the water balance.** Requested on the forum:
  "CSI bzw. LSI". What it computes is the **Langelier** index, in its classic
  continuous form, and the card says so - the Calcite Saturation Index used by
  some pool calculators additionally models ionic strength and activity
  coefficients, and labelling one as the other would be misleading about a
  number people dose their pool by. Enable it with `show_saturation_index: true`
  or the switch in the card editor.

  The controller measures pH and water temperature. Calcium hardness and
  alkalinity come from a test kit, so they are configured - each field takes
  either a number or the id of an entity holding one, so an `input_number`
  helper can carry the last test result:

  ```yaml
  type: custom:violet-pool-card
  card_type: chemical
  show_saturation_index: true
  calcium_hardness: 300            # ppm CaCO3, or input_number.pool_calcium
  total_alkalinity: input_number.pool_alkalinity
  cyanuric_acid: 40                # optional
  total_dissolved_solids: 1000     # optional, this is the default
  ```

  Cyanuric acid is optional and corrects the alkalinity when given: a
  stabilised pool's alkalinity reading includes cyanurate, which does not
  buffer like carbonate. An input that is missing is **named** rather than
  assumed - an index computed from a guessed hardness would look authoritative
  and be wrong.

- **The details card proposes a list when none is configured.** It used to
  refuse to render without `entities:`, which left no clue what belonged in it.
  It now falls back to the readings and outputs the installation actually has -
  water temperature, pH, ORP, chlorine, filter pressure, flow, pump, backwash,
  dosing, light, heater, solar, cover - resolved through the entity registry, so
  a pool without solar or without a cover simply lists fewer rows. An explicit
  `entities:` list still wins.

### 🌍 Language

- The chemistry card's remaining hard-coded German strings (`pH-Wert`,
  `Redoxwert`, `… Werte ausserhalb`, the thresholds hint) now go through the
  translation table, per the language policy.

### 🧪 Tests

- 243 → 276. `tests/saturation-index.test.ts` pins the formula against the
  textbook balanced pool worked through by hand (pH 7.5, 25 °C, 300 ppm
  hardness, 100 ppm alkalinity → LSI ≈ 0.00), checks which way each input moves
  the index, and asserts that missing inputs are reported rather than defaulted.
  The details-card default list is pinned against the registry.

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
