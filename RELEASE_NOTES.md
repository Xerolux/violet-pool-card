## v0.4.6 – Violet Pool Card

✅ **STABLE RELEASE**

### 🐛 Bug Fixes

- **The dosing card showed the wrong channel.** Reported on the forum after
  0.4.5: the pump card finds its entities now, the dosing card does not. The
  card decided which channel it was showing by searching the entity id for
  `_cl`, `_phm`, `_php` and `_floc` - the integration's translation keys, which
  never appear in an entity id. Since 2.5.0 the ids come from the English names
  (`switch.…_chlorine_dosing`, `switch.…_dosing_ph_minus`), so three of the four
  channels fell through to the `chlorine` default: a pH card read the ORP
  sensor, showed it in mV, judged it against the ORP thresholds and pointed its
  controls at the ORP setpoint. The channel now comes from the registry's
  `translation_key`; matching the id remains only for entities the registry
  cannot explain, and covers the English and the old German spellings.
- **`card_type: dosing` could only ever show chlorine.** The card type resolved
  the chlorine switch and nothing else, so any other channel had to be reached
  by naming the entity by hand. `dosing_type: ph_minus | ph_plus | flocculant`
  now resolves that channel's switch itself.
- **A missing dosing entity showed an endless loading skeleton.** The card
  rendered the shimmer placeholder for ever instead of saying what it could not
  find - which is what "the card is completely broken" looks like when a dosing
  channel is not configured. It now reports the entity it looked for, like the
  backwash and refill cards already did.

### 🌍 Language

- The dosing card's remaining hard-coded German labels (`Typ`, `Soll`,
  `ORP – Chlorwirksamkeit`, `pH-Wert`, …) and the refill and PV cards' German
  error messages now go through the translation table, per the language policy.

### 🧪 Tests

- 225 → 243. `tests/dosing-type.test.ts` pins every channel against the entity
  ids the integration really creates, both current and legacy, and asserts that
  an unrecognised entity returns nothing rather than guessing a channel.

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
