import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Everything written into this repository is English. The policy lives in
 * CLAUDE.md; this file is what makes it hold.
 *
 * The exception is deliberate and narrow: the strings the user reads in the
 * card live in `src/utils/i18n.ts`, which is the localisation itself and
 * carries a German table by design.
 */

const REPO = fileURLToPath(new URL('..', import.meta.url));

/** The localisation table - German there is the point. */
const I18N = 'src/utils/i18n.ts';

/**
 * German function words that are not also English words. Deliberately not
 * "die", "was", "man" or "in": those collide with English or with identifiers.
 */
const GERMAN = new RegExp(
  `\\b(${[
    'der', 'das', 'den', 'dem', 'des', 'und', 'ist', 'sind', 'eine', 'einen',
    'einem', 'nicht', 'für', 'über', 'wird', 'werden', 'wenn', 'dass', 'zum',
    'zur', 'auch', 'aber', 'sich', 'noch', 'durch', 'ohne', 'damit', 'jeder',
    'kann', 'muss', 'soll', 'sollte', 'weil', 'diese', 'dieser', 'keine',
  ].join('|')})\\b`,
  'i'
);

/** A line that is a comment rather than code or a string. */
const COMMENT = /^\s*(\/\/|\/\*|\*)/;

const sourceFiles = (dir: string): string[] => {
  const out: string[] = [];
  for (const name of readdirSync(join(REPO, dir))) {
    const rel = join(dir, name);
    if (statSync(join(REPO, rel)).isDirectory()) {
      out.push(...sourceFiles(rel));
    } else if (/\.(ts|mjs)$/.test(name)) {
      out.push(rel);
    }
  }
  return out;
};

const codeFiles = [...sourceFiles('src'), ...sourceFiles('scripts')].filter(
  (file) => relative(I18N, file) !== ''
);

describe('language policy', () => {
  it.each(codeFiles)('%s has no German comments', (file) => {
    const offenders = readFileSync(join(REPO, file), 'utf-8')
      .split('\n')
      .map((line, index) => ({ line, number: index + 1 }))
      .filter(({ line }) => COMMENT.test(line) && GERMAN.test(line))
      .map(({ line, number }) => `${file}:${number}: ${line.trim()}`);

    expect(offenders).toEqual([]);
  });

  it('keeps the German UI strings, because that is the localisation', () => {
    // The exemption is the point, not an oversight: "translating" i18n.ts
    // would leave German users with an English card.
    const i18n = readFileSync(join(REPO, I18N), 'utf-8');

    expect(i18n).toContain("pump: 'Pumpe'");
  });

  it('has an English changelog header', () => {
    const header = readFileSync(join(REPO, 'CHANGELOG.md'), 'utf-8').split('## [')[0];

    expect(header).toContain('written in English');
  });

  it('emits English release-page boilerplate', () => {
    const workflow = readFileSync(join(REPO, '.github/workflows/release-card.yml'), 'utf-8');

    for (const german of ['Diese Karte entsteht', 'Unterstützung']) {
      expect(workflow).not.toContain(german);
    }
  });

  it('writes the policy down', () => {
    expect(readFileSync(join(REPO, 'CLAUDE.md'), 'utf-8')).toContain('## Language Policy');
  });
});
