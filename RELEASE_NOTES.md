## v0.5.3 – Violet Pool Card

✅ **STABLE RELEASE**

### 🐛 Bug Fixes

- **`dosing_type` only ever named one working channel.** Reported on the forum
  for 0.5.2: setting it produced nothing but an error. Two of the four channels
  had no entry in the card's slot table, so for `ph_plus` and `flocculant` the
  entity registry was never asked at all - the card guessed a German id
  (`switch.…_dosierung_ph_plus`), found nothing, and rendered "entity not
  found" whatever the installation had. All four channels resolve through the
  registry now, and a test derives them from the integration's own channel
  list, so a fifth channel cannot be added on one side only.

- **The dosing card showed `0` where the state belongs.** The dosing switches
  are disabled by default, so since 0.5.2 the card shows the channel's sensor
  instead - and that sensor passes the controller's numeric state code through
  unchanged. Comparing it with `on` made every stand-in card report its output
  as off. The codes are now read as the integration reads them (0 standby,
  1 active, 2 blocked, 3 priority on, 4 manual on, 5 emergency off, 6 manual
  off), in the backwash card as well.

- **`24 h` said `n/a`, and the card never saw itself dosing.** The volume dosed
  today and the channel status are attributes of the *switch*; the sensor
  standing in for it has none. Both are read from the channel's own sensors
  (`dos_*_daily`, `dos_*_state`) when the switch is not there. The "is it
  dosing" check looked for a state spelled `ACTIVE`, which the controller never
  sends - it sends `DOSING` and `MANUAL_DOSING`, and the integration publishes
  them as `Dosing` and `Manual Dosing`. So the running indicator, the blocked
  alert and the "dosing now" hint never once fired.

- **An unknown `dosing_type` is rejected with a message that names the four
  values.** The reporter's configuration was `dosing_type: ph_minus | ph_plus |
  flocculant`, which YAML reads as one string rather than a choice of three.
  That value used to be carried through the whole render: it matched no
  channel, translated to nothing, and left the card half drawn.

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
