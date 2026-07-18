# Design Spec: Neues Dark-Theme + Grafik-Polish (Phase 1)

**Datum:** 2026-07-18
**Status:** Entwurf, wartet auf Freigabe
**Scope:** Phase 1 von 4 (visuelles Redesign). Phasen 2–4 (Entity-Mapping, Refactoring/Performance, Editor/UX/Doku) werden in separaten Specs behandelt.

---

## 1. Ziel & Nicht-Ziele

### Ziel
Ein neues, eigenständiges Dark-Theme hinzufügen, das die Lesbarkeit und visuelle Hierarchie der Violet Pool Card auf ein neues Niveau hebt — ohne bestehende Themes oder Konfigurationen zu verändern. Zusätzlich gezielte Grafik-Polish-Maßnahmen, die allen Themes zugutekommen.

### Nicht-Ziele (dieser Phase)
- Keine Änderung an Entity-Keys oder Service-Aufrufen (Phase 2).
- Kein Refactoring der 4500-Zeilen-Hauptdatei (Phase 3).
- Keine Überarbeitung des Editors oder der Doku (Phase 4).
- Keine Entfernung oder Änderung bestehender Themes — alle 13 bestehenden Themes bleiben byte-identisch.
- Keine neuen Karten-Typen.

### Design-Prinzipien für diese Phase
1. **Abwärtskompatibel:** Jede bestehende Konfiguration verhält sich exakt gleich. Das neue Theme ist rein additiv.
2. **WCAG 2.1 AA:** Text-Kontrast ≥ 4.5:1, UI-Elemente ≥ 3:1, in hell wie dunkel.
3. **`prefers-reduced-motion` respektieren:** Animationen werden auf `subtle`/keine reduziert, wenn der Nutzer es wünscht.
4. **Status nie nur durch Farbe:** Jedes Status-Badge trägt zusätzlich Icon oder Text.
5. **Eigene Identität:** Keine Namen, Strings, Kommentare oder Variablen, die auf externe Vorbilder hinweisen. Eigenständige Theme-/Token-Namen.

---

## 2. Das neue Theme: `lagoon`

Ein tiefer, ruhiger Dark-Modus mit klarem, kühlem Wasser-Charakter und Violet-Akzent, der zur Markenidentität des Violet Pool Controllers passt.

### 2.1 Farbpalette

| Token | Wert (Light-Surface-Sub-Theme) | Wert (Dark-Surface-Sub-Theme) | Verwendung |
|-------|-------------------------------|-------------------------------|------------|
| `--vpc-bg` | `#0d1b2a` (Haupt-Background) | `#0a1520` (vertieft) | Karten-Background, Navy-Verlauf |
| `--vpc-bg-gradient` | `linear-gradient(160deg, #0d1b2a 0%, #102a43 55%, #0a1520 100%)` | wie links | Layered Background |
| `--vpc-surface` | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.04)` | Innere Tiles, Messwert-Karten |
| `--vpc-surface-elevated` | `rgba(255,255,255,0.10)` | `rgba(255,255,255,0.07)` | Hover, aktive Elemente |
| `--vpc-primary` (Violet-Akzent) | `#9b6dff` | `#a87dff` | Marken-Akzent, aktive Schalter |
| `--vpc-primary-glow` | `rgba(155,109,255,0.35)` | `rgba(168,125,255,0.40)` | Glow, Fokus-Ringe |
| `--vpc-text` | `#e6f1ff` | `#f0f6ff` | Primärer Text |
| `--vpc-text-secondary` | `#8fa3bd` | `#7d93ad` | Sekundärer Text (≥ 4.5:1 geprüft) |
| `--vpc-text-faint` | `#5a6f87` | `#4e6177` | Labels, Captions (nur ≥ 14px) |
| `--vpc-success` | `#3dd68c` | `#46e09a` | OK-Status |
| `--vpc-warning` | `#ffb454` | `#ffc06b` | Warn-Status |
| `--vpc-danger` | `#ff5470` | `#ff6b85` | Kritischer Status |
| `--vpc-border` | `1px solid rgba(255,255,255,0.08)` | wie links | Tile-Borders |
| `--vpc-shadow` | `0 8px 32px rgba(0,0,0,0.45)` | wie links | Karten-Schatten |
| `--vpc-backdrop` | `blur(12px) saturate(140%)` | wie links | Glassmorphism für Tiles |

**Kontrast-Checks (gegen `--vpc-bg` `#0d1b2a`):**
- `--vpc-text` `#e6f1ff` → Verhältnis ~16.8:1 ✅
- `--vpc-text-secondary` `#8fa3bd` → ~6.9:1 ✅
- `--vpc-success` `#3dd68c` → ~9.1:1 ✅
- `--vpc-warning` `#ffb454` → ~9.4:1 ✅
- `--vpc-danger` `#ff5470` → ~5.6:1 ✅

### 2.2 Typografie & Status-Badges — auf Phase 3 verschoben

Ursprünglich hier geplant: größere Messwert-Typografie über neue Tokens (`--vpc-metric-size` etc.) und vereinheitlichte Status-Badges.

**Code-Analyse bei der Plan-Erstellung hat gezeigt:** Messwert-Größen und Badge-Styling sind im Card-CSS hart in vielen einzelnen Selektoren codiert (`.temp-hero-value{font-size:44px}`, `.dosing-current-value{font-size:32px}`, `.info-badge`, `.dosing-status-pill`, `.overview-active-dot` …), nicht über Tokens. Eine Token-basierte Umstellung würde diese Selektoren umschreiben — das verletzt das "bestehende Themes bleiben byte-identisch"-Ziel und ist von der Größe her Phase-3-Material (Refactoring der Hauptdatei).

