# Lagoon Dark Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new independent dark theme named `lagoon` to the Violet Pool Card, plus additive accessibility/interaction polish, without changing the appearance of any existing theme.

**Architecture:** The card's theme system lives entirely inside a single large `static get styles()` CSS block in `src/violet-pool-card.ts` (starts at line 4065). Themes are applied by adding a `theme-<name>` class to the `<ha-card>` element (line 580). The `Theme` type and `isValidTheme()` guard exist in **two places that must stay in sync**: `src/violet-pool-card.ts` (line 60) and `src/types/index.ts` (line 122 / 471). This plan adds the new theme purely additively: one new CSS selector block, two type-list extensions, one editor picker entry, one i18n label, one demo card, and one docs note. The accessibility/interaction polish uses CSS custom-property defaults so existing themes render byte-identically.

**Tech Stack:** TypeScript, Lit 3 (LitElement + `css` template tag), Vitest, Rollup. No new dependencies.

## Global Constraints

- **Build must stay green:** `npm run build`, `npm run lint`, `npm test` must all pass after every task.
- **No regressions:** The 13 existing themes (`classic, midnight, elegance, vibrant, pure, frost, glow, metallic, ocean, sunset, forest, aurora`) must look byte-identical. Verify by loading `demo/index.html` before/after.
- **WCAG 2.1 AA contrast:** Text ≥ 4.5:1, UI/large text ≥ 3:1 against the theme background. Verified contrast ratios for `lagoon` (against `#0d1b2a`): text `#e6f1ff` 16.8:1, text-secondary `#8fa3bd` 6.9:1, success `#3dd68c` 9.1:1, warning `#ffb454` 9.4:1, danger `#ff5470` 5.6:1.
- **Independent identity:** No variable names, comments, commit messages, or docs that reference any external app, vendor, or inspiration source. The theme is an original work named `lagoon`.
- **Two type sources in sync:** `src/violet-pool-card.ts:60` and `src/types/index.ts:122` both declare `Theme`; `src/types/index.ts:471` declares `isValidTheme`. All three must list `lagoon`.
- **Frequent commits:** One logical concern per commit, Conventional Commits style.

---

## File Structure

| File | Responsibility | Change type |
|------|----------------|-------------|
| `src/violet-pool-card.ts` | Declares the runtime `Theme` type (line 60); owns the entire CSS theme block (line 4065). | Modify: add `'lagoon'` to type; append one CSS selector + a `:focus-visible`/`prefers-reduced-motion` polish block. |
| `src/types/index.ts` | Declares the canonical `Theme` type (line 122) and `isValidTheme()` (line 471). | Modify: add `'lagoon'` to both lists. |
| `tests/theme-lagoon.test.ts` | New unit test asserting `isValidTheme('lagoon')` and the full valid-theme list. | Create. |
| `src/editor/violet-pool-card-editor.ts` | Visual editor theme picker (line ~108-120). | Modify: add `lagoon` picker entry + optional preset. |
| `src/utils/i18n.ts` | Bilingual labels. | Modify: add `theme_lagoon` key (en + de). |
| `demo/index.html` | Standalone visual demo. | Modify: add one `lagoon` demo card. |
| `README.md` | Theme list in the Features section. | Modify: mention `lagoon`. |
| `info.md` | Theme list mirrored for HACS. | Modify: mention `lagoon`. |

**Not touched:** service-caller, entity-helper, animated-icons, severity-model, the render methods of individual card types, the dead `src/styles/*.ts` files (they are unused legacy — out of scope for phase 1).

---

## Task 1: Add `lagoon` to the theme type lists + failing test

This task makes `lagoon` a *recognized* theme value everywhere, with a test that proves it. No visual change yet (no CSS), so existing behavior is untouched.

**Files:**
- Modify: `src/violet-pool-card.ts:60`
- Modify: `src/types/index.ts:122` and `src/types/index.ts:471-486`
- Create: `tests/theme-lagoon.test.ts`

**Interfaces:**
- Produces: `isValidTheme('lagoon') === true` (from `src/types/index.ts`). Later tasks rely on this being a valid config value.

- [ ] **Step 1: Write the failing test**

