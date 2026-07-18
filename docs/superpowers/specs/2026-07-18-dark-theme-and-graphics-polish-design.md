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

### 2.2 Typografie-Stärkung (für das `lagoon`-Theme)

Innerhalb des `lagoon`-Themes werden die Messwert-Zahlen größer und klarer. Wir nutzen dafür neue optionale Tokens, die nur von `lagoon` (und später ggf. anderen) gesetzt werden:

- `--vpc-metric-size`: `2.4rem` (Hauptmesswert einer Karte, z. B. pH-Wert, Temperatur)
- `--vpc-metric-weight`: `650`
- `--vpc-metric-tracking`: `-0.02em`
- `--vpc-label-size`: `0.78rem`, `letter-spacing: 0.04em`, `text-transform: uppercase`
- `--vpc-unit-size`: `0.9rem`, Farbe `--vpc-text-secondary`

Diese Tokens sind für alle Themes deklariert (mit bestehenden Werten als Default), sodass bestehende Themes optisch identisch bleiben und nur `lagoon` sie überschreibt.

### 2.3 Status-Badges vereinheitlicht

Neue Badge-Komponenten-CSS (in `component-styles.ts`, gültig für alle Themes, aber nur visuell sichtbar wenn Tokens vorhanden — Abwärtskompatibilität durch Default-Werte):

- Vier Varianten passend zum bestehenden Severity-Modell (`ok`, `info`, `warning`, `critical`). `info` ist im Modell bereits enthalten — hier wird nur das Badge-Styling dafür ergänzt.
- Jedes Badge: 4–6px Dot + Icon + Label, nicht nur Farbe.
- Pillenform: `border-radius: 999px`, Padding `4px 10px`, Font `0.72rem` `500`.
- `lagoon`-spezifisch: Badge-Hintergrund ist ein 12%-Alpha der Status-Farbe, Border 25%-Alpha, Text volle Status-Farbe.

---

## 3. Grafik-Polish (profitiert allen Themes, rein CSS-Token-basiert)

Diese Maßnahmen sind **rein additiv über neue CSS-Tokens** und verändern bestehende Themes nicht, weil die Token-Defaults den aktuellen Werten entsprechen.

### 3.1 Neue optionale Design-Tokens (in `design-system.ts`)

```
--vpc-tile-radius:        /* default: var(--vpc-radius) */
--vpc-tile-padding:       /* default: var(--vpc-spacing) */
--vpc-tile-gap:           /* default: calc(var(--vpc-spacing) / 2) */
--vpc-control-radius:     /* default: 10px */
--vpc-segment-gap:        /* default: 2px */
--vpc-focus-ring:         /* default: 0 0 0 2px var(--vpc-primary-glow) */
--vpc-pressed-scale:      /* default: 0.97 */
--vpc-hover-lift:         /* default: -2px */
--vpc-motion-ease:        /* default: cubic-bezier(0.2, 0.7, 0.2, 1) */
```

`lagoon` überschreibt gezielt: `--vpc-tile-radius: 16px`, `--vpc-control-radius: 12px`, `--vpc-tile-gap: 8px`, `--vpc-hover-lift: -3px`.

### 3.2 Interaktions-Polish

- **Fokus-Ring** (`:focus-visible`) auf allen interaktiven Elementen via `--vpc-focus-ring`. Derzeit fehlt dies teilweise → Accessibility-Gewinn.
- **Pressed-Feedback:** Buttons/Toggles skalieren auf `--vpc-pressed-scale` beim `:active`, Transit `120ms`.
- **Hover-Lift:** Tiles heben um `--vpc-hover-lift` beim Hover, mit `--vpc-shadow`.
- Alle Bewegungen hinter `@media (prefers-reduced-motion: reduce)` → reduziert auf reine Farbwechsel.

### 3.3 Messwert-Darstellung verfeinern

In den Karten, die Hauptwerte zeigen (Chemie, Temperatur, Filterdruck, Durchfluss, Kanister-Level):
- Zahl groß (via `--vpc-metric-size`), Einheit klein daneben (via `--vpc-unit-size`).
- Zielwert-Bereich als dezenter "Target"-Subtext (`Soll 7.0–7.4`), nicht als eigene Zeile dominierend.
- Sparkline optional darunter, nur wenn Daten vorhanden (bereits implementiert → nur Styling konsistenter machen).

Das passiert ausschließlich über CSS-Selektoren, die bereits vorhandene Klassennamen verwenden. Keine HTML-Strukturänderung an bestehenden Render-Pfaden.

---

## 4. Komponenten-Beteiligte

| Datei | Änderung | Risiko |
|-------|----------|--------|
| `src/styles/design-system.ts` | Neue Token-Defaults hinzufügen (nicht ersetzen). | Sehr niedrig — additive Defaults. |
| `src/styles/premium-themes.ts` | Neuen Block `ha-card.theme-lagoon { ... }` anhängen. | Niedrig — reiner Zusatz. |
| `src/styles/component-styles.ts` | Fokus-Ring, Pressed, Hover-Lift, Badge-Stile ergänzen. | Niedrig — nutzt neue Token, Defaults erhalten. |
| `src/violet-pool-card.ts` | `Theme`-Typ um `'lagoon'` erweitern. (Hinweis: Die Hauptdatei deklariert ihren eigenen `Theme`-Typ separat von `types/index.ts` — beide Stellen müssen konsistent erweitert werden.) | Niedrig. |
| `src/types/index.ts` | `Theme`-Typ ergänzen, `isValidTheme`-Liste ergänzen. | Niedrig. |
| `src/editor/violet-pool-card-editor.ts` | Theme-Picker-Eintrag für `lagoon` ergänzen; optional neuer Preset "Ruhiges Wasser". | Niedrig. |
| `src/utils/i18n.ts` | Label `theme_lagoon: 'Lagoon'` in en/de. | Niedrig. |
| `demo/index.html` | Eine Demo-Karte mit `lagoon`-Theme ergänzen. | Kein Risiko. |
| `README.md` / `info.md` | Theme in der Liste erwähnen. | Kein Risiko. |

**Nicht angetastet:** Service-Logik, Entity-Auflösung, animated-icons, severity-model, Hauptrender-Pfade.

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
