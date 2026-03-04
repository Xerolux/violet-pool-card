# Changelog

All notable changes to this project will be documented in this file.
## [0.1.2] - 2026-03-04

## v0.1.2 – Violet Pool Card

🟡 **BETA RELEASE** - Testing phase, may contain bugs

---

### ✨ New Features | Neue Funktionen

- fix: add missing card_type definitions for digital_rules and diagnostics (da4e60b)
- Add comprehensive views to dashboard_config.yaml (cbbf79f)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
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

- build: update auto-generated files [skip ci] (bf3c070)
- 📝 Release v0.1.2 - Update changelog, version and info.md (5c80b0b)
- 📝 Release v0.1.2 - Update changelog, version and info.md (db3806e)
- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- build: update auto-generated files [skip ci] (0dc6c1c)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- 📝 Release v0.1.1 - Update changelog, version and info.md (b47a256)
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

- 🔧 Fix TypeScript compilation errors (cc30ac3)
- fix-lovelace-card-build (68a8037)
- fix: add missing card_type definitions for digital_rules and diagnostics (da4e60b)
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

- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
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

📋 [Full changelog: v0.1.3...v0.1.2](https://github.com/Xerolux/violet-pool-card/compare/v0.1.3...v0.1.2)

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

_Generated automatically by GitHub Actions on 2026-03-04 16:13:21 UTC_

---

## [0.1.2] - 2026-03-04

## v0.1.2 – Violet Pool Card

🟡 **BETA RELEASE** - Testing phase, may contain bugs

---

### ✨ New Features | Neue Funktionen

- fix: add missing card_type definitions for digital_rules and diagnostics (da4e60b)
- Add comprehensive views to dashboard_config.yaml (cbbf79f)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
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

- 📝 Release v0.1.2 - Update changelog, version and info.md (db3806e)
- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- build: update auto-generated files [skip ci] (0dc6c1c)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- 📝 Release v0.1.1 - Update changelog, version and info.md (b47a256)
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

- fix-lovelace-card-build (68a8037)
- fix: add missing card_type definitions for digital_rules and diagnostics (da4e60b)
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

- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
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

📋 [Full changelog: v0.1.3...v0.1.2](https://github.com/Xerolux/violet-pool-card/compare/v0.1.3...v0.1.2)

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

_Generated automatically by GitHub Actions on 2026-03-04 09:18:23 UTC_

---

## [0.1.2] - 2026-03-04

## v0.1.2 – Violet Pool Card

🟡 **BETA RELEASE** - Testing phase, may contain bugs

---

### ✨ New Features | Neue Funktionen

- Add comprehensive views to dashboard_config.yaml (cbbf79f)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
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

- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- build: update auto-generated files [skip ci] (0dc6c1c)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- 📝 Release v0.1.1 - Update changelog, version and info.md (b47a256)
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

- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
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

📋 [Full changelog: v0.1.3...v0.1.2](https://github.com/Xerolux/violet-pool-card/compare/v0.1.3...v0.1.2)

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

_Generated automatically by GitHub Actions on 2026-03-04 09:10:21 UTC_

---

## [0.1.1] - 2026-03-04

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

---

## [0.1.1] - 2026-03-04

## v0.1.1 – Violet Pool Card

🟡 **BETA RELEASE** - Testing phase, may contain bugs

---

### ✨ New Features | Neue Funktionen

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

_Generated automatically by GitHub Actions on 2026-03-04 07:57:32 UTC_

---

## [0.1.3] - 2026-03-04

## v0.1.3 – Violet Pool Card

🟡 **BETA RELEASE** - Testing phase, may contain bugs

---

### ✨ New Features | Neue Funktionen

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
- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)

### 🚀 Improvements | Verbesserungen

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
- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)
- 📝 Release v0.1.2 - Update changelog and version (6b93afd)

### 🔧 Bug Fixes | Fehlerbehebungen

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
- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)

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

