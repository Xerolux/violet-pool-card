## v0.4.0 – Violet Pool Card

✅ **STABLE RELEASE**

Diese Version behebt die Ursache für zwei häufig gemeldete Probleme: dauerhafte
"Wert ausserhalb des Bereichs"-Meldungen und die unleserlichen pH-/Redox-Anzeigen.

### ✨ New Features | Neue Funktionen

- **Grenzwerte sind jetzt einstellbar** — im visuellen Editor unter **Grenzwerte** oder per YAML:

  ```yaml
  thresholds:
    ph:          { min: 7.0, max: 7.6 }
    orp:         { min: 600, max: 800 }
    chlorine:    { min: 0.3, max: 1.5 }
    temperature: { min: 26, max: 31 }
  alerts: warning
  ```

  Je Messgröße lassen sich `min`, `max`, eine Warn-Toleranz (`warn`), der Anzeigebereich (`range`)
  und ein `ignore`-Flag setzen. Unterstützt: `ph`, `orp`, `chlorine`, `salt`, `temperature`,
  `cyanuric_acid`, `alkalinity`.
- **Meldungsstufe `alerts`** — `all` (Standard), `warning`, `critical` oder `none`. Die Messwerte
  bleiben immer sichtbar; nur die Hinweise werden gefiltert.
- **Gauges mit Werten** — pH und Redox zeigen Zahl, Einheit, Skalenenden und die Optimalzone.

### 🐛 Bug Fixes | Fehlerbehebungen

- Verschachtelte SVG-Templates wurden im HTML-Namespace erzeugt und **nie gerendert** — betraf
  32 Stellen inklusive Gauge-Nadel, Wertbogen und den animierten Details von Pumpe, Solar, Licht,
  Abdeckung und Kanistern.
- Gauge-Bogen wurde als Gerade statt entlang des Kreises berechnet; ab Skalenmitte lief er zusätzlich
  den langen Weg um den Kreis.
- Statusfarbe und Statustext konnten sich widersprechen ("Zu hoch" in Grün).
- Alarme und Empfehlungen wurden doppelt gelistet — jetzt ein Panel mit Befund und Empfehlung.
- Kartentitel wurde vom Status-Badge überlagert.
- Filterdruck-Gauge: falscher Kreisumfang (~5 % Überzeichnung) und in dunklen Themes unlesbar.
- "Wasserqualität optimal" erschien auch bei stummgeschalteten, aber abweichenden Werten.
- Karten-Vorschau im Card Picker zeigte einen Entity-Fehler statt einer Vorschau.

### 🎨 Design

- Neues Karten-Icon und Logo (violette Kachel mit Wassertropfen und Wellen) in Light- und
  Dark-Varianten, reproduzierbar über `scripts/generate-brand-assets.py`.
- Gauges respektieren dunkle Themes über `--vpc-gauge-track`.

### 🧪 Tests

- 88 Tests (vorher 47), davon 41 neu für Grenzwert-Logik und Gauge-Geometrie.

### 🧩 Compatibility

- Rein additiv. Bestehende Konfigurationen funktionieren unverändert und behalten die
  bisherigen Standardbereiche (angelehnt an DIN 19643).
- Keine Migration nötig.

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

---

📋 [Full changelog: v0.3.0...v0.4.0](https://github.com/Xerolux/violet-pool-card/compare/v0.3.0...v0.4.0)

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

_Generated on 2026-08-16_
