## v0.6.0 – Violet Pool Card

✅ **STABLE RELEASE**

### 🌊 Pool Flow Diagram

- **A new `pool_flow` card visualises the complete circulation path.** Pool,
  pump, filter, heater, solar heating and dosing are connected by an animated
  directional flow, while temperature, flow rate, filter pressure, water
  level, pH, ORP, chlorine, backwash and refill are shown as live facts.
- **Three scopes fit different installations:** `circulation` keeps the view
  to pool, pump and filter; `treatment` adds dosing; and `complete` includes
  heating and solar. Every optional node and fact group can be switched on or
  off independently.
- **The visual editor configures the entire diagram.** Automatic entity
  resolution remains the default, with individual overrides for installations
  that use custom entities.
- **The SVG is responsive and accessible.** Flow nodes open Home Assistant's
  more-info dialog with mouse or keyboard, motion follows reduced-motion
  preferences, themes keep sufficient contrast, and narrow dashboards retain
  readable node sizes with horizontal scrolling.

### 🧭 Entity Reference and Dashboard Reliability

- **A privacy-safe live entity catalog is now kept in Git.** It records the
  266 entity IDs returned by the running Violet integration without states,
  registry identifiers, addresses or credentials. The existing generated
  catalog covers all 583 entity keys supported by the integration source.
- **Dashboard examples now match the entities the integration creates.** The
  extension module examples use their sensor entities, and the active pool
  dashboard no longer carries stale entity references.

### 🧪 Water Chemistry

- **ORP evaluation follows the configured controller target.** When a live ORP
  setpoint is available, the optimal band is centred on it instead of forcing
  every installation into the static default. A target of 850 mV therefore
  treats 800–900 mV as the normal operating band unless the card explicitly
  configures another range.

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