📋 [Full changelog: v0.1.2...v0.1.3](https://github.com/Xerolux/violet-pool-card/compare/v0.1.2...v0.1.3)

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

_Generated automatically by GitHub Actions on 2026-03-04 05:39:39 UTC_

---

## [0.1.2] - 2026-03-04

## v0.1.2 – Violet Pool Card

🟡 **BETA RELEASE** - Testing phase, may contain bugs

---

### ✨ New Features | Neue Funktionen

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

📋 [Full changelog: v0.1.3...v0.1.2](https://github.com/Xerolux/violet-pool-card/compare/v0.1.3...v0.1.2)

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

_Generated automatically by GitHub Actions on 2026-03-04 04:19:02 UTC_

---

## [0.1.1] - 2026-03-03

## v0.1.1 – Violet Pool Card

🟡 **BETA RELEASE** - Testing phase, may contain bugs

---

### ✨ New Features | Neue Funktionen

- ci: add auto-build workflow to rebuild dist on src changes [skip ci] (745d669)
- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)

### 🚀 Improvements | Verbesserungen

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

_Generated automatically by GitHub Actions on 2026-03-03 11:14:37 UTC_

---

## [0.1.1] - 2026-03-03

## v0.1.1 – Violet Pool Card

🟡 **BETA RELEASE** - Testing phase, may contain bugs

---

### ✨ New Features | Neue Funktionen

- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)

### 🚀 Improvements | Verbesserungen

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

_Generated automatically by GitHub Actions on 2026-03-03 10:43:40 UTC_

---

## [0.1.1] - 2026-03-03

## v0.1.1 – Violet Pool Card

🟡 **BETA RELEASE** - Testing phase, may contain bugs

---

### ✨ New Features | Neue Funktionen

- Enhanced Violet Pool Card functionality

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

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

_Generated automatically by GitHub Actions on 2026-03-03 07:00:28 UTC_

---

## [0.1.1] - 2026-03-03

## v0.1.1 – Violet Pool Card

🟡 **BETA RELEASE** - Testing phase, may contain bugs

---

### ✨ New Features | Neue Funktionen

- Enhanced Violet Pool Card functionality

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

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

_Generated automatically by GitHub Actions on 2026-03-03 05:48:41 UTC_

---

## [0.1.1] - 2026-03-03

## v0.1.1 – Violet Pool Card

🟡 **BETA RELEASE** - Testing phase, may contain bugs

---

### ✨ New Features | Neue Funktionen

- Enhanced Violet Pool Card functionality

### 🚀 Improvements | Verbesserungen

- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

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

_Generated automatically by GitHub Actions on 2026-03-03 04:37:39 UTC_

---

## [0.1.3] - 2026-03-02

## v0.1.3 – Violet Pool Card

🟡 **BETA RELEASE** - Testing phase, may contain bugs

---

### ✨ New Features | Neue Funktionen

- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)

### 🚀 Improvements | Verbesserungen

- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)
- 📝 Release v0.1.2 - Update changelog and version (6b93afd)

### 🔧 Bug Fixes | Fehlerbehebungen

- Minor bug fixes and stability improvements

### 📚 Documentation | Dokumentation

- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)

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