**Scope-Reduktion für Phase 1:** Typografie- und Badge-Vereinheitlichung wandern in Phase 3. Phase 1 liefert nur das `lagoon`-Theme (§2.1), Fokus-Ringe und `prefers-reduced-motion` (§3.2) — das ist sicher rein additiv.

---

## 3. Grafik-Polish (profitiert allen Themes, rein CSS-Token-basiert)

Diese Maßnahmen sind **rein additiv** und verändern bestehende Themes nicht.

### 3.1 Eingesetzter Token (in Phase 1)

- `--vpc-focus-ring` (Default `0 0 0 2px color-mix(... var(--vpc-primary) 55% ...)`) — wird nur von `:focus-visible` konsumiert, das bisher keine Regel hatte. Für bestehende Themes ein reiner Accessibility-Gewinn ohne optische Änderung im Nicht-Fokus-Zustand.

Weitere Tokens (`--vpc-tile-radius`, `--vpc-hover-lift`, `--vpc-metric-size` etc.) sind auf Phase 3 verschoben (siehe §2.2), weil ihre Konsumstellen tief im bestehenden CSS verankert sind und ein Umschreiben das "byte-identisch"-Ziel gefährden würde.

### 3.2 Interaktions-Polish (in Phase 1 umgesetzt)

- **Fokus-Ring** (`:focus-visible`) auf Speed-Segmenten, Off-Button, Chemie-Karten, Device-Rows und der Karte selbst via `--vpc-focus-ring`. Accessibility-Gewinn.
- **`prefers-reduced-motion`**: globales `@media`-Block, das alle dekorativen Animationen (pump-running, heater-active, solar-active, dosing-active, overview-active-dot) und Hover-Transforms unterdrückt, wenn das OS Reduced-motion anfordert. WCAG 2.1 AA.

### 3.3 Messwert-Darstellung — auf Phase 3 verschoben

Siehe §2.2: erfordert Selektor-Umschreibung, daher nicht in Phase 1.

---

## 4. Komponenten-Beteiligte

Code-Analyse bei der Plan-Erstellung hat gezeigt: Die Dateien `src/styles/design-system.ts`, `src/styles/premium-themes.ts` und `src/styles/component-styles.ts` sind **toter Code** — sie werden nirgendwo importiert. Der gesamte Theme-Mechanismus lebt im großen `static get styles()` CSS-Block in `src/violet-pool-card.ts` (ab Zeile 4065). Die folgende Liste ist an diese Realität angepasst.

| Datei | Änderung | Risiko |
|-------|----------|--------|
| `src/violet-pool-card.ts` | `Theme`-Typ (Zeile 60) um `'lagoon'` erweitern; `ha-card.theme-lagoon { ... }` + Fokus/Reduced-Motion-Block im CSS (Zeile 4065) anhängen. | Niedrig — Typ plus reiner CSS-Zusatz. |
| `src/types/index.ts` | `Theme`-Typ (Zeile 122) und `isValidTheme`-Liste (Zeile 471) ergänzen. | Niedrig. |
| `src/editor/violet-pool-card-editor.ts` | Theme-Picker-Eintrag für `lagoon` ergänzen; optional neuer Preset "Dark Lagoon". | Niedrig. |
| `src/utils/i18n.ts` | Label `theme_lagoon: 'Lagoon'` (en) / `'Lagune'` (de). | Niedrig. |
| `demo/index.html` | Zwei Demo-Karten (Pump + Heater) mit `lagoon`-Theme ergänzen. | Kein Risiko. |
| `README.md` / `info.md` | Theme in der Liste erwähnen. | Kein Risiko. |

**Nicht angetastet:** Service-Logik, Entity-Auflösung, animated-icons, severity-model, Hauptrender-Pfade, die toten `src/styles/*.ts`-Dateien (außer Scope).

---

## 5. Erfolgskriterien

1. `npm run build` läuft fehlerfrei, Bundle wächst um < 2 kB (nur CSS).
2. `npm run lint` und `npm test` bleiben grün.
3. Bestehende Themes (`classic`, `midnight`, … `aurora`) sind optisch byte-identisch (visueller Check der Demo-Seite).
4. Neues `lagoon`-Theme: alle 5 Kontrast-Checks aus 2.1 bestanden, Status-Badges haben Icon+Text, `prefers-reduced-motion` deaktiviert Bewegung.
5. Editor zeigt `lagoon` als Option; Konfiguration wird korrekt gespeichert/geladen.
6. Kein Code, keine Kommentare, keine Variablennamen verweisen auf externe Vorbilder.

---

## 6. Test-Plan

- **Visueller Regressionstest:** Demo-Seite (`demo/index.html`) für `classic`, `midnight`, `ocean` vor/nach dem Diff vergleichen — muss identisch aussehen.
- **Manueller Theme-Check:** `lagoon` an Pump/Heizung/Chemie/Filter/Kanister durchklicken in der Demo.
- **Kontrast-Check:** Manuelle Verifikation der 5 Token aus 2.1 mit einem Kontrast-Rechner.
- **Accessibility:** Tab-Navigation durch eine `lagoon`-Karte; Fokus-Ringe sichtbar; `prefers-reduced-motion: reduce` im DevTools-Rendering-Panel aktivieren → keine Bewegung.
- **Build/Lint/Test:** Siehe Erfolgskriterien 1–2.

---

## 7. Offene Punkte (vor Freigabe klären)

Keine. Die Phase ist bewusst eng gefasst (nur 1 Theme + CSS-Polish). Alle Entity-/Service-/Refactoring-Themen sind explizit in Phasen 2–4 ausgelagert.
