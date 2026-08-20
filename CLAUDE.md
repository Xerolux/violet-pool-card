# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

`violet-pool-card` is a custom Lovelace card for Home Assistant that displays
and controls a Violet Pool Controller. It reads its entities from the
[violet-hass](https://github.com/Xerolux/violet-hass) integration and is
distributed through HACS as a single built file, `dist/violet-pool-card.js`.

## Commands

```bash
npm run build          # bundle to dist/violet-pool-card.js (committed - HACS ships it)
npm run build:info     # regenerate info.md
npm test               # vitest
npm run lint           # eslint
npx tsc --noEmit       # typecheck
npm run keys:update    # refresh tests/fixtures/integration-entity-keys.json
```

## Language Policy

**Everything written into this repository is English.** This is binding, not a
preference:

| Artifact | Language |
|---|---|
| `CHANGELOG.md` — including the section that becomes the release page | English |
| Release notes and any text the release workflows emit | English |
| Commit messages, branch names, PR titles and PR bodies | English |
| Code comments, JSDoc, file headers | English |
| `README.md`, `CLAUDE.md`, `QUICK_REFERENCE.md` and the other top-level docs | English |
| Workflow files | English |
| Test names and test descriptions | English |

**The exception: text the user reads in the card.**

The card is bilingual. Anything rendered in the UI belongs in
`src/utils/i18n.ts`, which holds a German and an English table - `de.json`-style
localisation, in TypeScript. Those German strings are the product, not prose
about the product, and they stay German.

The distinction that matters:

```ts
/** Rates a reading against its target range. */   // <- comment: English
label: 'Filterpumpe',                              // <- UI string: i18n, may be German
```

Every user-facing string goes through `i18n.t()`. A sentence carrying a value
uses placeholders - `i18n.t('backwash_desc', { duration })` - rather than being
split around the value and concatenated: that only works while every language
keeps the same word order. `tests/i18n-params.test.ts` fails if German text
reappears outside `i18n.ts`, if the two tables drift apart, or if a placeholder
exists in one language and not the other.

**Why it is written down:** the card is published on HACS and read by people
who do not speak German. A German comment or changelog entry excludes them from
contributing, and the changelog is worse than that - `release-card.yml` lifts a
version's changelog section verbatim onto the GitHub release page, so it is
what every user sees on the release.

Changelog entries up to and including **0.4.1** were written in German before
this policy existed and are kept as published; every entry from 0.4.2 onwards
is English.

## Release Workflow

`CHANGELOG.md` is a **source file**, not a workflow output. `release-card.yml`
extracts the section for the version being tagged and publishes it as the
release notes; a version with no changelog section fails the release rather
than publishing placeholder text. Write the entry before tagging.

## Entity Resolution

The card resolves entities through the Home Assistant entity registry
(`hass.entities`), matching the integration's `platform` and `translation_key`
rather than guessing entity ids from a prefix - see `src/utils/entity-registry.ts`.
`tests/fixtures/integration-entity-keys.json` is a copy of the integration's
keys; CI refreshes it before the tests, so a rename in the integration turns
this repository red instead of silently breaking entity lookup.
