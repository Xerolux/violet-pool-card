## v0.4.2 – Violet Pool Card

✅ **STABLE RELEASE**

The first entry written under the language policy - and the release where the
card finally speaks English to English users.

### 🐛 Bug Fixes

- **The card was German even on an English installation.** 98 user-facing
  strings were hardcoded in German in the render path - tooltips, status texts,
  recommendations, button labels, the colour picker, the threshold editor.
  Nothing translated them, so `i18n` never got a say. Every one of them now
  goes through the translation table.
- **Five card types the card does not have were still documented.**
  `statistics`, `weather`, `maintenance`, `alerts` and `comparison` were listed
  in README.md and, worse, used in `dashboard_config.yaml` and `dashboard.yaml`
  - the dashboards people copy into their own setup. Eleven cards across those
  two files rendered as "Unknown Card Type". They are gone, and the README card
  list is now built from the editor's own option table, so it lists the 29
  types that exist; six real ones had been missing from it (`overflow`,
  `error`, `digital_rules`, `calibration`, `update`, `diagnostics`).

### 🚀 Improvements

- **`i18n.t()` takes placeholders.** 34 of those strings carry a value, and a
  sentence split around its value only survives while every language keeps the
  same word order. `i18n.t('backwash_desc', { duration })` keeps it one string
  per language. An unfilled placeholder stays visible instead of rendering
  "undefined" - a missing value should look wrong, not plausible.
- English is binding for everything written into this repository; the rule and
  its one exception - the German table in `i18n.ts`, which *is* the
  localisation - are in the new `CLAUDE.md`.
- `CHANGELOG.md` is a source file now: the release workflow lifts this section
  onto the release page instead of generating text from commit subjects.

### 🧪 Tests

- 127 → 181. The new ones guard what silently rots: no German outside
  `i18n.ts`, both language tables holding the same keys, no empty translation,
  and the same placeholders on both sides - one present in only one language
  would drop the value for those users. The card-type check now walks every
  markdown and YAML file in the repository and matches both the `card_type:`
  key and the prose form, which is how the five phantom types slipped past it
  the first time.

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