📋 [Full changelog: v0.1.2...v0.1.3](https://github.com/Xerolux/violet-pool-card/compare/v0.1.2...v0.1.3)

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

_Generated automatically by GitHub Actions on 2026-03-02 18:31:34 UTC_

---

## [0.1.2] - 2026-03-02

## v0.1.2 – Violet Pool Card

🟡 **BETA RELEASE** - Testing phase, may contain bugs

---

### ✨ New Features | Neue Funktionen

- feat: v0.2.0 - cover/light/filter cards, animated SVG icons, RGB picker (b5890ff)
- feat: add tooltip system, chemical card, sensor card + design improvements (f2a1afd)

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.1.1 - Update changelog and version (e8e7a23)

### 🔧 Bug Fixes | Fehlerbehebungen

- Minor bug fixes and stability improvements

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

📋 [Full changelog: v0.1.1...v0.1.2](https://github.com/Xerolux/violet-pool-card/compare/v0.1.1...v0.1.2)

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

_Generated automatically by GitHub Actions on 2026-03-02 18:05:24 UTC_

---

## [0.1.1] - 2026-03-02

## v0.1.1 – Violet Pool Card

🟡 **BETA RELEASE** - Testing phase, may contain bugs

---

### ✨ New Features | Neue Funktionen

- fix-layout-add-details-card (4ade113)
- feat: fix layout overlaps and add new 'details' card type (6025132)
- feat: fix layout overlaps and add new 'details' card type (c5f71c1)
- feat: fix layout overlaps and add new 'details' card type (fecc595)
- fix: Optimize bundle size <100KB and add preview screenshots (f191732)
- feat: Add preview images and enhance demo page (73c4876)
- feat: v0.3.0 — Apple/Samsung design overhaul, new themes, bug fixes (d337d68)

### 🚀 Improvements | Verbesserungen

- 🎨 Palette: Improve accessibility of quick actions buttons (c5d2c94)
- fix: Optimize bundle size <100KB and add preview screenshots (f191732)
- feat: Add preview images and enhance demo page (73c4876)
- improve-pool-card-addon (90ea32f)
- Update links to violet-pool-card repository (b96e851)
- Update README.md (4740156)
- update-readme-setup (a51ebc0)
- optimize-ui-design (fcacd4c)
- chore: update package-lock.json after npm install (0482b5d)
- 📝 Release v0.1.0 - Update changelog and version (f09bec8)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-layout-add-details-card (4ade113)
- feat: fix layout overlaps and add new 'details' card type (6025132)
- feat: fix layout overlaps and add new 'details' card type (c5f71c1)
- feat: fix layout overlaps and add new 'details' card type (fecc595)
- fix: Optimize bundle size <100KB and add preview screenshots (f191732)
- feat: v0.3.0 — Apple/Samsung design overhaul, new themes, bug fixes (d337d68)
- fix: repair broken themes, fix crashes, redesign UI for premium look (f72e3a8)

### 📚 Documentation | Dokumentation

- Update README.md (4740156)
- update-readme-setup (a51ebc0)
- README komplett überarbeitet: Bilder, Features, Installation und Dashboard-Anleitung (798844d)

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

📋 [Full changelog: v0.1.0...v0.1.1](https://github.com/Xerolux/violet-pool-card/compare/v0.1.0...v0.1.1)

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

_Generated automatically by GitHub Actions on 2026-03-02 15:56:51 UTC_

---

## [0.1.0] - 2026-02-06

## v0.1.0 – Violet Pool Card

✅ **STABLE RELEASE**

### ✨ New Features | Neue Funktionen

- fix: Add dist/ folder for HACS repository compliance (83f05de)
- add-bundle-size-reporting (fdd0189)
- feat: Add dynamic entity prefix support for multiple controllers (dd1f9aa)
- feat: add advanced release workflow (461bf61)

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.1.0-alpha.3 - Update changelog and version (a6f7879)
- chore: Update package-lock.json (d1e8ba2)
- 📝 Release v0.1.0-alpha.2 - Update changelog and version (9b28e69)
- Resolve conflicts and optimize bundle size (1add116)
- Resolve PR #15 merge conflicts and optimize bundle size (d8f138f)
- Implement Premium UI themes (iOS/OneUI style) and optimize bundle size (2fcb805)
- Update README.md (ca4d34d)
- 📝 Release v0.1.0-alpha.1 - Update changelog and version (068a4c8)
- update-to-violet-pool-card-and-screenshots (e49433b)
- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)
- Update package-lock.json (eaae0be)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix: Trim whitespace from tag input in release workflow (d973a5b)
- fix: Reduce bundle to 93KB, rewrite README, fix version mismatch (5b9d69e)
- fix-repo-structure (3d5322b)
- fix: Add dist/ folder for HACS repository compliance (83f05de)
- fix: Reduce bundle size to under 100KB limit (9bff871)
- fix-pr-15-comments (18c4bcb)
- Fix PR 15 issues: Configurable entities, CSS fixes, and Docs refactoring (6403ada)

### 📚 Documentation | Dokumentation

- fix: Reduce bundle to 93KB, rewrite README, fix version mismatch (5b9d69e)
- revert-readme (11ee510)
- Revert README.md to previous version (f0787c8)
- Fix PR 15 issues: Configurable entities, CSS fixes, and Docs refactoring (6403ada)
- Update README.md (ca4d34d)
- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)

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

📋 Full changelog: Initial release

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

_Generated automatically by GitHub Actions on 2026-02-06 13:26:25 UTC_

---

## [0.1.0-alpha.3] - 2026-01-05

## v0.1.0-alpha.3 – Violet Pool Card

🔴 **ALPHA RELEASE** - Experimental features, use with caution!

---

### ✨ New Features | Neue Funktionen

- add-bundle-size-reporting (fdd0189)
- feat: Add dynamic entity prefix support for multiple controllers (dd1f9aa)
- feat: add advanced release workflow (461bf61)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)

