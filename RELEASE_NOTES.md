## v0.3.0 – Violet Pool Card

✅ **STABLE RELEASE**

### ✨ New Features | Neue Funktionen

- **New `lagoon` dark theme** — deep navy gradient with violet accent (WCAG-AA contrast)
- **New editor preset "Dark Lagoon"** for one-click dark setup

### 🚀 Improvements | Verbesserungen

- Accessibility: `:focus-visible` rings on all interactive elements
- Accessibility: `prefers-reduced-motion` support (WCAG 2.1 AA)
- Editor theme picker and demo page updated for lagoon
- Bilingual labels added (`theme_lagoon`)

### 🧩 Compatibility

- All 13 existing themes remain visually byte-identical
- Purely additive; no config migrations required

---

### 📦 Installation

**HACS (Recommended):**
1. Open HACS in Home Assistant
2. Go to "Frontend"
3. Find "Violet Pool Card" → Update
4. Refresh the Home Assistant frontend

**Manual:**
1. Download `violet-pool-card.js` from the assets below
2. Copy to `config/www/violet-pool-card.js`
3. Add resource in Configuration → Lovelace Dashboards → Resources
   - URL: `/local/violet-pool-card.js`
   - Type: `JavaScript Module`
4. Refresh the Home Assistant frontend

To use the new theme, set `theme: lagoon` in your card config or pick it in the visual editor.

---

📋 [Full changelog: v0.2.2...v0.3.0](https://github.com/Xerolux/violet-pool-card/compare/v0.2.2...v0.3.0)

---

### ❤️ Support | Unterstützung

If you find this card useful, consider supporting the developer:

- ☕ **[Buy Me a Coffee](https://buymeacoffee.com/xerolux)**
- 🚗 **[Tesla Referral Code](https://ts.la/sebastian564489)**
- ⭐ **Star this repository**

Every contribution, no matter how small, is a huge motivation! Thank you! 🙏

Jeder Beitrag, egal wie klein, ist eine große Motivation! Vielen Dank! 🙏

---

### 💬 Feedback & Contributions

- 🐛 **[Report a bug](https://github.com/Xerolux/violet-pool-card/issues/new?template=bug_report.md)**
- 💡 **[Request a feature](https://github.com/Xerolux/violet-pool-card/issues/new?template=feature_request.md)**

---

_Generated on 2026-07-18_
