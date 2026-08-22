import { readFileSync, readdirSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TRANSLATIONS, i18n } from '../src/utils/i18n';

/**
 * German that is not a German *string*: values the controller's HTTP API
 * uses. `smart_dosing` takes the English names and translates them to these
 * itself, so they are protocol, not prose.
 */
const PROTOCOL_VALUES = new Set(['Chlor', 'Flockmittel', 'Elektrolyse']);

/** German words that are not also English words, plus the umlaut-free spellings. */
const GERMAN_WORDS = [
  'der', 'das', 'den', 'dem', 'des', 'und', 'ist', 'sind', 'eine', 'einen',
  'einem', 'nicht', 'oder', 'ohne', 'damit', 'kann', 'koennen', 'muss', 'soll',
  'wenn', 'weil', 'diese', 'dieser', 'keine', 'kein', 'nur', 'noch', 'auch',
  'aber', 'sich', 'durch', 'bei', 'vor', 'nach', 'zwischen', 'waehrend',
  'fuer', 'ueber', 'unter', 'pruefen', 'starten', 'stoppen', 'aktuell',
  'niedrig', 'hoch', 'erhoeht', 'haeufig', 'moeglich', 'Modus', 'Leistung',
  'Wert', 'Werte', 'Zeit', 'Dauer', 'Menge', 'Stufe', 'Betrieb', 'Anlage',
  'Becken', 'Wasser', 'Heizung', 'Abdeckung', 'Beleuchtung', 'Dosierung',
  'Kanister', 'Durchfluss', 'Druck', 'Wartung', 'Reinigung', 'Fehler',
  'Warnung', 'Zustand', 'Verbrauch', 'Laufzeit', 'Filterdruck', 'Sollwert',
  'Sollbereich', 'Zielbereich', 'Trend',
];

const GERMAN = new RegExp(`\\b(${GERMAN_WORDS.join('|')})\\b`);
const UMLAUT = /[äöüßÄÖÜ]/;
const COMMENT = /^\s*(\/\/|\/\*|\*)/;

/** True when a piece of text reads as German rather than as English or an id. */
const isGerman = (text: string): boolean =>
  !PROTOCOL_VALUES.has(text.trim()) && (UMLAUT.test(text) || GERMAN.test(text));

/**
 * The parts of a line a user could end up reading: quoted strings, and the
 * text between two tags of a lit template. Identifier-shaped strings - entity
 * ids, css classes, icon names - are left out.
 */
const userFacingText = (line: string): string[] => {
  const found: string[] = [];
  for (const match of line.matchAll(/'([^'\\]{2,})'|"([^"\\]{2,})"/g)) {
    const text = match[1] ?? match[2];
    if (text && !/^[a-z0-9_.:#/\- ]+$/.test(text)) found.push(text);
  }
  for (const match of line.matchAll(/>([^<>{}`$]{3,})</g)) found.push(match[1].trim());
  return found;
};

/** Every TypeScript file of the card, relative to this test. */
const sourceFiles = (dir = '../src'): string[] => {
  const out: string[] = [];
  for (const name of readdirSync(new URL(dir, import.meta.url))) {
    const entry = `${dir}/${name}`;
    if (statSync(new URL(entry, import.meta.url)).isDirectory()) {
      out.push(...sourceFiles(entry));
    } else if (name.endsWith('.ts')) {
      out.push(entry);
    }
  }
  return out;
};


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
    //
    // This used to look at three files for umlauts alone, which let a lot
    // through: `Modus`, `Leistung`, `Stoppen`, `ORP unter Zielbereich` carry
    // none - and someone had already written `Hauefige ... koennen` and
    // `Fuer Boost-Betrieb`, umlauts spelled out, which passed the check while
    // being exactly what it exists to stop. It reads every source file now,
    // and it knows the transliterations.
    const offenders: string[] = [];

    for (const file of sourceFiles()) {
      if (file.endsWith('utils/i18n.ts')) continue;
      readFileSync(new URL(file, import.meta.url), 'utf-8')
        .split('\n')
        .forEach((line, index) => {
          if (COMMENT.test(line)) return;
          const german = userFacingText(line).filter(isGerman);
          if (german.length) {
            offenders.push(`${file}:${index + 1}: ${german.join(' | ')}`);
          }
        });
    }

    expect(offenders).toEqual([]);
  });
});
