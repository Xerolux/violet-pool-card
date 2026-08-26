## v0.6.1 – Violet Pool Card

✅ **STABLE RELEASE**

### 📱 Pool Flow Responsiveness

- **Narrow masonry columns now keep the flow diagram readable.** Responsive
  layout follows the card's own width instead of the browser viewport, keeps
  the nodes at a legible size with horizontal scrolling and arranges facts in
  two compact columns.
- **Pool flow headings now inherit the selected card theme.** Ocean and other
  dark themes use their intended high-contrast title and secondary text
  colours.

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