### 🚀 Improvements | Verbesserungen

- chore: Update package-lock.json (d1e8ba2)
- 📝 Release v0.1.0-alpha.2 - Update changelog and version (9b28e69)
- Resolve conflicts and optimize bundle size (1add116)
- Resolve PR #15 merge conflicts and optimize bundle size (d8f138f)
- Implement Premium UI themes (iOS/OneUI style) and optimize bundle size (2fcb805)
- Update README.md (ca4d34d)
- 📝 Release v0.1.0-alpha.1 - Update changelog and version (068a4c8)
- update-to-violet-pool-card-and-screenshots (e49433b)
- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)
- Update package-lock.json (eaae0be)
- improve-readme-badges (7ed69bb)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- Update README.md (bdd83d3)
- Update FUNDING.yml (5c442ba)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix: Reduce bundle size to under 100KB limit (9bff871)
- fix-pr-15-comments (18c4bcb)
- Fix PR 15 issues: Configurable entities, CSS fixes, and Docs refactoring (6403ada)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)

### 📚 Documentation | Dokumentation

- revert-readme (11ee510)
- Revert README.md to previous version (f0787c8)
- Fix PR 15 issues: Configurable entities, CSS fixes, and Docs refactoring (6403ada)
- Update README.md (ca4d34d)
- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)
- improve-readme-badges (7ed69bb)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- Update README.md (bdd83d3)

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

📋 Full changelog: Initial release

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

_Generated automatically by GitHub Actions on 2026-01-05 13:09:46 UTC_

---

## [0.1.0-alpha.2] - 2026-01-05

## v0.1.0-alpha.2 – Violet Pool Card

🔴 **ALPHA RELEASE** - Experimental features, use with caution!

---

### ✨ New Features | Neue Funktionen

- feat: add advanced release workflow (461bf61)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- add-screenshots (c84ab5c)
- Add screenshots to README.md (6a7d97a)

### 🚀 Improvements | Verbesserungen

- Resolve conflicts and optimize bundle size (1add116)
- Resolve PR #15 merge conflicts and optimize bundle size (d8f138f)
- Implement Premium UI themes (iOS/OneUI style) and optimize bundle size (2fcb805)
- Update README.md (ca4d34d)
- 📝 Release v0.1.0-alpha.1 - Update changelog and version (068a4c8)
- update-to-violet-pool-card-and-screenshots (e49433b)
- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)
- Update package-lock.json (eaae0be)
- improve-readme-badges (7ed69bb)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- Update README.md (bdd83d3)
- Update FUNDING.yml (5c442ba)
- 📖 README Update: Visual Editor Showcase (1a3da5d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-pr-15-comments (18c4bcb)
- Fix PR 15 issues: Configurable entities, CSS fixes, and Docs refactoring (6403ada)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)

### 📚 Documentation | Dokumentation

- revert-readme (11ee510)
- Revert README.md to previous version (f0787c8)
- Fix PR 15 issues: Configurable entities, CSS fixes, and Docs refactoring (6403ada)
- Update README.md (ca4d34d)
- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)
- improve-readme-badges (7ed69bb)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- Update README.md (bdd83d3)
- Add screenshots to README.md (6a7d97a)
- 📖 README Update: Visual Editor Showcase (1a3da5d)

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

📋 Full changelog: Initial release

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

_Generated automatically by GitHub Actions on 2026-01-05 12:40:37 UTC_

---

## [0.1.0-alpha.1] - 2026-01-05

## v0.1.0-alpha.1 – Violet Pool Card

🔴 **ALPHA RELEASE** - Experimental features, use with caution!

---

### ✨ New Features | Neue Funktionen

- feat: add advanced release workflow (461bf61)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- add-screenshots (c84ab5c)
- Add screenshots to README.md (6a7d97a)
- 📊 Feature Analysis: Market Research vs Top HACS Cards (33c66a6)
- feature/ui-ux-overhaul (a7f40b5)
- feat: Overhaul UI/UX with Modern/Luxury styles and System card (f522e64)
- Add demo page and screenshot generation script (8061fc4)

### 🚀 Improvements | Verbesserungen

- update-to-violet-pool-card-and-screenshots (e49433b)
- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)
- Update package-lock.json (eaae0be)
- improve-readme-badges (7ed69bb)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- Update README.md (bdd83d3)
- Update FUNDING.yml (5c442ba)
- 📖 README Update: Visual Editor Showcase (1a3da5d)

