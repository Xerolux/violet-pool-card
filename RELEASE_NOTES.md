## v0.5.2 – Violet Pool Card

✅ **STABLE RELEASE**

> **This is 0.5.1, released from the commit that contains it.** The v0.5.1
> tag was pushed before these fixes were merged, so it points at a commit
> that does not have them - the file published under it was built from a
> later checkout and is correct, but the tag does not lead there. 0.5.2 is
> the same card with tag, source and asset in agreement. Coming from 0.5.1
> there is nothing new to install; coming from 0.5.0 the entries below are.

### 🐛 Bug Fixes

- **The dosing, backwash and refill cards looked for a switch that is disabled
  by default.** Reported on the forum for 0.5.0: the dosing card said it wanted
  `switch.violet_pool_controller_chlor_dosierung`, and no
  `switch.…_chlorine_dosing` existed either. Both observations were right, for
  two separate reasons.

  The integration creates `DOS_1_CL`, `DOS_4_PHM`, `DOS_5_PHP`, `DOS_6_FLOC`,
  `BACKWASH` and `REFILL` with `entity_registry_enabled_default: False`. Unless
  someone enables them by hand they carry no state, and Home Assistant does not
  hand a disabled entity to a card at all - so the registry lookup found
  nothing and the card fell back to a guessed id. Each of those switches has an
  **enabled sensor** under the same translation key, so the cards now fall back
  to it: the state is shown, the control buttons are hidden, and a note names
  the disabled switch and how to enable it.

- **`EntityHelper.findEntityId` invented an id when nothing matched.** Its last
  step built `domain.prefix_suffix` from the first suffix, so a lookup that
  found nothing still answered with a German id - the same failure one layer
  down. It reports nothing now, and the test that expected exactly that passes.

- **The guessed id was the old German spelling.** The German suffixes are index
  keys into the card's slot table, not entity ids, but on a failed lookup the
  card built one literally - sending people to look for an entity that has not
  existed since 2.5.0. Every slot now carries the id the integration produces
  today, and that is what a fallback names. A test derives all 25 of them from
  the integration's own English names, so a rename over there turns this
  repository red.

### ✨ Features

- **Live entity discovery covers more controllers.** The slot table gained
  aliases for installations whose entities carry other German spellings
  (`poolwasser`, `orp_wert`, `sonnenkollektor`, `pool_heizer`, `solar_heizer`,
  `pool_abdeckung`, `durchfluss` and the four canister readings), and the four
  canister cards resolve their sensor from the card type alone.
- **Calibration, error and update cards discover their own entities** through
  the entity helper, instead of being told which to use.

### 🧪 Tests

- 287 → 295, and the suite is green again: `main` carried three failures - two
  because the version was bumped to 0.5.1 without a changelog section, one
  because `findEntityId` constructed an id instead of reporting that nothing
  matched.

  The disabled-switch case is pinned in both directions (switch present, switch
  missing, switch registered but stateless), and every slot's fallback id is
  checked against the integration's English names, which the key-refresh script
  now records alongside the keys.

### 🔧 Maintenance

- `brace-expansion` 1.1.13 → 1.1.18, a development dependency pulled in
  through the toolchain. Nothing the card ships changes.

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


## What's Changed
* 0.5.1: fall back to the sensor when a switch is disabled by default by @Xerolux in https://github.com/Xerolux/violet-pool-card/pull/85
* build(deps-dev): bump brace-expansion from 1.1.13 to 1.1.18 in the npm_and_yarn group across 1 directory by @dependabot[bot] in https://github.com/Xerolux/violet-pool-card/pull/73


**Full Changelog**: https://github.com/Xerolux/violet-pool-card/compare/v0.5.1...v0.5.2
