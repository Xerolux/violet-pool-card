## v0.5.7 – Violet Pool Card

✅ **STABLE RELEASE**

### 🐛 Bug Fixes

- **The dosing card's buttons never reached the service.** Every call to
  `smart_dosing` was rejected by its schema before the handler ran, for three
  independent reasons: the card named no entity, while the schema requires
  `entity_id` or `device_id`; it sent the controller's German channel names
  (`Chlor`, `Flockmittel`) where the service takes `pH-`, `pH+`, `Chlorine`,
  `Flocculant` and translates them itself; and it left out `duration`, which is
  required on every action, not just a manual dose. So "Dose 30s", "Auto" and
  "STOP" raised an error and did nothing. Each channel now carries the name the
  service knows it by, the calls name their entity, and a duration is always
  sent, clamped to the 5-300 seconds the service accepts.

  `npm run keys:update` now copies the accepted values and that range out of
  the integration's `services.yaml` as well, so a change over there turns this
  repository red instead of silently breaking a button.

- **`manualDosing` looked for German entity ids.** It derived the channel from
  spellings no installation has had since integration 2.5.0; it asks
  `detectDosingType` now, which reads the registry.

- **The service rate limiter compared against a timestamp of `0`**, which would
  drop the first call of a session while the clock read under half a second.

### 🌍 Language

- **Every text the user reads is in the localisation table now.** About 90
  German strings still lived in the card, the editor and the severity model:
  `Modus`, `Leistung`, `Stoppen`, `Wartung ok`, the flow, canister, rule and
  diagnostics hints, the sensor tooltips, the editor's presets and threshold
  labels. On an English installation they stayed German - the card is on HACS
  and read by people who do not speak it.

- **The test that was supposed to prevent this can now see it.** It checked
  three files for umlauts, which `Modus` and `Leistung` do not have - and
  someone had already written `Hauefige ... koennen` and `Fuer Boost-Betrieb`
  with the umlauts spelled out, passing the check while being exactly what it
  exists to stop. It reads every source file now, knows the transliterations,
  and looks at template text as well as string literals. Comments in
  `i18n.ts` are held to the English rule too; its own header was German.

- **The editor's presets and its alert-level dropdown are built per render.**
  They were evaluated when the module was imported and when the element was
  constructed - both before `hass` says which language to use, which would
  have frozen them in German for everyone.
- **The language guard could not see `Ist`, `Ziel` or `Min. Freigabetemperatur:`.**
  It only looked at template text without a value in it, and matched its word
  list case-sensitively - so a label that is one capitalised noun, or a
  sentence with `${...}` in the middle, walked straight through. It now cuts
  the expressions out and checks the literal parts around them. That found 18
  more strings, the ones 0.5.4 added among them; they are in the table now.

- **The pump card's recommendation list is rendered again.** 0.5.4 computed it
  and dropped the line that showed it.

### 🚀 Enhancements & Bug Fixes

- **Direct Chlorine Sensor Display in Dosing Card:**
  - When a direct free chlorine sensor (`sensor.*_chlorine_value`, `sensor.*_chlorgehalt`, `sensor.*_pot_value` in mg/l or ppm) is present or configured, the Chlorine Dosing Card now shows free chlorine (e.g. `0.65 mg/l` or `0.23 mg/l`) instead of defaulting strictly to ORP (mV).
  - Automatically discovers chlorine setpoints (`number.*_chlor_sollwert` / `number.*_chlorine_setpoint`) and evaluates optimal ranges (0.3 – 1.5 mg/l).
  - Falls back seamlessly to ORP (mV) if only a redox probe is installed.
- **Visual Editor UX Overhaul:**
  - Reorganized the card editor so all functional options (`dosing_type`, entity overrides, chemistry settings) appear right at the top directly under Card Type and Entity selection.
  - Sizing, theming, layout, animations, and presets moved to subsequent sections so configuration is fast and intuitive.

- **0.5.5's two new editor labels are in the table too.** `Chlor-Sensor
  (override)` and `Chlor-Sensor (optional mg/l / ppm)` came in with the direct
  chlorine sensor; the second is one the guard cannot see yet, since a label
  that is a single German noun followed by an English parenthesis has no word
  the list knows.

- **0.5.6's six new German strings are in the table.** `Chlor-Sollwert
  (optional)`, `ORP / Redox Sollwert (optional)`, `Im Zielbereich`,
  `Abweichung vom Sollwert`, `Ist` and `Soll` came in with the ORP/free-chlorine
  split. The electrolysis channel carries the name `smart_dosing` knows it by
  (`Electrolysis`) like the other four.

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