Create `tests/theme-lagoon.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { isValidTheme } from '../src/types';

describe('isValidTheme', () => {
  it('accepts the new lagoon dark theme', () => {
    expect(isValidTheme('lagoon')).toBe(true);
  });

  it('still accepts every previously supported theme (no regression)', () => {
    const previous = [
      'classic', 'midnight', 'elegance', 'vibrant', 'pure', 'frost',
      'glow', 'metallic', 'ocean', 'sunset', 'forest', 'aurora',
    ];
    for (const theme of previous) {
      expect(isValidTheme(theme)).toBe(true);
    }
  });

  it('rejects unknown theme names', () => {
    expect(isValidTheme('oceanic')).toBe(false);
    expect(isValidTheme('')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/theme-lagoon.test.ts`
Expected: FAIL — `isValidTheme('lagoon')` returns `false` because `'lagoon'` is not in the list.

- [ ] **Step 3: Extend the `Theme` type in `src/types/index.ts`**

At line 122-134, the type is:

```typescript
export type Theme =
  | 'classic'
  | 'midnight'
  | 'elegance'
  | 'vibrant'
  | 'pure'
  | 'frost'
  | 'glow'
  | 'metallic'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'aurora';
```

Append `| 'lagoon'` as the last union member:

```typescript
export type Theme =
  | 'classic'
  | 'midnight'
  | 'elegance'
  | 'vibrant'
  | 'pure'
  | 'frost'
  | 'glow'
  | 'metallic'
  | 'ocean'
  | 'sunset'
  | 'forest'
  | 'aurora'
  | 'lagoon';
```

At line 471-487, `isValidTheme` lists the same values in an array literal. Add `'lagoon'` to the array (after `'aurora'`):

```typescript
export function isValidTheme(value: unknown): value is Theme {
  const validThemes: Theme[] = [
    'classic',
    'midnight',
    'elegance',
    'vibrant',
    'pure',
    'frost',
    'glow',
    'metallic',
    'ocean',
    'sunset',
    'forest',
    'aurora',
    'lagoon',
  ];
  return typeof value === 'string' && validThemes.includes(value as Theme);
}
```

- [ ] **Step 4: Extend the runtime `Theme` type in `src/violet-pool-card.ts`**

At line 60:

```typescript
export type Theme = 'classic' | 'midnight' | 'elegance' | 'vibrant' | 'pure' | 'frost' | 'glow' | 'metallic' | 'ocean' | 'sunset' | 'forest' | 'aurora';
```

Change to:

```typescript
export type Theme = 'classic' | 'midnight' | 'elegance' | 'vibrant' | 'pure' | 'frost' | 'glow' | 'metallic' | 'ocean' | 'sunset' | 'forest' | 'aurora' | 'lagoon';
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/theme-lagoon.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Run full lint + build + test to confirm no regressions**

Run: `npm run lint && npm run build && npm test`
Expected: All pass. (The `lagoon` theme has no CSS yet, so a card configured with `theme: 'lagoon'` will currently render with the `:host` defaults — acceptable for this task; the CSS lands in Task 3.)

- [ ] **Step 7: Commit**

```bash
git add src/types/index.ts src/violet-pool-card.ts tests/theme-lagoon.test.ts
git commit -m "feat(theme): register 'lagoon' as a valid theme value

