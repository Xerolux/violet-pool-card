import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * The release workflow lifts this file's section for the version being tagged
 * and publishes it as the release notes. v0.4.1 showed what happens when
 * nothing enforces that: the old workflow grepped commit subjects for keywords
 * instead, dropped the one commit that carried the release, and filled the
 * empty category with "Enhanced Violet Pool Card functionality".
 */
const changelog = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf-8');
const version: string = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf-8')
).version;

/** Return the changelog body for one version, exactly as the workflow cuts it. */
const section = (wanted: string): string | undefined => {
  const lines = changelog.split('\n');
  const start = lines.findIndex((line) => line.startsWith(`## [${wanted}]`));
  if (start === -1) return undefined;
  const rest = lines.slice(start + 1);
  const nextHeading = rest.findIndex((line) => line.startsWith('## '));
  return (nextHeading === -1 ? rest : rest.slice(0, nextHeading)).join('\n').trim();
};

describe('CHANGELOG.md', () => {
  it(`has a section for the current version (${version})`, () => {
    expect(section(version)).toBeDefined();
  });

  it('says something in that section', () => {
    expect(section(version)?.replace(/[-\s]/g, '')).not.toBe('');
  });

  it('dates the section', () => {
    const heading = changelog
      .split(/\r?\n/)
      .find((line) => line.startsWith(`## [${version}]`));

    expect(heading).toMatch(/^## \[[^\]]+\] - \d{4}-\d{2}-\d{2}$/);
  });

  it('carries none of the filler the old generator invented', () => {
    // These strings only ever appeared because a keyword category came back
    // empty - they describe nothing and must not reach a release page.
    for (const filler of [
      'Enhanced Violet Pool Card functionality',
      'Performance improvements and code optimizations',
      'Minor bug fixes and stability improvements',
    ]) {
      expect(changelog).not.toContain(filler);
    }
  });

  it('keeps the installation boilerplate out of the history', () => {
    // The workflow appends it to every release page; repeating it per entry
    // buried the actual changes under ~50 lines of furniture each time.
    expect(changelog).not.toContain('Open HACS in Home Assistant');
  });
});
