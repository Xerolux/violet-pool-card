import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TRANSLATIONS, i18n } from '../src/utils/i18n';

/**
 * `i18n.t` gained placeholder support so a sentence carrying a value stays one
 * string per language. The alternative - splitting the sentence around the
 * value and concatenating the parts - only holds while every language keeps
 * the same word order, which is the assumption that breaks.
 */
describe('i18n.t placeholders', () => {
  it('fills a placeholder', () => {
    i18n.setLanguage('en');

    expect(i18n.t('backwash_desc', { duration: 5 })).toContain('5 min');
  });

  it('fills the same key in German', () => {
    i18n.setLanguage('de');

    expect(i18n.t('backwash_desc', { duration: 5 })).toContain('5 min');
    expect(i18n.t('backwash_desc', { duration: 5 })).toContain('Rückspülung');
  });

  it('fills every occurrence of a placeholder', () => {
    i18n.setLanguage('en');

    expect(i18n.t('heater_blocked_frost', { temp: 3.5, min: 5 })).toBe(
      'Heating blocked. The outside temperature (3.5 °C) is below the minimum of 5 °C. Frost protection active.'
    );
  });

  it('leaves an unfilled placeholder visible rather than printing undefined', () => {
    i18n.setLanguage('en');

    // A missing value should look wrong, not plausible.
    expect(i18n.t('backwash_desc', {})).toContain('{duration}');
    expect(i18n.t('backwash_desc', {})).not.toContain('undefined');
  });

  it('returns the plain text when no params are passed', () => {
    i18n.setLanguage('en');

    expect(i18n.t('level_low')).toBe('Level low');
  });

  it('falls back to English for a key the language lacks', () => {
    i18n.setLanguage('de');

    expect(i18n.t('level_low')).toBeTruthy();
  });
});

describe('translation tables', () => {
  it('has the same keys in both languages', () => {
    const en = Object.keys(TRANSLATIONS.en).sort();
    const de = Object.keys(TRANSLATIONS.de).sort();

    expect(de).toEqual(en);
  });

  it('has no empty translation', () => {
    for (const [lang, table] of Object.entries(TRANSLATIONS)) {
      for (const [key, value] of Object.entries(table)) {
        expect(value, `${lang}.${key}`).not.toBe('');
      }
    }
  });

  it('uses the same placeholders in both languages', () => {
    // A placeholder present in one language and missing in the other means the
    // value silently disappears for those users.
    const slots = (text: string) => (text.match(/\{(\w+)\}/g) ?? []).sort().join(',');
    const mismatches: string[] = [];

    for (const [key, en] of Object.entries(TRANSLATIONS.en)) {
      const de = (TRANSLATIONS.de as Record<string, string>)[key];
      if (de !== undefined && slots(en) !== slots(de)) {
        mismatches.push(`${key}: en {${slots(en)}} vs de {${slots(de)}}`);
      }
    }

    expect(mismatches).toEqual([]);
  });

  it('leaves no user-facing German outside this table', () => {
    // The whole point of the refactor: strings the user reads live in i18n.ts,
    // so an English installation is actually English.
    const german = /[äöüßÄÖÜ]/;
    const comment = /^\s*(\/\/|\/\*|\*)/;
    const files = ['../src/violet-pool-card.ts', '../src/utils/severity-model.ts',
                   '../src/editor/violet-pool-card-editor.ts'];
    const offenders: string[] = [];

    for (const file of files) {
      const text = readFileSync(new URL(file, import.meta.url), 'utf-8');
      text.split('\n').forEach((line, index) => {
        if (german.test(line) && !comment.test(line)) {
          offenders.push(`${file}:${index + 1}: ${line.trim().slice(0, 80)}`);
        }
      });
    }

    expect(offenders).toEqual([]);
  });
});
