## v0.1.1 – Violet Pool Card

✅ **STABLE RELEASE**

### ✨ New Features | Neue Funktionen

- feat: complete phase 5-6 implementation with digital rules and diagnostics cards (3d47947)
- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- feat: implement comprehensive violet-hass API support with advanced controls (9682fc7)
- feat: add comprehensive reusable UI components for advanced pool control (2541154)
- feat: add comprehensive dashboard config using only violet-pool-card (b8c06e0)
- feat: improve card UIs with missing values and better controls (8406453)
- feat: generate info.md for cleaner HACS preview (6f8c6a6)
- docs: Update README and examples with new cards (84640d0)
- ci: add workflow_dispatch to auto-build.yml (e25738c)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- feat: Add 4 new themes and advanced customization options (db841b5)
- ci: add auto-build workflow to rebuild dist on src changes [skip ci] (745d669)
- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)

### 🚀 Improvements | Verbesserungen

- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- refactor: remove problematic cards with mock data and hard-coded content (9caaa73)
- 📝 Release v0.1.1 - Update changelog, version and info.md (83c3f2a)
- build: update auto-generated files [skip ci] (e8e1aea)
- feat: improve card UIs with missing values and better controls (8406453)
- refactor: improve i18n type safety and efficiency (99654b7)
- 📝 Release v0.1.3 - Update changelog and version (a5cc7e5)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- 📝 Release v0.1.2 - Update changelog and version (6672716)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- 📝 Release v0.1.1 - Update changelog and version (99cf3a9)
- 📝 Release v0.1.1 - Update changelog and version (8954bc5)
- Update README with comprehensive feature documentation (d66166f)
- Enhance Dosing card with animated SVG droplet visualization (75914fc)
- Optimize animations and extend TypeScript types (Final improvements) (207dc55)
- Refactor: Improve type safety, accessibility, and UX (Fixes 1-9) (ab76637)
- 📝 Release v0.1.1 - Update changelog and version (40fde92)
- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-statistics-display (a3c4936)
- fix: remove unused 'value' variable from color conversion function (83b9edf)
- fix: reduce statistics display font sizes to prevent text overlap (6484e41)
- fix-german-translations (977029c)
- Fix remaining English translations in Pool Cards (350e3e0)
- Merge pull request #42 from Xerolux/fix-package-json-repo-url-15677146840970789807 (cb7664e)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- fix: Resolve all 3 high-severity security vulnerabilities (1c45410)
- fix-build-warnings (216e4e5)
- Fix TypeScript build warnings (fba7a16)
- fix-pool-dashboard-cards (4b6dfe8)
- fix: resolve TypeScript errors and rebuild dist to fix card registration (aa302e1)
- fix-unused-color-variable (c8a633a)
- fix: remove unused variables and imports (e580139)
- fix-violet-pool-card-mQNV5 (c938d53)
- Fix: Preserve customElements.define in compiled output (17540a5)
- fix-component-registration-conflict (d58dbe5)
- fix: prefix sub-components and explicit registration (1fcf7a9)
- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

### 📚 Documentation | Dokumentation

- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- Update README with comprehensive feature documentation (d66166f)

---

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

---

📋 [Full changelog: v0.1.3...v0.1.1](https://github.com/Xerolux/violet-pool-card/compare/v0.1.3...v0.1.1)

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

_Generated automatically by GitHub Actions on 2026-03-04 08:53:39 UTC_
