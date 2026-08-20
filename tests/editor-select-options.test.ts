import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  ALARM_STYLE_OPTIONS,
  ACCESSIBILITY_OPTIONS,
  ALERT_LEVEL_OPTIONS,
  CARD_TYPE_OPTIONS,
  CHEMISTRY_TYPE_OPTIONS,
  DASHBOARD_MODE_OPTIONS,
  DOSING_TYPE_OPTIONS,
  LAYOUT_VARIANT_OPTIONS,
  SHADOW_INTENSITY_OPTIONS,
  selectedValue,
  type SelectOption,
} from '../src/editor/select-options';

const ALL_TABLES: Record<string, SelectOption[]> = {
  ALARM_STYLE_OPTIONS,
  ACCESSIBILITY_OPTIONS,
  ALERT_LEVEL_OPTIONS,
  CARD_TYPE_OPTIONS,
  CHEMISTRY_TYPE_OPTIONS,
  DASHBOARD_MODE_OPTIONS,
  DOSING_TYPE_OPTIONS,
  LAYOUT_VARIANT_OPTIONS,
  SHADOW_INTENSITY_OPTIONS,
};

describe('selectedValue', () => {
  it('reads the value the current ha-select reports', () => {
    // Home Assistant's rewritten ha-select fires selected with detail.value.
    const event = new CustomEvent('selected', { detail: { value: 'pump' } });
    expect(selectedValue(event)).toBe('pump');
  });

  it('falls back to the element value of the older ha-select', () => {
    // The Material-Web based one only updated its own value property and put
    // the list index into the detail.
    const event = new CustomEvent('selected', { detail: { index: 3 } });
    Object.defineProperty(event, 'target', { value: { value: 'heater' } });
    expect(selectedValue(event)).toBe('heater');
  });

  it('stringifies a numeric value', () => {
    const event = new CustomEvent('selected', { detail: { value: 2 } });
    expect(selectedValue(event)).toBe('2');
  });

  it('returns undefined when nothing was picked', () => {
    const event = new CustomEvent('selected', { detail: {} });
    Object.defineProperty(event, 'target', { value: { value: undefined } });
    expect(selectedValue(event)).toBeUndefined();
  });
});

describe('option tables', () => {
  it.each(Object.entries(ALL_TABLES))('%s has unique, labelled entries', (_name, options) => {
    const values = options.map((option) => option.value);
    expect(new Set(values).size).toBe(values.length);
    for (const option of options) {
      expect(option.label.trim()).not.toBe('');
    }
  });
});

describe('CARD_TYPE_OPTIONS', () => {
  /** Card types the card actually renders, read from its render switch. */
  const supported = (): string[] => {
    const source = readFileSync(new URL('../src/violet-pool-card.ts', import.meta.url), 'utf-8');
    const body = source.slice(source.indexOf('switch (this.config.card_type)'));
    const block = body.slice(0, body.indexOf('default:'));
    return [...block.matchAll(/case '([a-z_]+)':/g)].map((match) => match[1]);
  };

  it('offers every card type the card can render', () => {
    // A card type missing here could only be reached by hand-editing YAML -
    // which is how a user ended up with "unknown card type" (forum, 0.4.0).
    const missing = supported().filter(
      (type) => !CARD_TYPE_OPTIONS.some((option) => option.value === type)
    );
    expect(missing).toEqual([]);
  });

  it('is what the documentation tells people to use', () => {
    // A README example naming a card type the card never had renders as
    // "unknown card type" in the dashboard - which is what a user hit.
    //
    // The first version of this test only scanned four files for `card_type:`
    // YAML syntax. That missed two things at once: README.md listed five
    // non-existent types in a numbered prose list, and dashboard_config.yaml
    // and dashboard.yaml - the dashboards people copy - used them in real
    // YAML. Both slipped through green. So: every markdown and YAML file in
    // the repository, and both spellings.
    const offered = CARD_TYPE_OPTIONS.map((option) => option.value);
    const undocumented: string[] = [];
    const root = fileURLToPath(new URL('..', import.meta.url));

    const docs = (dir: string): string[] => {
      const out: string[] = [];
      for (const name of readdirSync(join(root, dir))) {
        if (['node_modules', '.git', 'dist', 'CHANGELOG.md', 'RELEASE_NOTES.md'].includes(name)) {
          continue;
        }
        const rel = join(dir, name);
        if (statSync(join(root, rel)).isDirectory()) out.push(...docs(rel));
        else if (/\.(md|ya?ml)$/.test(name)) out.push(rel);
      }
      return out;
    };

    for (const file of docs('.')) {
      const text = readFileSync(join(root, file), 'utf-8');
      // `card_type: pump` in a YAML example ...
      for (const match of text.matchAll(/card_type:\s*([a-z_]+)/g)) {
        if (!offered.includes(match[1])) undocumented.push(`${file}: card_type: ${match[1]}`);
      }
      // ... and "**Pump** (`pump`)" in a prose list of card types.
      for (const match of text.matchAll(/^\d+\.\s+\*\*[^*]+\*\*\s+\(`([a-z_]+)`\)/gm)) {
        if (!offered.includes(match[1])) undocumented.push(`${file}: listed as ${match[1]}`);
      }
    }

    expect(undocumented).toEqual([]);
  });

  it('offers nothing the card cannot render', () => {
    const known = supported();
    const unknown = CARD_TYPE_OPTIONS.map((option) => option.value).filter(
      (value) => !known.includes(value)
    );
    expect(unknown).toEqual([]);
  });
});
