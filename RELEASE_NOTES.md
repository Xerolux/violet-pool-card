## v0.4.3 – Violet Pool Card

✅ **STABLE RELEASE**

### 🐛 Bug Fixes

- **The pump card did not find its entities.** Reported on the forum right
  after 0.4.2: the card type selection worked and the overview card showed
  data, but the pump card came up empty. The registry lookup added in 0.4.1
  never reached it. Two things blocked it, and both had to go:
  - `setConfig()` threw *"You need to define an entity"* for every card type
    except six, so `card_type: pump` on its own was rejected before anything
    could be resolved. It now demands an entity only from the card type that
    genuinely cannot guess one - the generic `sensor` card.
  - `renderPumpCard()` read `config.entity` directly, as did the heater, solar,
    dosing, compact, sensor and flow-rate cards. They now go through the same
    registry resolution as the rest, so a renamed pump is found too.

  The README already promised that `card_type: pump` alone works. It does now.
- Seven card types that resolve their entities while rendering - `filter`,
  `backwash`, `refill`, `solar_surplus`, `inlet`, `counter_current` and the
  canisters - were rejected by the same `setConfig()` check before their
  renderer ever ran.
- **The visual editor asked for an entity on almost every card type.** It kept
  its own copy of "which card types need an entity" and its own domain filter,
  and both had drifted from the card - which is what made the automatic
  resolution look as if it only worked on the overview card. Both now come
  from the same table the card reads. Where a card type can resolve its own
  entity the picker is optional and says so; leaving it empty is the normal
  case.

### 🧪 Tests

- 181 → 190. `CARD_TYPE_MAIN_ENTITY` must cover the card types whose renderer
  reads the entity directly, every default must name a suffix the registry can
  actually resolve (the two deliberate exceptions are asserted by name), and
  the pump card must resolve both the standard id and a renamed one.
- Four tests guard the drift itself: the editor must read the shared tables,
  must not reintroduce a `needsEntity` list or a second domain filter, and the
  domain its picker offers must be the one the card resolves. Both bugs here
  had the same shape - two copies of one decision - so the copies are what the
  tests forbid.
- The language guard now also flags umlauts in comments and ignores quoted
  text. The word list alone had missed `diesem Präfix beginnen`, which is
  exactly the kind of line it exists to catch; quoting a German string in order
  to explain its removal is legitimate and no longer fails.

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