### 🔧 Bug Fixes | Fehlerbehebungen

- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)

### 📚 Documentation | Dokumentation

- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)
- improve-readme-badges (7ed69bb)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- Update README.md (bdd83d3)
- Add screenshots to README.md (6a7d97a)
- 📖 README Update: Visual Editor Showcase (1a3da5d)
- 📚 Phase C: Complete Documentation (8cb10ad)

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

📋 Full changelog: Initial release

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

_Generated automatically by GitHub Actions on 2026-01-05 09:44:07 UTC_

---


## [1.0.0] - 2026-01-04

### Added (Sessions 9-10 - 2026-01-04)
- **Overview Card:** Water chemistry dashboard with traffic light indicators
- **Overview Card:** Active devices list with color-coded states
- **Overview Card:** Warnings section with frost protection alerts
- **Overview Card:** "All systems normal" indicator
- **Compact Card:** Auto-detected icons based on entity type
- **Compact Card:** Current value display (temp, level, pH, ORP)
- **Compact Card:** Enhanced detail status parsing
- **Compact Card:** Color-coded active/inactive icons
- **Compact Card:** Hover effect for better UX
- Responsive design with mobile optimizations (@media queries)
- Complete theme support (dark/light mode)
- ~220 lines of new CSS for overview and compact cards
- Full documentation update (README, examples)
- Final bundle size: 84KB (under 100KB target)

### Added (Sessions 5-8 - 2026-01-04)
- **Pump Card:** Runtime counter with h/min formatting
- **Pump Card:** RPM display for current speed level
- **Pump Card:** Icon animation (rotating) when pump is running
- **Pump Card:** Level badge showing current speed
- **Heater Card:** Outside temperature indicator
- **Heater Card:** Blockage warning when outside temp too low
- **Heater Card:** Icon animation (pulsing) when heating
- **Solar Card:** Pool temperature display
- **Solar Card:** Absorber temperature display
- **Solar Card:** Temperature delta calculation
- **Solar Card:** Color-coded delta hints (too cold/heating possible/ideal)
- **Dosing Card:** Current value display (pH/ORP)
- **Dosing Card:** Target value display
- **Dosing Card:** Min/Max threshold display
- **Dosing Card:** Auto-detect dosing type from entity ID
- **Dosing Card:** Icon selection based on dosing type
- **Dosing Card:** Dosing history (24h volume)
- Enhanced CSS animations (rotate, pulse-glow)
- Card-specific styling for all card types
- ~230 lines of new CSS for visual enhancements

### Added (Session 4 - 2026-01-04)
- Quick Actions Component with button grid layout
- Pump Card: 5 quick actions (OFF, AUTO, ECO, Normal, Boost)
- Heater Card: 3 quick actions (OFF, AUTO, HEAT)
- Dosing Card: 4 quick actions (OFF, AUTO, Dose 30s, Dose 60s)
- Confirmation dialogs for manual dosing
- Loading states with spinner animation
- Ripple effect on button clicks
- Touch-optimized buttons (min 48px)

### Added (Session 3 - 2026-01-04)
- Slider Control Component with touch optimization
- Service Caller Utility for all HA service calls
- Entity Helper Utility for state parsing and formatting
- Pump Card: Speed slider (0-3 with labels)
- Heater Card: Temperature slider with value display
- Debounced value changes (300ms)
- Toast notification support
- Error handling for service calls

### Added (Session 2 - 2026-01-04)
- Status Badge Component with 11 states and animations
- Value Display Component with status indicators and ranges
- Detail Status Component with auto-parsing and formatting
- Warning Chips Component with dismissable warnings
- Component integration in Pump, Dosing, and Compact cards
- Comprehensive component documentation (COMPONENT_DEMO.md)

### Added (Session 1 - 2026-01-04)
- Initial release
- Basic card structure with all card types
- Pump card (placeholder with status badge)
- Heater card (placeholder)
- Solar card (placeholder)
- Dosing card (placeholder with warning chips)
- Overview card (placeholder)
- Compact card (basic implementation with status badge)
- HACS compatibility
- TypeScript + Lit Element setup
- Rollup build system
- Full documentation (README.md, ROADMAP.md, QUICK_START.md)