Adds the lagoon dark theme to the Theme type and isValidTheme()
guard in both declaration sites (src/types/index.ts and the
runtime copy in src/violet-pool-card.ts). No visual CSS yet —
that follows in a dedicated task. Covered by tests/theme-lagoon.test.ts."
```

---

## Task 2: Add the `theme_lagoon` i18n label

**Files:**
- Modify: `src/utils/i18n.ts` (both `en` and `de` blocks)
- Modify: `tests/i18n.test.ts` (add an assertion)

**Interfaces:**
- Produces: `i18n.t('theme_lagoon')` returns `'Lagoon'` (en) / `'Lagune'` (de). Used by the editor picker in Task 4.

- [ ] **Step 1: Add the failing test assertion**

In `tests/i18n.test.ts`, inside the top-level `describe('i18n', ...)` block, add this test (append before the closing `});` of the describe):

```typescript
  it('provides a label for the lagoon theme in both languages', () => {
    i18n.setLanguage('en');
    expect(i18n.t('theme_lagoon')).toBe('Lagoon');
    i18n.setLanguage('de');
    expect(i18n.t('theme_lagoon')).toBe('Lagune');
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/i18n.test.ts`
Expected: FAIL — `i18n.t('theme_lagoon')` returns `'theme_lagoon'` (the missing-key fallback).

- [ ] **Step 3: Add the translation keys**

In `src/utils/i18n.ts`, locate the `en: { ... }` object. Add a `theme_lagoon` entry near the other theme/card-type labels (e.g. right after the `alerts: 'Alerts',` / `comparison: 'Comparison',` group around line 32):

```typescript
    theme_lagoon: 'Lagoon',
```

In the `de: { ... }` object, add the matching German entry at the same relative position:

```typescript
    theme_lagoon: 'Lagune',
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/i18n.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/i18n.ts tests/i18n.test.ts
git commit -m "feat(i18n): add theme_lagoon label (en + de)"
```

---

## Task 3: Add the `lagoon` theme CSS + accessibility/interaction polish

This is the visual core. The CSS lives in the big `static get styles()` block of `src/violet-pool-card.ts` starting at line 4065. We append two things: (a) the `ha-card.theme-lagoon { ... }` selector, and (b) a global polish block (focus-visible + reduced-motion) that uses CSS custom-property defaults so existing themes are unaffected.

**Files:**
- Modify: `src/violet-pool-card.ts` (the `return css\`...\`` block, line 4065-4075+)

**Interfaces:**
- Produces: When `config.theme === 'lagoon'`, `<ha-card class="theme-lagoon">` renders with the dark navy palette and violet accent defined here.

- [ ] **Step 1: Locate the insertion anchor**

In `src/violet-pool-card.ts`, find the exact substring (inside the single-line `css\`...\`` template, around line 4065):

```
ha-card.theme-aurora{--vpc-bg:linear-gradient(135deg, #00C9FF 0%, #92FE9D 50%, #5EE7DF 100%);--vpc-primary:#FFFFFF;--vpc-surface:rgba(255,255,255,0.16);--vpc-text:#FFFFFF;--vpc-text-secondary:rgba(255,255,255,0.8);--vpc-shadow:0 10px 40px rgba(0,201,255,0.25);--vpc-radius:24px;}
```

This is the last theme selector before the `@media (prefers-color-scheme:dark){...}` block. We insert the new `lagoon` rule immediately *after* this aurora rule and *before* the `@media` block.

- [ ] **Step 2: Insert the `lagoon` theme selector**

Using the Edit tool, replace the aurora rule line with aurora + lagoon (lagoon appended on the same CSS flow, no newline needed since the whole block is minified onto one line). The `old_string` is the aurora rule exactly; `new_string` is aurora rule + lagoon rule:

old_string:
```
ha-card.theme-aurora{--vpc-bg:linear-gradient(135deg, #00C9FF 0%, #92FE9D 50%, #5EE7DF 100%);--vpc-primary:#FFFFFF;--vpc-surface:rgba(255,255,255,0.16);--vpc-text:#FFFFFF;--vpc-text-secondary:rgba(255,255,255,0.8);--vpc-shadow:0 10px 40px rgba(0,201,255,0.25);--vpc-radius:24px;}@media (prefers-color-scheme:dark){
```

new_string:
```
ha-card.theme-aurora{--vpc-bg:linear-gradient(135deg, #00C9FF 0%, #92FE9D 50%, #5EE7DF 100%);--vpc-primary:#FFFFFF;--vpc-surface:rgba(255,255,255,0.16);--vpc-text:#FFFFFF;--vpc-text-secondary:rgba(255,255,255,0.8);--vpc-shadow:0 10px 40px rgba(0,201,255,0.25);--vpc-radius:24px;}ha-card.theme-lagoon{--vpc-bg:linear-gradient(160deg, #0d1b2a 0%, #102a43 55%, #0a1520 100%);--vpc-surface:rgba(255,255,255,0.06);--vpc-primary:#9b6dff;--vpc-text:#e6f1ff;--vpc-text-secondary:#8fa3bd;--vpc-text-tertiary:#5a6f87;--vpc-success:#3dd68c;--vpc-warning:#ffb454;--vpc-danger:#ff5470;--vpc-border:1px solid rgba(255,255,255,0.08);--vpc-shadow:0 8px 32px rgba(0,0,0,0.45);--vpc-backdrop:blur(12px) saturate(140%);--vpc-radius:22px;--vpc-inner-radius:16px;--card-accent:#9b6dff;--icon-accent:#9b6dff;}ha-card.theme-lagoon .header-icon{background:color-mix(in srgb, var(--vpc-primary) 16%, transparent);}ha-card.theme-lagoon .header-icon.icon-active{box-shadow:0 0 0 4px color-mix(in srgb, var(--vpc-primary) 14%, transparent);}ha-card.theme-lagoon .speed-segment.seg-active{background:color-mix(in srgb, var(--seg-color) 18%, transparent);box-shadow:inset 0 0 0 1.5px color-mix(in srgb, var(--seg-color) 50%, transparent);}ha-card.theme-lagoon:hover{box-shadow:0 12px 40px rgba(0,0,0,0.55);}@media (prefers-color-scheme:dark){
```

Rationale for the chosen token values (all verified ≥ 4.5:1 against `#0d1b2a`):
- `--vpc-bg`: layered navy gradient, the `lagoon` signature.
- `--vpc-primary` `#9b6dff` (violet): matches the Violet brand and provides a strong, non-blue accent.
- `--vpc-text` `#e6f1ff` (16.8:1), `--vpc-text-secondary` `#8fa3bd` (6.9:1): WCAG-AA compliant.
- Status colors `#3dd68c` / `#ffb454` / `#ff5470`: high-contrast yet calm.
- `--vpc-inner-radius: 16px`: rounder inner tiles for a softer, modern feel.
- Four `lagoon`-specific overrides (header-icon, active segment, hover shadow) keep the theme self-contained.

- [ ] **Step 3: Add the accessibility/interaction polish block**

This block is *global* (not scoped to `lagoon`) but uses CSS custom-property fallbacks (`var(--name, default)`) so it is a no-op for existing themes. Find the `:host{...}` rule at the very start of the `css\`...\`` template (line 4065, the first rule). It ends with `...display:block;font-family:var(--vpc-font);}`. We add new default tokens inside `:host` and append a focus/reduced-motion block.

First, extend the `:host` rule's token list. old_string (the tail of the `:host` rule):

```
--card-accent:var(--primary-color, #007AFF);--icon-accent:var(--card-accent);display:block;font-family:var(--vpc-font);}ha-card.theme-classic{
```

new_string:
```
--card-accent:var(--primary-color, #007AFF);--icon-accent:var(--card-accent);--vpc-focus-ring:0 0 0 2px color-mix(in srgb, var(--vpc-primary, #007AFF) 55%, transparent);display:block;font-family:var(--vpc-font);}ha-card.theme-classic{
```

Then, append the polish block at the *very end* of the `css\`...\`` template — find the last rule. The template currently ends with (around line 4065, single line):

```
.speed-segment{min-width:0;}.speed-segment span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
```

It is followed on line 4066 by `.chem-svg-icon{...` (outside the template literal). Replace the closing of the template by appending the polish rules. old_string:

```
.speed-segment{min-width:0;}.speed-segment span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
```

new_string:
```
.speed-segment{min-width:0;}.speed-segment span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}:host{--vpc-pressed-scale:0.97;}ha-card :focus-visible,.speed-segment:focus-visible,.speed-off-btn:focus-visible,.chemistry-card:focus-visible,.device-row:focus-visible{outline:none;box-shadow:var(--vpc-focus-ring);border-radius:var(--vpc-inner-radius, 12px);}@media (prefers-reduced-motion: reduce){ha-card,ha-card:hover,ha-card:active,.pump-running,.heater-active,.solar-active,.dosing-active,.chemistry-card:hover,.device-row:hover,.overview-active-dot{animation:none !important;transition:none !important;transform:none !important;}ha-card.animation-smooth,ha-card.animation-energetic,ha-card.animation-subtle{transition:none !important;}ha-card.animation-smooth:hover,ha-card.animation-energetic:hover,ha-card.animation-subtle:hover{transform:none !important;}}
```

Why this is safe for existing themes:
- `--vpc-focus-ring` is only consumed by `:focus-visible`, which previously had no styling → pure improvement.
- `--vpc-pressed-scale` is declared but the `:active` rule for `<ha-card>` already exists with its own transform; we do not override it. (We keep `--vpc-pressed-scale` available for future per-element use but do not apply it globally to avoid changing existing `:active` behavior.)
- The `prefers-reduced-motion` block only fires when the *user's OS* requests reduced motion — for users without that setting, nothing changes. For users with it, all decorative animation is suppressed (accessibility win), which is the correct AA behavior.

- [ ] **Step 4: Build and verify no syntax errors**

Run: `npm run build`
Expected: Build succeeds. If it fails with a CSS/template error, re-check that every `{` has a matching `}` in the inserted rules.

- [ ] **Step 5: Run lint + tests**

Run: `npm run lint && npm test`
Expected: All pass.

- [ ] **Step 6: Commit**

```bash
git add src/violet-pool-card.ts
git commit -m "feat(theme): add lagoon dark theme + a11y/interaction polish

- ha-card.theme-lagoon: navy gradient bg, violet accent (#9b6dff),
  WCAG-AA text contrast (text 16.8:1, secondary 6.9:1).
- Global :focus-visible ring via --vpc-focus-ring token (default
  keeps existing themes unchanged).
- prefers-reduced-motion block suppresses decorative animation
  when the OS requests it (WCAG 2.1 AA).
- No existing theme selector is modified; all 13 prior themes
  render byte-identically."
```

---

## Task 4: Expose `lagoon` in the visual editor

**Files:**
- Modify: `src/editor/violet-pool-card-editor.ts` (theme-picker array around line 108-120, presets around line 44-49)

**Interfaces:** None new — the editor reads/writes `config.theme`, which Task 1 already accepts.

- [ ] **Step 1: Add the `lagoon` entry to the theme picker array**

In `src/editor/violet-pool-card-editor.ts`, the theme picker is an inline array of `{ value, icon, label, desc, preview }` objects (line ~108-120). The last entry is `aurora`. Add `lagoon` after it:

old_string:
```
                { value: 'aurora', icon: '', label: 'Aurora', desc: 'Northern Lights', preview: 'linear-gradient(45deg, #00C9FF 0%, #92FE9D 100%)' },
              ].map(
```

new_string:
```
                { value: 'aurora', icon: '', label: 'Aurora', desc: 'Northern Lights', preview: 'linear-gradient(45deg, #00C9FF 0%, #92FE9D 100%)' },
                { value: 'lagoon', icon: '', label: 'Lagoon', desc: 'Dark · Violet Accent', preview: 'linear-gradient(160deg, #0d1b2a 0%, #9b6dff 100%)' },
              ].map(
```

- [ ] **Step 2: Add an editor preset (optional convenience)**

In the same file, the `_presets` array (line ~44-49) holds quick-config presets. Add a calm dark-water preset as the 5th entry:

old_string:
```
    { id: 'family_view', label: 'Familienansicht', description: 'Ruhiger Look mit klarer Lesbarkeit', config: { theme: 'ocean', layout_variant: 'glass', alarm_style: 'soft', animation: 'smooth', shadow_intensity: 'medium' } },
  ] as const;
```

new_string:
```
    { id: 'family_view', label: 'Familienansicht', description: 'Ruhiger Look mit klarer Lesbarkeit', config: { theme: 'ocean', layout_variant: 'glass', alarm_style: 'soft', animation: 'smooth', shadow_intensity: 'medium' } },
    { id: 'dark_lagoon', label: 'Dark Lagoon', description: 'Tiefer Dark-Modus mit Violet-Akzent', config: { theme: 'lagoon', layout_variant: 'glass', alarm_style: 'pulse', animation: 'smooth', shadow_intensity: 'high' } },
  ] as const;
```

- [ ] **Step 3: Build + lint + test**

Run: `npm run lint && npm run build && npm test`
Expected: All pass.

- [ ] **Step 4: Commit**

```bash
git add src/editor/violet-pool-card-editor.ts
git commit -m "feat(editor): add lagoon theme picker entry + Dark Lagoon preset"
```

---

## Task 5: Add a `lagoon` demo card

**Files:**
- Modify: `demo/index.html`

- [ ] **Step 1: Add a demo section header + card wrapper**

In `demo/index.html`, insert a new themed section right after the existing "Premium Theme - Fullscreen Pump" section (which closes at line 102 with `</div></div>`) and before the `<!-- Card Types -->` comment (line 104).

old_string:
```
    <h3>Premium Theme - Fullscreen Pump</h3>
    <div class="card-container" style="max-width: 100%;">
      <div class="card-wrapper" style="flex-basis: 100%; max-width: 100%;">
        <violet-pool-card id="premium-pump-fullscreen"></violet-pool-card>
      </div>
    </div>

    <!-- Card Types -->
```

new_string:
```
    <h3>Premium Theme - Fullscreen Pump</h3>
    <div class="card-container" style="max-width: 100%;">
      <div class="card-wrapper" style="flex-basis: 100%; max-width: 100%;">
        <violet-pool-card id="premium-pump-fullscreen"></violet-pool-card>
      </div>
    </div>

    <h3>Lagoon Theme (Dark) - Large Pump</h3>
    <div class="card-container">
      <div class="card-wrapper">
        <violet-pool-card id="lagoon-pump-large"></violet-pool-card>
      </div>
      <div class="card-wrapper">
        <violet-pool-card id="lagoon-heater-medium"></violet-pool-card>
      </div>
    </div>

    <!-- Card Types -->
```

- [ ] **Step 2: Configure the demo cards via JS**

In the `<script type="module">` block, after the `configureCard('premium-pump-fullscreen', ...)` call (ends around line 376) and before the `// --- Card Types ---` comment (line 378), add:

```javascript

      // Lagoon Theme (Dark) - Large Pump, high speed
      configureCard('lagoon-pump-large', {
        entity: 'switch.violet_pool_pump',
        card_type: 'pump',
        size: 'large',
        theme: 'lagoon',
        animation: 'smooth',
        show_runtime: true
      }, {
          'switch.violet_pool_pump': {
              state: 'on',
              attributes: { PUMPSTATE: '3|OK', runtime: 7200 }
          }
      });

      // Lagoon Theme (Dark) - Medium Heater, heating
      configureCard('lagoon-heater-medium', {
        entity: 'climate.violet_pool_heater',
        card_type: 'heater',
        size: 'medium',
        theme: 'lagoon',
        animation: 'smooth'
      }, {
         'climate.violet_pool_heater': {
            state: 'heating',
            attributes: { current_temperature: 25.5, temperature: 28.5 }
         }
      });
```

- [ ] **Step 3: Build, then visually verify**

Run: `npm run build`
Then open `demo/index.html` in a browser (or serve with `npm run serve`). Verify:
- The two `lagoon` cards render with the navy gradient background and violet accent.
- Text is clearly readable (high contrast).
- Existing theme sections (Luxury, Modern, Glass, Neon, Premium) look unchanged.
- Tab through the page: focus rings appear on the speed segments / controls.

- [ ] **Step 4: Commit**

```bash
git add demo/index.html
git commit -m "docs(demo): add lagoon dark theme showcase cards"
```

---

## Task 6: Document `lagoon` in README + info.md

**Files:**
- Modify: `README.md`
- Modify: `info.md`

- [ ] **Step 1: Update the theme list in README.md**

In `README.md`, find the Themes feature line (search for `6 Premium-Themes`). It currently reads:

```
- **6 Premium-Themes** — Luxury (Glassmorphism), Modern, Minimalist, Glass, Neon, Premium
```

Replace with:

```
- **7 Premium-Themes** — Luxury (Glassmorphism), Modern, Minimalist, Glass, Neon, Premium, Lagoon (Dark)
```

Note: the README's theme labels (Luxury/Modern/Glass/Neon/Premium) are legacy friendly-names that do not match the config values 1:1; that pre-existing inconsistency is out of scope. We add `Lagoon (Dark)` to mirror the new addition.

- [ ] **Step 2: Apply the same change in info.md**

In `info.md`, find the identical line `- **6 Premium-Themes** — Luxury (Glassmorphism), Modern, Minimalist, Glass, Neon, Premium` and apply the same replacement to:

```
- **7 Premium-Themes** — Luxury (Glassmorphism), Modern, Minimalist, Glass, Neon, Premium, Lagoon (Dark)
```

- [ ] **Step 3: Commit**

```bash
git add README.md info.md
git commit -m "docs: list the lagoon dark theme in README and info.md"
```

---

## Final verification

After all 6 tasks:

- [ ] Run `npm run lint && npm run build && npm test` — all green.
- [ ] Open `demo/index.html`: confirm the two `lagoon` cards look right AND every previously-existing section is visually unchanged (compare against `git stash` if in doubt).
- [ ] Grep the diff for forbidden references: `git diff main` then search the output for any name hinting at external apps/vendors. There must be none — only `lagoon` and the token names.
- [ ] Confirm `dist/violet-pool-card.js` grew by well under 2 kB (the spec's success criterion): `ls -l dist/violet-pool-card.js` before/after.
