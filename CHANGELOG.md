# Changelog

All notable changes to this project will be documented in this file.
This changelog is written in English (see the language policy in
[CLAUDE.md](./CLAUDE.md)). The section for a version becomes the text of its
GitHub release page automatically — what is not written here is not told to
anyone there either.

> **Historical note:** entries up to and including 0.4.1 were written in
> German, before the language policy existed. They are kept as published.

## [0.5.3] - 2026-08-22

### 🐛 Bug Fixes

- **`dosing_type` only ever named one working channel.** Reported on the forum
  for 0.5.2: setting it produced nothing but an error. Two of the four channels
  had no entry in the card's slot table, so for `ph_plus` and `flocculant` the
  entity registry was never asked at all - the card guessed a German id
  (`switch.…_dosierung_ph_plus`), found nothing, and rendered "entity not
  found" whatever the installation had. All four channels resolve through the
  registry now, and a test derives them from the integration's own channel
  list, so a fifth channel cannot be added on one side only.

- **The dosing card showed `0` where the state belongs.** The dosing switches
  are disabled by default, so since 0.5.2 the card shows the channel's sensor
  instead - and that sensor passes the controller's numeric state code through
  unchanged. Comparing it with `on` made every stand-in card report its output
  as off. The codes are now read as the integration reads them (0 standby,
  1 active, 2 blocked, 3 priority on, 4 manual on, 5 emergency off, 6 manual
  off), in the backwash card as well.

- **`24 h` said `n/a`, and the card never saw itself dosing.** The volume dosed
  today and the channel status are attributes of the *switch*; the sensor
  standing in for it has none. Both are read from the channel's own sensors
  (`dos_*_daily`, `dos_*_state`) when the switch is not there. The "is it
  dosing" check looked for a state spelled `ACTIVE`, which the controller never
  sends - it sends `DOSING` and `MANUAL_DOSING`, and the integration publishes
  them as `Dosing` and `Manual Dosing`. So the running indicator, the blocked
  alert and the "dosing now" hint never once fired.

- **An unknown `dosing_type` is rejected with a message that names the four
  values.** The reporter's configuration was `dosing_type: ph_minus | ph_plus |
  flocculant`, which YAML reads as one string rather than a choice of three.
  That value used to be carried through the whole render: it matched no
  channel, translated to nothing, and left the card half drawn.

## [0.5.2] - 2026-08-22

> **This is 0.5.1, released from the commit that contains it.** The v0.5.1
> tag was pushed before these fixes were merged, so it points at a commit
> that does not have them - the file published under it was built from a
> later checkout and is correct, but the tag does not lead there. 0.5.2 is
> the same card with tag, source and asset in agreement. Coming from 0.5.1
> there is nothing new to install; coming from 0.5.0 the entries below are.

### 🐛 Bug Fixes

- **The dosing, backwash and refill cards looked for a switch that is disabled
  by default.** Reported on the forum for 0.5.0: the dosing card said it wanted
  `switch.violet_pool_controller_chlor_dosierung`, and no
  `switch.…_chlorine_dosing` existed either. Both observations were right, for
  two separate reasons.

  The integration creates `DOS_1_CL`, `DOS_4_PHM`, `DOS_5_PHP`, `DOS_6_FLOC`,
  `BACKWASH` and `REFILL` with `entity_registry_enabled_default: False`. Unless
  someone enables them by hand they carry no state, and Home Assistant does not
  hand a disabled entity to a card at all - so the registry lookup found
  nothing and the card fell back to a guessed id. Each of those switches has an
  **enabled sensor** under the same translation key, so the cards now fall back
  to it: the state is shown, the control buttons are hidden, and a note names
  the disabled switch and how to enable it.

- **`EntityHelper.findEntityId` invented an id when nothing matched.** Its last
  step built `domain.prefix_suffix` from the first suffix, so a lookup that
  found nothing still answered with a German id - the same failure one layer
  down. It reports nothing now, and the test that expected exactly that passes.

- **The guessed id was the old German spelling.** The German suffixes are index
  keys into the card's slot table, not entity ids, but on a failed lookup the
  card built one literally - sending people to look for an entity that has not
  existed since 2.5.0. Every slot now carries the id the integration produces
  today, and that is what a fallback names. A test derives all 25 of them from
  the integration's own English names, so a rename over there turns this
  repository red.

### ✨ Features

- **Live entity discovery covers more controllers.** The slot table gained
  aliases for installations whose entities carry other German spellings
  (`poolwasser`, `orp_wert`, `sonnenkollektor`, `pool_heizer`, `solar_heizer`,
  `pool_abdeckung`, `durchfluss` and the four canister readings), and the four
  canister cards resolve their sensor from the card type alone.
- **Calibration, error and update cards discover their own entities** through
  the entity helper, instead of being told which to use.

### 🧪 Tests

- 287 → 295, and the suite is green again: `main` carried three failures - two
  because the version was bumped to 0.5.1 without a changelog section, one
  because `findEntityId` constructed an id instead of reporting that nothing
  matched.

  The disabled-switch case is pinned in both directions (switch present, switch
  missing, switch registered but stateless), and every slot's fallback id is
  checked against the integration's English names, which the key-refresh script
  now records alongside the keys.

### 🔧 Maintenance

- `brace-expansion` 1.1.13 → 1.1.18, a development dependency pulled in
  through the toolchain. Nothing the card ships changes.

---

## [0.5.0] - 2026-08-22

### ✨ Features

- **The chemistry card can show the water balance.** Requested on the forum:
  "CSI bzw. LSI". What it computes is the **Langelier** index, in its classic
  continuous form, and the card says so - the Calcite Saturation Index used by
  some pool calculators additionally models ionic strength and activity
  coefficients, and labelling one as the other would be misleading about a
  number people dose their pool by. Enable it with `show_saturation_index: true`
  or the switch in the card editor.

  The controller measures pH and water temperature. Calcium hardness and
  alkalinity come from a test kit, so they are configured - each field takes
  either a number or the id of an entity holding one, so an `input_number`
  helper can carry the last test result:

  ```yaml
  type: custom:violet-pool-card
  card_type: chemical
  show_saturation_index: true
  calcium_hardness: 300            # ppm CaCO3, or input_number.pool_calcium
  total_alkalinity: input_number.pool_alkalinity
  cyanuric_acid: 40                # optional
  total_dissolved_solids: 1000     # optional, this is the default
  ```

  Cyanuric acid is optional and corrects the alkalinity when given: a
  stabilised pool's alkalinity reading includes cyanurate, which does not
  buffer like carbonate. An input that is missing is **named** rather than
  assumed - an index computed from a guessed hardness would look authoritative
  and be wrong.

- **The details card proposes a list when none is configured.** It used to
  refuse to render without `entities:`, which left no clue what belonged in it.
  It now falls back to the readings and outputs the installation actually has -
  water temperature, pH, ORP, chlorine, filter pressure, flow, pump, backwash,
  dosing, light, heater, solar, cover - resolved through the entity registry, so
  a pool without solar or without a cover simply lists fewer rows. An explicit
  `entities:` list still wins.

### 🌍 Language

- The chemistry card's remaining hard-coded German strings (`pH-Wert`,
  `Redoxwert`, `… Werte ausserhalb`, the thresholds hint) now go through the
  translation table, per the language policy.

### 🧪 Tests

- 243 → 276. `tests/saturation-index.test.ts` pins the formula against the
  textbook balanced pool worked through by hand (pH 7.5, 25 °C, 300 ppm
  hardness, 100 ppm alkalinity → LSI ≈ 0.00), checks which way each input moves
  the index, and asserts that missing inputs are reported rather than defaulted.
  The details-card default list is pinned against the registry.

---

## [0.4.6] - 2026-08-21

### 🐛 Bug Fixes

- **The dosing card showed the wrong channel.** Reported on the forum after
  0.4.5: the pump card finds its entities now, the dosing card does not. The
  card decided which channel it was showing by searching the entity id for
  `_cl`, `_phm`, `_php` and `_floc` - the integration's translation keys, which
  never appear in an entity id. Since 2.5.0 the ids come from the English names
  (`switch.…_chlorine_dosing`, `switch.…_dosing_ph_minus`), so three of the four
  channels fell through to the `chlorine` default: a pH card read the ORP
  sensor, showed it in mV, judged it against the ORP thresholds and pointed its
  controls at the ORP setpoint. The channel now comes from the registry's
  `translation_key`; matching the id remains only for entities the registry
  cannot explain, and covers the English and the old German spellings.
- **`card_type: dosing` could only ever show chlorine.** The card type resolved
  the chlorine switch and nothing else, so any other channel had to be reached
  by naming the entity by hand. `dosing_type: ph_minus | ph_plus | flocculant`
  now resolves that channel's switch itself.
- **A missing dosing entity showed an endless loading skeleton.** The card
  rendered the shimmer placeholder for ever instead of saying what it could not
  find - which is what "the card is completely broken" looks like when a dosing
  channel is not configured. It now reports the entity it looked for, like the
  backwash and refill cards already did.

### 🌍 Language

- The dosing card's remaining hard-coded German labels (`Typ`, `Soll`,
  `ORP – Chlorwirksamkeit`, `pH-Wert`, …) and the refill and PV cards' German
  error messages now go through the translation table, per the language policy.

### 🧪 Tests

- 225 → 243. `tests/dosing-type.test.ts` pins every channel against the entity
  ids the integration really creates, both current and legacy, and asserts that
  an unrecognised entity returns nothing rather than guessing a channel.

---

## [0.4.5] - 2026-08-21

### 🐛 Bug Fixes

- **The example dashboards named entities that no longer exist.** Every id in
  `dashboard.yaml`, `dashboard_config.yaml`, `VIOLET_CARD_EXAMPLES.yaml`,
  README.md and `info.md` used the old German spelling -
  `sensor.…_beckenwasser`, `switch.…_filterpumpe`, `climate.…_heizung`. The
  integration derives its ids from the English names since 2.5.0, so anyone
  copying a dashboard into a current installation got cards pointing at
  nothing. 322 ids rewritten, resolved from the integration's own English
  translations rather than guessed.
- Two of them could not be resolved mechanically: the German names for pH plus
  and pH minus differ only by a character that slugifies away, so both
  collapsed to `dosierung_ph` and Home Assistant appended `_2` to whichever
  came second. That is where the old `dosierung_ph_2` came from. The examples
  label them, so they are now `dosing_ph_plus` and `dosing_ph_minus`.

### 🧪 Tests

- 208 → 224. Every markdown and YAML file is checked for German entity ids, so
  an example cannot drift back to a spelling the integration stopped using.

---

## [0.4.4] - 2026-08-21

Reported on the forum after 0.4.3: only the overview card worked, the pump card
showed the pump as off while it was running, and the dosing card was broken.
Two separate causes.

### 🐛 Bug Fixes

- **The dosing card crashed, and every control on the equipment cards was
  dead.** 0.4.3 made the entity optional and resolved it for *display*, but
  roughly twenty other places still read the unresolved `config.entity`,
  including every service call. With no entity configured - now the normal
  case - `_detectDosingType(undefined)` threw, and the pump, heater and solar
  buttons called their services with `undefined`. Each card resolves its
  entity id once now and uses that everywhere.
- **A running pump was drawn as "OFF".** The card read raw controller keys off
  the entity (`PUMPSTATE`, `PUMP_RPM_0..3`, `DOS_*_STATE`), but the
  integration does not pass those through - it publishes its own attributes:
  `pump_speed_level`, `mode`, `dosing_status`, `daily_amount_ml`. Every one of
  those reads came back undefined, so the speed fell back to 0. The card reads
  the integration's attributes now and keeps the raw keys as a fallback.
- **The daily runtime always showed 0.** The controller delivers
  `"04h 33m 12s"` and the integration passes the string through; the card did
  `Number(...) / 3600`, which is `NaN`. That format, `HH:MM:SS` and plain
  seconds are all parsed now.
- The "entity not found" message named the configured entity, which is empty
  when the card resolved one itself. It names the id actually looked up.

### 🧪 Tests

- 190 → 208. `src/utils/integration-attributes.ts` is covered against fixtures
  taken from what the integration's switch platform really publishes, so the
  contract between the two repositories is pinned on this side: a running pump
  must not read as level 0, `"04h 33m 12s"` must be 16392 seconds, and a
  reported level of 0 stays distinct from "no level reported".

---

## [0.4.3] - 2026-08-20

### 🐛 Bug Fixes

- **The pump card did not find its entities.** Reported on the forum right
  after 0.4.2: the card type selection worked and the overview card showed
  data, but the pump card came up empty. The registry lookup added in 0.4.1
  never reached it. Two things blocked it, and both had to go:
  - `setConfig()` threw *"You need to define an entity"* for every card type
    except six, so `card_type: pump` on its own was rejected before anything
    could be resolved. It now demands an entity only from the card type that
    genuinely cannot guess one - the generic `sensor` card.
  - `renderPumpCard()` read `config.entity` directly, as did the heater, solar,
    dosing, compact, sensor and flow-rate cards. They now go through the same
    registry resolution as the rest, so a renamed pump is found too.

  The README already promised that `card_type: pump` alone works. It does now.
- Seven card types that resolve their entities while rendering - `filter`,
  `backwash`, `refill`, `solar_surplus`, `inlet`, `counter_current` and the
  canisters - were rejected by the same `setConfig()` check before their
  renderer ever ran.
- **The visual editor asked for an entity on almost every card type.** It kept
  its own copy of "which card types need an entity" and its own domain filter,
  and both had drifted from the card - which is what made the automatic
  resolution look as if it only worked on the overview card. Both now come
  from the same table the card reads. Where a card type can resolve its own
  entity the picker is optional and says so; leaving it empty is the normal
  case.

### 🧪 Tests

- 181 → 190. `CARD_TYPE_MAIN_ENTITY` must cover the card types whose renderer
  reads the entity directly, every default must name a suffix the registry can
  actually resolve (the two deliberate exceptions are asserted by name), and
  the pump card must resolve both the standard id and a renamed one.
- Four tests guard the drift itself: the editor must read the shared tables,
  must not reintroduce a `needsEntity` list or a second domain filter, and the
  domain its picker offers must be the one the card resolves. Both bugs here
  had the same shape - two copies of one decision - so the copies are what the
  tests forbid.
- The language guard now also flags umlauts in comments and ignores quoted
  text. The word list alone had missed `diesem Präfix beginnen`, which is
  exactly the kind of line it exists to catch; quoting a German string in order
  to explain its removal is legitimate and no longer fails.

---

## [0.4.2] - 2026-08-20

The first entry written under the language policy - and the release where the
card finally speaks English to English users.

### 🐛 Bug Fixes

- **The card was German even on an English installation.** 98 user-facing
  strings were hardcoded in German in the render path - tooltips, status texts,
  recommendations, button labels, the colour picker, the threshold editor.
  Nothing translated them, so `i18n` never got a say. Every one of them now
  goes through the translation table.
- **Five card types the card does not have were still documented.**
  `statistics`, `weather`, `maintenance`, `alerts` and `comparison` were listed
  in README.md and, worse, used in `dashboard_config.yaml` and `dashboard.yaml`
  - the dashboards people copy into their own setup. Eleven cards across those
  two files rendered as "Unknown Card Type". They are gone, and the README card
  list is now built from the editor's own option table, so it lists the 29
  types that exist; six real ones had been missing from it (`overflow`,
  `error`, `digital_rules`, `calibration`, `update`, `diagnostics`).

### 🚀 Improvements

- **`i18n.t()` takes placeholders.** 34 of those strings carry a value, and a
  sentence split around its value only survives while every language keeps the
  same word order. `i18n.t('backwash_desc', { duration })` keeps it one string
  per language. An unfilled placeholder stays visible instead of rendering
  "undefined" - a missing value should look wrong, not plausible.
- English is binding for everything written into this repository; the rule and
  its one exception - the German table in `i18n.ts`, which *is* the
  localisation - are in the new `CLAUDE.md`.
- `CHANGELOG.md` is a source file now: the release workflow lifts this section
  onto the release page instead of generating text from commit subjects.

### 🧪 Tests

- 127 → 181. The new ones guard what silently rots: no German outside
  `i18n.ts`, both language tables holding the same keys, no empty translation,
  and the same placeholders on both sides - one present in only one language
  would drop the value for those users. The card-type check now walks every
  markdown and YAML file in the repository and matches both the `card_type:`
  key and the prose form, which is how the five phantom types slipped past it
  the first time.

---

## [0.4.1] - 2026-08-19

### 🔧 Bug Fixes | Fehlerbehebungen

- **Der Karten-Typ ließ sich im visuellen Editor nicht auswählen.** Home
  Assistant hat `<ha-select>` neu gebaut: das Element baut seine Liste jetzt aus
  einer `options`-Eigenschaft und zeigt eingebettete `<mwc-list-item>`-Einträge
  nur noch an, ohne sie auswählbar zu machen. Genau das war zu sehen — die
  Liste ging auf, klicken bewirkte nichts, und wer daraufhin `type:` im
  Code-Editor änderte, bekam „unknown card type". Alle neun Auswahlfelder des
  Editors liefern jetzt `options` mit und lesen den Wert aus beiden
  Event-Formaten, funktionieren also mit alter **und** neuer Oberfläche.
- **Vier Kartentypen fehlten im Editor** (`digital_rules`, `diagnostics`,
  `calibration`, `update`) — sie waren nur über YAML erreichbar.
- **Die Karte fand die Entitäten einer neu eingerichteten Anlage nicht.** Sie
  hat jede Entity-ID aus dem Präfix zusammengesetzt (`switch.<präfix>_filterpumpe`)
  — und zwar in der alten deutschen Schreibweise. Die Integration bildet ihre
  Entity-IDs seit 2.5.0 aus den englischen Namen, damit sie auf jeder
  Installation gleich heißen: aus `filterpumpe` wurde `filter_pump`, aus
  `beckenwasser` `pool_water`, aus `ph_wert` `ph_value`. Auf einer heute
  eingerichteten Anlage traf damit fast kein geratener Name mehr.
  Die Karte schlägt ihre Entitäten jetzt im Entitätsregister von Home Assistant
  nach (`hass.entities`): dort steht zu jeder Entität, von welcher Integration
  sie stammt und welchen sprachunabhängigen Schlüssel sie trägt. Damit findet
  die Karte sie unabhängig von Sprache, Umbenennung und Präfix — **alte
  Installationen eingeschlossen**, denn deren IDs stehen genauso im Register.
  Wo die Integration nichts Passendes führt, bleibt es beim bisherigen
  geratenen Namen; ein explizit gesetztes `entity:` hat weiterhin Vorrang.
  Umbenennen ändert daran nichts: Wer seine Filterpumpe „Hundepumpe" nennt oder
  ihr die Entity-ID `switch.hundepumpe` gibt, findet sie weiterhin in der
  Karte — Name und ID gehören dem Nutzer, der Schlüssel der Integration bleibt.
- **Fünf dokumentierte Kartentypen gab es gar nicht.** `statistics`, `weather`,
  `maintenance`, `alerts` und `comparison` standen in README, `info.md` und den
  YAML-Beispielen, führten aber zu „Unknown Card Type". Sie sind aus der
  Dokumentation entfernt; dafür sind die vier tatsächlich vorhandenen
  Diagnose-Karten dokumentiert.

### 📚 Dokumentation

- Die HACS-Installationsanleitung zeigte auf das falsche Repository (#74).

### 🧪 Tests

- **Die Schlüssel der Integration werden gegengeprüft.** `npm run keys:update`
  holt die Entitäts-Schlüssel aus dem Integrations-Repository nach
  `tests/fixtures/integration-entity-keys.json`; `npm test` prüft jeden Eintrag
  der Zuordnungstabelle dagegen — offline und ohne Netz. Ein eigener CI-Job
  liest die Liste vor den Tests neu ein: benennt die Integration einen
  Schlüssel um, wird die Karte hier rot, statt die Entität stillschweigend
  nicht mehr zu finden. Die CI führt jetzt außerdem überhaupt `npm test` aus —
  bisher liefen die Tests dort nicht.
- 33 neue Tests (88 → 121): beide Event-Formate von `ha-select`, eindeutige
  Einträge in allen Auswahllisten, ein Abgleich, dass Editor, Karte und
  Dokumentation dieselben Kartentypen kennen — sowie der Registry-Nachschlag
  mit mehreren Controllern, fremden Integrationen, fehlendem Register und den
  Endungen, für die es bewusst kein Gegenstück gibt.

---

## [0.4.0] - 2026-08-16

### ✨ New Features | Neue Funktionen

- **Konfigurierbare Grenzwerte** — die "optimalen" Bereiche der Wasserwerte sind nicht mehr fest verdrahtet.
  Über `thresholds` (YAML) oder den neuen Editor-Abschnitt **Grenzwerte** lassen sich `min`, `max`, eine
  Warn-Toleranz (`warn`), der Anzeigebereich (`range`) und ein `ignore`-Flag je Messgröße setzen —
  für `ph`, `orp`, `chlorine`, `salt`, `temperature`, `cyanuric_acid` und `alkalinity`.
- **Meldungsstufe `alerts`** — `all` (Standard), `warning`, `critical` oder `none`. Damit meldet die Karte
  nicht mehr jede kleine Abweichung, wenn das nicht gewünscht ist. Die Messwerte bleiben immer sichtbar.
- **Gauges zeigen jetzt den Wert** — pH- und Redox-Kachel stellen Zahlenwert, Einheit, Skalenenden und die
  Optimalzone dar, statt nur einer Nadel.

### 🐛 Bug Fixes | Fehlerbehebungen

- **SVG-Inhalte wurden im falschen Namespace erzeugt.** Verschachtelte Lit-Templates innerhalb von `<svg>`
  benutzten `html` statt `svg` — die entstandenen Elemente landeten im HTML-Namespace und wurden nie
  gerendert. Betroffen waren 32 Stellen: Gauge-Nadel, Wertbogen und Optimalzone, aber auch die animierten
  Details von Pumpe, Solar, Licht, Abdeckung, Kanistern und Diagnose-Icons.
- **Gauge-Bogen war mathematisch falsch.** Der Wertbogen wurde als Gerade statt entlang des Kreises
  berechnet, und ab der Skalenmitte kippte das SVG `large-arc-flag` auf 1, sodass der Bogen den langen Weg
  um den Kreis nahm. Beides ist korrigiert und durch Tests abgesichert.
- **Optimalzone verschwand hinter dem Wertbogen** — sie wird jetzt auf einem inneren Radius nach dem
  Wertbogen gezeichnet und bleibt dadurch immer sichtbar.
- **Statusfarbe und Statustext widersprachen sich.** Ein Redoxwert konnte als "Zu hoch" beschriftet und
  gleichzeitig grün eingefärbt sein, weil Text und Farbe aus zwei verschiedenen Regelwerken kamen. Beide
  stammen jetzt aus derselben Bewertung.
- **Alarme wurden doppelt angezeigt** — der Block "Alarme" und der Block "Empfehlungen" listeten dieselben
  Werte. Sie sind zu einem Panel zusammengefasst, das Befund und Handlungsempfehlung zusammen zeigt.
- **Kartentitel wurde vom Status-Badge überlagert.** Das Badge ist jetzt kompakt, Titel und Untertitel
  laufen sauber aus.
- **Filterdruck-Gauge**: Umfang war mit 240 statt 2π·40 ≈ 251 angenommen, wodurch der Bogen um ~5 %
  überzeichnete; der weiße Mittelkreis und die schwarze Beschriftung waren in dunklen Themes unlesbar.
  Negative Druckwerte werden jetzt geklemmt.
- **"Wasserqualität optimal"** wurde auch dann angezeigt, wenn Werte ausserhalb des Bereichs lagen und nur
  die Meldungen stummgeschaltet waren.
- **Karten-Vorschau im Card Picker** zeigte einen "Daten nicht verfügbar"-Fehler, weil die Stub-Konfiguration
  eine konkrete Entity voraussetzte. Sie startet jetzt mit der `overview`-Karte.
- Tote CSS-Keyframes `gauge-fill` entfernt (referenzierte eine nie gesetzte Variable `--gauge-dash`).

### 🎨 Design

- Neues Karten-Icon und Logo (violette Kachel mit Wassertropfen und Wellen), reproduzierbar erzeugt über
  `scripts/generate-brand-assets.py`. Enthält Light- und Dark-Varianten in 1x und 2x sowie die
  Repository-Assets `icon.png` und `logo.png` für HACS und README.
- Gauge-Track und Filterdruck-Gauge respektieren jetzt dunkle Themes über `--vpc-gauge-track`.
- Kompakteres Status-Badge; der Untertitel nennt stattdessen die Anzahl der Werte ausserhalb des Zielbereichs.

### 🧪 Tests

- Neue Suites `tests/thresholds.test.ts` (27 Tests) und `tests/chem-gauge.test.ts` (14 Tests):
  Grenzwert-Auflösung inkl. fehlerhafter Eingaben, Bewertung an den Bandgrenzen, Meldungsfilter,
  Gauge-Geometrie auf dem Kreis, `large-arc-flag`, Sichtbarkeit der Optimalzone.
- Gesamt: 88 Tests.

### 🧩 Compatibility

- Rein additiv — bestehende Konfigurationen funktionieren unverändert weiter und behalten die
  bisherigen Standardbereiche.
- `gaugeNeedleSVG()` bleibt als Wrapper um das neue `chemGaugeSVG()` erhalten (deprecated).

---

## [0.3.0] - 2026-07-18

### ✨ New Features | Neue Funktionen

- **New `lagoon` dark theme** — a calm, deep navy gradient (`#0d1b2a → #102a43`) with a violet accent (`#9b6dff`) that matches the Violet brand identity. All text colors meet WCAG 2.1 AA contrast (text 16.8:1, secondary 6.9:1, status colors 5.6–9.4:1).
- **New editor preset "Dark Lagoon"** — one-click dark setup with the lagoon theme, glass layout and high shadow intensity.

### 🚀 Improvements | Verbesserungen

- **Accessibility: focus-visible rings** on all interactive elements (speed segments, off button, chemistry cards, device rows, the card itself) via a new `--vpc-focus-ring` token.
- **Accessibility: `prefers-reduced-motion`** — decorative animations (pump rotation, heater/solar breathing, dosing pulse, active dot) and hover transforms are now suppressed when the OS requests reduced motion (WCAG 2.1 AA).
- **Editor** shows the new `lagoon` theme in the theme picker.
- **Demo page** (`demo/index.html`) gained two lagoon showcase cards (pump + heater).
- Added bilingual labels (`theme_lagoon`: Lagoon / Lagune).

### 🧩 Compatibility

- All 13 existing themes remain visually byte-identical — this release is purely additive.
- Bundle grows by ~2 kB.
- No config migrations required; existing card configs keep working unchanged.

---

## [0.2.2] - 2026-06-29

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.2.1 - Update changelog, version and info.md (f08beef)

---

## [0.2.1] - 2026-06-29

### ✨ New Features | Neue Funktionen

- feat: Add npm script to copy brand assets to dist (#72) (b093a3f)
- feat: Add Home Assistant Brands Proxy API integration (#71) (1de76d2)
- feat: Add system update card and component (f029bd1)
- feat: Add calibration status component and monitoring UI (786dca8)

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.2.0 - Update changelog, version and info.md (38cb2fd)
- update brands (98144b9)
- 📝 Release v0.1.9 - Update changelog, version and info.md (f6311a4)
- build: update auto-generated files [skip ci] (a7d1651)
- feat: Add system update card and component (f029bd1)
- build: update auto-generated files [skip ci] (3d1b6e1)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix: HA 2026.7 compatibility + bug fixes (e66d4c8)

---

## [0.2.0] - 2026-06-29

### ✨ New Features | Neue Funktionen

- feat: Add Home Assistant Brands Proxy API integration (#71) (1de76d2)

### 🚀 Improvements | Verbesserungen

- update brands (98144b9)
- 📝 Release v0.1.9 - Update changelog, version and info.md (f6311a4)

---

## [0.1.9] - 2026-06-29

### ✨ New Features | Neue Funktionen

- feat: Add system update card and component (f029bd1)
- feat: Add calibration status component and monitoring UI (786dca8)

### 🚀 Improvements | Verbesserungen

- build: update auto-generated files [skip ci] (a7d1651)
- feat: Add system update card and component (f029bd1)
- build: update auto-generated files [skip ci] (3d1b6e1)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix: HA 2026.7 compatibility + bug fixes (e66d4c8)

---

## [0.1.8] - 2026-06-14

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.1.7 - Update changelog, version and info.md (70569f3)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix: address review feedback on dialog Enter handling and i18n titles (3489975)
- fix: bugs, accessibility, i18n and mobile design improvements (33afaaf)

---

## [0.1.7] - 2026-05-22

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.1.6 - Update changelog, version and info.md (0d9fc82)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix: bugs, dependency updates, and type-safety improvements (d78f146)

---

## [0.1.6] - 2026-05-07

### ✨ New Features | Neue Funktionen

- feat: Update default entities to match German Violet Pool Controller add-on (d427595)

### 🚀 Improvements | Verbesserungen

- update-entity-defaults (c4df97a)
- feat: Update default entities to match German Violet Pool Controller add-on (d427595)
- 📝 Release v0.1.5 - Update changelog, version and info.md (94a18d5)

---

## [0.1.5] - 2026-05-04

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.1.4 - Update changelog, version and info.md (fd0272d)

---

## [0.1.4] - 2026-05-04

### ✨ New Features | Neue Funktionen

- Add system mode grouping tests and polish quick reference (c77220f)
- Merge pull request #58 from Xerolux/claude/add-code-headers-jO2nm (e9847d3)
- feat: add Xerolux 2026 file headers to all source files (3b43518)
- Add aria labels to action-selector (c0ba3ca)
- feat: enhance visual design with premium themes and improved UI (ff81167)
- fix: add missing card_type definitions for digital_rules and diagnostics (da4e60b)
- Add comprehensive views to dashboard_config.yaml (cbbf79f)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- feat: complete phase 5-6 implementation with digital rules and diagnostics cards (3d47947)
- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- feat: implement comprehensive violet-hass API support with advanced controls (9682fc7)
- feat: add comprehensive reusable UI components for advanced pool control (2541154)
- feat: add comprehensive dashboard config using only violet-pool-card (b8c06e0)
- feat: improve card UIs with missing values and better controls (8406453)
- feat: generate info.md for cleaner HACS preview (6f8c6a6)
- docs: Update README and examples with new cards (84640d0)
- ci: add workflow_dispatch to auto-build.yml (e25738c)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- feat: Add 4 new themes and advanced customization options (db841b5)
- ci: add auto-build workflow to rebuild dist on src changes [skip ci] (745d669)
- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.1.2 - Update changelog, version and info.md (90b3ef5)
- /optimize-and-improve-the-code-and-graphics (95096cb)
- build: update auto-generated files [skip ci] (40bf302)
- build: update auto-generated files [skip ci] (f329813)
- 📝 Release v0.1.3 - Update changelog, version and info.md (ca7e716)
- feat: enhance visual design with premium themes and improved UI (ff81167)
- 📝 Release v0.1.2 - Update changelog, version and info.md (8bfd2e2)
- build: update auto-generated files [skip ci] (bf3c070)
- 📝 Release v0.1.2 - Update changelog, version and info.md (5c80b0b)
- 📝 Release v0.1.2 - Update changelog, version and info.md (db3806e)
- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- build: update auto-generated files [skip ci] (0dc6c1c)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- 📝 Release v0.1.1 - Update changelog, version and info.md (b47a256)
- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- refactor: remove problematic cards with mock data and hard-coded content (9caaa73)
- 📝 Release v0.1.1 - Update changelog, version and info.md (83c3f2a)
- build: update auto-generated files [skip ci] (e8e1aea)
- feat: improve card UIs with missing values and better controls (8406453)
- refactor: improve i18n type safety and efficiency (99654b7)
- 📝 Release v0.1.3 - Update changelog and version (a5cc7e5)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- 📝 Release v0.1.2 - Update changelog and version (6672716)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- 📝 Release v0.1.1 - Update changelog and version (99cf3a9)
- 📝 Release v0.1.1 - Update changelog and version (8954bc5)
- Update README with comprehensive feature documentation (d66166f)
- Enhance Dosing card with animated SVG droplet visualization (75914fc)
- Optimize animations and extend TypeScript types (Final improvements) (207dc55)
- Refactor: Improve type safety, accessibility, and UX (Fixes 1-9) (ab76637)
- 📝 Release v0.1.1 - Update changelog and version (40fde92)
- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix npm audit vulnerabilities (91a69d7)
- fix: security, memory leaks, typing, i18n, rate limiting + tests (7a5e9f9)
- 🐛 Fix TypeScript compilation errors in Flow Rate card (5589a98)
- 🔧 Fix TypeScript compilation errors (cc30ac3)
- fix-lovelace-card-build (68a8037)
- fix: add missing card_type definitions for digital_rules and diagnostics (da4e60b)
- fix-statistics-display (a3c4936)
- fix: remove unused 'value' variable from color conversion function (83b9edf)
- fix: reduce statistics display font sizes to prevent text overlap (6484e41)
- fix-german-translations (977029c)
- Fix remaining English translations in Pool Cards (350e3e0)
- Merge pull request #42 from Xerolux/fix-package-json-repo-url-15677146840970789807 (cb7664e)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- fix: Resolve all 3 high-severity security vulnerabilities (1c45410)
- fix-build-warnings (216e4e5)
- Fix TypeScript build warnings (fba7a16)
- fix-pool-dashboard-cards (4b6dfe8)
- fix: resolve TypeScript errors and rebuild dist to fix card registration (aa302e1)
- fix-unused-color-variable (c8a633a)
- fix: remove unused variables and imports (e580139)
- fix-violet-pool-card-mQNV5 (c938d53)
- Fix: Preserve customElements.define in compiled output (17540a5)
- fix-component-registration-conflict (d58dbe5)
- fix: prefix sub-components and explicit registration (1fcf7a9)
- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

### 📚 Documentation | Dokumentation

- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- Update README with comprehensive feature documentation (d66166f)

---

## [0.1.2] - 2026-05-04

### ✨ New Features | Neue Funktionen

- Add system mode grouping tests and polish quick reference (c77220f)
- Merge pull request #58 from Xerolux/claude/add-code-headers-jO2nm (e9847d3)
- feat: add Xerolux 2026 file headers to all source files (3b43518)
- Add aria labels to action-selector (c0ba3ca)
- feat: enhance visual design with premium themes and improved UI (ff81167)
- fix: add missing card_type definitions for digital_rules and diagnostics (da4e60b)
- Add comprehensive views to dashboard_config.yaml (cbbf79f)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- feat: complete phase 5-6 implementation with digital rules and diagnostics cards (3d47947)
- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- feat: implement comprehensive violet-hass API support with advanced controls (9682fc7)
- feat: add comprehensive reusable UI components for advanced pool control (2541154)
- feat: add comprehensive dashboard config using only violet-pool-card (b8c06e0)
- feat: improve card UIs with missing values and better controls (8406453)
- feat: generate info.md for cleaner HACS preview (6f8c6a6)
- docs: Update README and examples with new cards (84640d0)
- ci: add workflow_dispatch to auto-build.yml (e25738c)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- feat: Add 4 new themes and advanced customization options (db841b5)
- ci: add auto-build workflow to rebuild dist on src changes [skip ci] (745d669)
- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)

### 🚀 Improvements | Verbesserungen

- /optimize-and-improve-the-code-and-graphics (95096cb)
- build: update auto-generated files [skip ci] (40bf302)
- build: update auto-generated files [skip ci] (f329813)
- 📝 Release v0.1.3 - Update changelog, version and info.md (ca7e716)
- feat: enhance visual design with premium themes and improved UI (ff81167)
- 📝 Release v0.1.2 - Update changelog, version and info.md (8bfd2e2)
- build: update auto-generated files [skip ci] (bf3c070)
- 📝 Release v0.1.2 - Update changelog, version and info.md (5c80b0b)
- 📝 Release v0.1.2 - Update changelog, version and info.md (db3806e)
- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- build: update auto-generated files [skip ci] (0dc6c1c)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- 📝 Release v0.1.1 - Update changelog, version and info.md (b47a256)
- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- refactor: remove problematic cards with mock data and hard-coded content (9caaa73)
- 📝 Release v0.1.1 - Update changelog, version and info.md (83c3f2a)
- build: update auto-generated files [skip ci] (e8e1aea)
- feat: improve card UIs with missing values and better controls (8406453)
- refactor: improve i18n type safety and efficiency (99654b7)
- 📝 Release v0.1.3 - Update changelog and version (a5cc7e5)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- 📝 Release v0.1.2 - Update changelog and version (6672716)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- 📝 Release v0.1.1 - Update changelog and version (99cf3a9)
- 📝 Release v0.1.1 - Update changelog and version (8954bc5)
- Update README with comprehensive feature documentation (d66166f)
- Enhance Dosing card with animated SVG droplet visualization (75914fc)
- Optimize animations and extend TypeScript types (Final improvements) (207dc55)
- Refactor: Improve type safety, accessibility, and UX (Fixes 1-9) (ab76637)
- 📝 Release v0.1.1 - Update changelog and version (40fde92)
- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix npm audit vulnerabilities (91a69d7)
- fix: security, memory leaks, typing, i18n, rate limiting + tests (7a5e9f9)
- 🐛 Fix TypeScript compilation errors in Flow Rate card (5589a98)
- 🔧 Fix TypeScript compilation errors (cc30ac3)
- fix-lovelace-card-build (68a8037)
- fix: add missing card_type definitions for digital_rules and diagnostics (da4e60b)
- fix-statistics-display (a3c4936)
- fix: remove unused 'value' variable from color conversion function (83b9edf)
- fix: reduce statistics display font sizes to prevent text overlap (6484e41)
- fix-german-translations (977029c)
- Fix remaining English translations in Pool Cards (350e3e0)
- Merge pull request #42 from Xerolux/fix-package-json-repo-url-15677146840970789807 (cb7664e)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- fix: Resolve all 3 high-severity security vulnerabilities (1c45410)
- fix-build-warnings (216e4e5)
- Fix TypeScript build warnings (fba7a16)
- fix-pool-dashboard-cards (4b6dfe8)
- fix: resolve TypeScript errors and rebuild dist to fix card registration (aa302e1)
- fix-unused-color-variable (c8a633a)
- fix: remove unused variables and imports (e580139)
- fix-violet-pool-card-mQNV5 (c938d53)
- Fix: Preserve customElements.define in compiled output (17540a5)
- fix-component-registration-conflict (d58dbe5)
- fix: prefix sub-components and explicit registration (1fcf7a9)
- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

### 📚 Documentation | Dokumentation

- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- Update README with comprehensive feature documentation (d66166f)

---

## [0.1.3] - 2026-03-08

### ✨ New Features | Neue Funktionen

- feat: enhance visual design with premium themes and improved UI (ff81167)
- fix: add missing card_type definitions for digital_rules and diagnostics (da4e60b)
- Add comprehensive views to dashboard_config.yaml (cbbf79f)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- feat: complete phase 5-6 implementation with digital rules and diagnostics cards (3d47947)
- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- feat: implement comprehensive violet-hass API support with advanced controls (9682fc7)
- feat: add comprehensive reusable UI components for advanced pool control (2541154)
- feat: add comprehensive dashboard config using only violet-pool-card (b8c06e0)
- feat: improve card UIs with missing values and better controls (8406453)
- feat: generate info.md for cleaner HACS preview (6f8c6a6)
- docs: Update README and examples with new cards (84640d0)
- ci: add workflow_dispatch to auto-build.yml (e25738c)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- feat: Add 4 new themes and advanced customization options (db841b5)
- ci: add auto-build workflow to rebuild dist on src changes [skip ci] (745d669)
- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)
- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)

### 🚀 Improvements | Verbesserungen

- feat: enhance visual design with premium themes and improved UI (ff81167)
- 📝 Release v0.1.2 - Update changelog, version and info.md (8bfd2e2)
- build: update auto-generated files [skip ci] (bf3c070)
- 📝 Release v0.1.2 - Update changelog, version and info.md (5c80b0b)
- 📝 Release v0.1.2 - Update changelog, version and info.md (db3806e)
- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- build: update auto-generated files [skip ci] (0dc6c1c)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- 📝 Release v0.1.1 - Update changelog, version and info.md (b47a256)
- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- refactor: remove problematic cards with mock data and hard-coded content (9caaa73)
- 📝 Release v0.1.1 - Update changelog, version and info.md (83c3f2a)
- build: update auto-generated files [skip ci] (e8e1aea)
- feat: improve card UIs with missing values and better controls (8406453)
- refactor: improve i18n type safety and efficiency (99654b7)
- 📝 Release v0.1.3 - Update changelog and version (a5cc7e5)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- 📝 Release v0.1.2 - Update changelog and version (6672716)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- 📝 Release v0.1.1 - Update changelog and version (99cf3a9)
- 📝 Release v0.1.1 - Update changelog and version (8954bc5)
- Update README with comprehensive feature documentation (d66166f)
- Enhance Dosing card with animated SVG droplet visualization (75914fc)
- Optimize animations and extend TypeScript types (Final improvements) (207dc55)
- Refactor: Improve type safety, accessibility, and UX (Fixes 1-9) (ab76637)
- 📝 Release v0.1.1 - Update changelog and version (40fde92)
- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)
- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)
- 📝 Release v0.1.2 - Update changelog and version (6b93afd)

### 🔧 Bug Fixes | Fehlerbehebungen

- 🐛 Fix TypeScript compilation errors in Flow Rate card (5589a98)
- 🔧 Fix TypeScript compilation errors (cc30ac3)
- fix-lovelace-card-build (68a8037)
- fix: add missing card_type definitions for digital_rules and diagnostics (da4e60b)
- fix-statistics-display (a3c4936)
- fix: remove unused 'value' variable from color conversion function (83b9edf)
- fix: reduce statistics display font sizes to prevent text overlap (6484e41)
- fix-german-translations (977029c)
- Fix remaining English translations in Pool Cards (350e3e0)
- Merge pull request #42 from Xerolux/fix-package-json-repo-url-15677146840970789807 (cb7664e)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- fix: Resolve all 3 high-severity security vulnerabilities (1c45410)
- fix-build-warnings (216e4e5)
- Fix TypeScript build warnings (fba7a16)
- fix-pool-dashboard-cards (4b6dfe8)
- fix: resolve TypeScript errors and rebuild dist to fix card registration (aa302e1)
- fix-unused-color-variable (c8a633a)
- fix: remove unused variables and imports (e580139)
- fix-violet-pool-card-mQNV5 (c938d53)
- Fix: Preserve customElements.define in compiled output (17540a5)
- fix-component-registration-conflict (d58dbe5)
- fix: prefix sub-components and explicit registration (1fcf7a9)
- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

### 📚 Documentation | Dokumentation

- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- Update README with comprehensive feature documentation (d66166f)
- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)

---

## [0.1.2] - 2026-03-04

### ✨ New Features | Neue Funktionen

- fix: add missing card_type definitions for digital_rules and diagnostics (da4e60b)
- Add comprehensive views to dashboard_config.yaml (cbbf79f)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- feat: complete phase 5-6 implementation with digital rules and diagnostics cards (3d47947)
- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- feat: implement comprehensive violet-hass API support with advanced controls (9682fc7)
- feat: add comprehensive reusable UI components for advanced pool control (2541154)
- feat: add comprehensive dashboard config using only violet-pool-card (b8c06e0)
- feat: improve card UIs with missing values and better controls (8406453)
- feat: generate info.md for cleaner HACS preview (6f8c6a6)
- docs: Update README and examples with new cards (84640d0)
- ci: add workflow_dispatch to auto-build.yml (e25738c)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- feat: Add 4 new themes and advanced customization options (db841b5)
- ci: add auto-build workflow to rebuild dist on src changes [skip ci] (745d669)
- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)

### 🚀 Improvements | Verbesserungen

- build: update auto-generated files [skip ci] (bf3c070)
- 📝 Release v0.1.2 - Update changelog, version and info.md (5c80b0b)
- 📝 Release v0.1.2 - Update changelog, version and info.md (db3806e)
- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- build: update auto-generated files [skip ci] (0dc6c1c)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- 📝 Release v0.1.1 - Update changelog, version and info.md (b47a256)
- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- refactor: remove problematic cards with mock data and hard-coded content (9caaa73)
- 📝 Release v0.1.1 - Update changelog, version and info.md (83c3f2a)
- build: update auto-generated files [skip ci] (e8e1aea)
- feat: improve card UIs with missing values and better controls (8406453)
- refactor: improve i18n type safety and efficiency (99654b7)
- 📝 Release v0.1.3 - Update changelog and version (a5cc7e5)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- 📝 Release v0.1.2 - Update changelog and version (6672716)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- 📝 Release v0.1.1 - Update changelog and version (99cf3a9)
- 📝 Release v0.1.1 - Update changelog and version (8954bc5)
- Update README with comprehensive feature documentation (d66166f)
- Enhance Dosing card with animated SVG droplet visualization (75914fc)
- Optimize animations and extend TypeScript types (Final improvements) (207dc55)
- Refactor: Improve type safety, accessibility, and UX (Fixes 1-9) (ab76637)
- 📝 Release v0.1.1 - Update changelog and version (40fde92)
- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- 🔧 Fix TypeScript compilation errors (cc30ac3)
- fix-lovelace-card-build (68a8037)
- fix: add missing card_type definitions for digital_rules and diagnostics (da4e60b)
- fix-statistics-display (a3c4936)
- fix: remove unused 'value' variable from color conversion function (83b9edf)
- fix: reduce statistics display font sizes to prevent text overlap (6484e41)
- fix-german-translations (977029c)
- Fix remaining English translations in Pool Cards (350e3e0)
- Merge pull request #42 from Xerolux/fix-package-json-repo-url-15677146840970789807 (cb7664e)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- fix: Resolve all 3 high-severity security vulnerabilities (1c45410)
- fix-build-warnings (216e4e5)
- Fix TypeScript build warnings (fba7a16)
- fix-pool-dashboard-cards (4b6dfe8)
- fix: resolve TypeScript errors and rebuild dist to fix card registration (aa302e1)
- fix-unused-color-variable (c8a633a)
- fix: remove unused variables and imports (e580139)
- fix-violet-pool-card-mQNV5 (c938d53)
- Fix: Preserve customElements.define in compiled output (17540a5)
- fix-component-registration-conflict (d58dbe5)
- fix: prefix sub-components and explicit registration (1fcf7a9)
- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

### 📚 Documentation | Dokumentation

- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- Update README with comprehensive feature documentation (d66166f)

---

## [0.1.2] - 2026-03-04

### ✨ New Features | Neue Funktionen

- fix: add missing card_type definitions for digital_rules and diagnostics (da4e60b)
- Add comprehensive views to dashboard_config.yaml (cbbf79f)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- feat: complete phase 5-6 implementation with digital rules and diagnostics cards (3d47947)
- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- feat: implement comprehensive violet-hass API support with advanced controls (9682fc7)
- feat: add comprehensive reusable UI components for advanced pool control (2541154)
- feat: add comprehensive dashboard config using only violet-pool-card (b8c06e0)
- feat: improve card UIs with missing values and better controls (8406453)
- feat: generate info.md for cleaner HACS preview (6f8c6a6)
- docs: Update README and examples with new cards (84640d0)
- ci: add workflow_dispatch to auto-build.yml (e25738c)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- feat: Add 4 new themes and advanced customization options (db841b5)
- ci: add auto-build workflow to rebuild dist on src changes [skip ci] (745d669)
- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.1.2 - Update changelog, version and info.md (db3806e)
- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- build: update auto-generated files [skip ci] (0dc6c1c)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- 📝 Release v0.1.1 - Update changelog, version and info.md (b47a256)
- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- refactor: remove problematic cards with mock data and hard-coded content (9caaa73)
- 📝 Release v0.1.1 - Update changelog, version and info.md (83c3f2a)
- build: update auto-generated files [skip ci] (e8e1aea)
- feat: improve card UIs with missing values and better controls (8406453)
- refactor: improve i18n type safety and efficiency (99654b7)
- 📝 Release v0.1.3 - Update changelog and version (a5cc7e5)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- 📝 Release v0.1.2 - Update changelog and version (6672716)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- 📝 Release v0.1.1 - Update changelog and version (99cf3a9)
- 📝 Release v0.1.1 - Update changelog and version (8954bc5)
- Update README with comprehensive feature documentation (d66166f)
- Enhance Dosing card with animated SVG droplet visualization (75914fc)
- Optimize animations and extend TypeScript types (Final improvements) (207dc55)
- Refactor: Improve type safety, accessibility, and UX (Fixes 1-9) (ab76637)
- 📝 Release v0.1.1 - Update changelog and version (40fde92)
- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-lovelace-card-build (68a8037)
- fix: add missing card_type definitions for digital_rules and diagnostics (da4e60b)
- fix-statistics-display (a3c4936)
- fix: remove unused 'value' variable from color conversion function (83b9edf)
- fix: reduce statistics display font sizes to prevent text overlap (6484e41)
- fix-german-translations (977029c)
- Fix remaining English translations in Pool Cards (350e3e0)
- Merge pull request #42 from Xerolux/fix-package-json-repo-url-15677146840970789807 (cb7664e)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- fix: Resolve all 3 high-severity security vulnerabilities (1c45410)
- fix-build-warnings (216e4e5)
- Fix TypeScript build warnings (fba7a16)
- fix-pool-dashboard-cards (4b6dfe8)
- fix: resolve TypeScript errors and rebuild dist to fix card registration (aa302e1)
- fix-unused-color-variable (c8a633a)
- fix: remove unused variables and imports (e580139)
- fix-violet-pool-card-mQNV5 (c938d53)
- Fix: Preserve customElements.define in compiled output (17540a5)
- fix-component-registration-conflict (d58dbe5)
- fix: prefix sub-components and explicit registration (1fcf7a9)
- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

### 📚 Documentation | Dokumentation

- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- Update README with comprehensive feature documentation (d66166f)

---

## [0.1.2] - 2026-03-04

### ✨ New Features | Neue Funktionen

- Add comprehensive views to dashboard_config.yaml (cbbf79f)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- feat: complete phase 5-6 implementation with digital rules and diagnostics cards (3d47947)
- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- feat: implement comprehensive violet-hass API support with advanced controls (9682fc7)
- feat: add comprehensive reusable UI components for advanced pool control (2541154)
- feat: add comprehensive dashboard config using only violet-pool-card (b8c06e0)
- feat: improve card UIs with missing values and better controls (8406453)
- feat: generate info.md for cleaner HACS preview (6f8c6a6)
- docs: Update README and examples with new cards (84640d0)
- ci: add workflow_dispatch to auto-build.yml (e25738c)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- feat: Add 4 new themes and advanced customization options (db841b5)
- ci: add auto-build workflow to rebuild dist on src changes [skip ci] (745d669)
- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)

### 🚀 Improvements | Verbesserungen

- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- build: update auto-generated files [skip ci] (0dc6c1c)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- 📝 Release v0.1.1 - Update changelog, version and info.md (b47a256)
- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- refactor: remove problematic cards with mock data and hard-coded content (9caaa73)
- 📝 Release v0.1.1 - Update changelog, version and info.md (83c3f2a)
- build: update auto-generated files [skip ci] (e8e1aea)
- feat: improve card UIs with missing values and better controls (8406453)
- refactor: improve i18n type safety and efficiency (99654b7)
- 📝 Release v0.1.3 - Update changelog and version (a5cc7e5)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- 📝 Release v0.1.2 - Update changelog and version (6672716)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- 📝 Release v0.1.1 - Update changelog and version (99cf3a9)
- 📝 Release v0.1.1 - Update changelog and version (8954bc5)
- Update README with comprehensive feature documentation (d66166f)
- Enhance Dosing card with animated SVG droplet visualization (75914fc)
- Optimize animations and extend TypeScript types (Final improvements) (207dc55)
- Refactor: Improve type safety, accessibility, and UX (Fixes 1-9) (ab76637)
- 📝 Release v0.1.1 - Update changelog and version (40fde92)
- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-statistics-display (a3c4936)
- fix: remove unused 'value' variable from color conversion function (83b9edf)
- fix: reduce statistics display font sizes to prevent text overlap (6484e41)
- fix-german-translations (977029c)
- Fix remaining English translations in Pool Cards (350e3e0)
- Merge pull request #42 from Xerolux/fix-package-json-repo-url-15677146840970789807 (cb7664e)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- fix: Resolve all 3 high-severity security vulnerabilities (1c45410)
- fix-build-warnings (216e4e5)
- Fix TypeScript build warnings (fba7a16)
- fix-pool-dashboard-cards (4b6dfe8)
- fix: resolve TypeScript errors and rebuild dist to fix card registration (aa302e1)
- fix-unused-color-variable (c8a633a)
- fix: remove unused variables and imports (e580139)
- fix-violet-pool-card-mQNV5 (c938d53)
- Fix: Preserve customElements.define in compiled output (17540a5)
- fix-component-registration-conflict (d58dbe5)
- fix: prefix sub-components and explicit registration (1fcf7a9)
- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

### 📚 Documentation | Dokumentation

- update-readme-dashboard (63e80f8)
- update-readme-dashboard (3a391a9)
- Update README with comprehensive entity reference and add dashboard.yaml (b8fd8e8)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- Update README with comprehensive feature documentation (d66166f)

---

## [0.1.1] - 2026-03-04

### ✨ New Features | Neue Funktionen

- feat: complete phase 5-6 implementation with digital rules and diagnostics cards (3d47947)
- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- feat: implement comprehensive violet-hass API support with advanced controls (9682fc7)
- feat: add comprehensive reusable UI components for advanced pool control (2541154)
- feat: add comprehensive dashboard config using only violet-pool-card (b8c06e0)
- feat: improve card UIs with missing values and better controls (8406453)
- feat: generate info.md for cleaner HACS preview (6f8c6a6)
- docs: Update README and examples with new cards (84640d0)
- ci: add workflow_dispatch to auto-build.yml (e25738c)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- feat: Add 4 new themes and advanced customization options (db841b5)
- ci: add auto-build workflow to rebuild dist on src changes [skip ci] (745d669)
- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)

### 🚀 Improvements | Verbesserungen

- feat: enhance pump, solar, light, and dosing cards with full API integration (a3ab4ef)
- refactor: remove problematic cards with mock data and hard-coded content (9caaa73)
- 📝 Release v0.1.1 - Update changelog, version and info.md (83c3f2a)
- build: update auto-generated files [skip ci] (e8e1aea)
- feat: improve card UIs with missing values and better controls (8406453)
- refactor: improve i18n type safety and efficiency (99654b7)
- 📝 Release v0.1.3 - Update changelog and version (a5cc7e5)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- 📝 Release v0.1.2 - Update changelog and version (6672716)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- 📝 Release v0.1.1 - Update changelog and version (99cf3a9)
- 📝 Release v0.1.1 - Update changelog and version (8954bc5)
- Update README with comprehensive feature documentation (d66166f)
- Enhance Dosing card with animated SVG droplet visualization (75914fc)
- Optimize animations and extend TypeScript types (Final improvements) (207dc55)
- Refactor: Improve type safety, accessibility, and UX (Fixes 1-9) (ab76637)
- 📝 Release v0.1.1 - Update changelog and version (40fde92)
- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-statistics-display (a3c4936)
- fix: remove unused 'value' variable from color conversion function (83b9edf)
- fix: reduce statistics display font sizes to prevent text overlap (6484e41)
- fix-german-translations (977029c)
- Fix remaining English translations in Pool Cards (350e3e0)
- Merge pull request #42 from Xerolux/fix-package-json-repo-url-15677146840970789807 (cb7664e)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- fix: Resolve all 3 high-severity security vulnerabilities (1c45410)
- fix-build-warnings (216e4e5)
- Fix TypeScript build warnings (fba7a16)
- fix-pool-dashboard-cards (4b6dfe8)
- fix: resolve TypeScript errors and rebuild dist to fix card registration (aa302e1)
- fix-unused-color-variable (c8a633a)
- fix: remove unused variables and imports (e580139)
- fix-violet-pool-card-mQNV5 (c938d53)
- Fix: Preserve customElements.define in compiled output (17540a5)
- fix-component-registration-conflict (d58dbe5)
- fix: prefix sub-components and explicit registration (1fcf7a9)
- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

### 📚 Documentation | Dokumentation

- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- Update README with comprehensive feature documentation (d66166f)

---

## [0.1.1] - 2026-03-04

### ✨ New Features | Neue Funktionen

- feat: add comprehensive dashboard config using only violet-pool-card (b8c06e0)
- feat: improve card UIs with missing values and better controls (8406453)
- feat: generate info.md for cleaner HACS preview (6f8c6a6)
- docs: Update README and examples with new cards (84640d0)
- ci: add workflow_dispatch to auto-build.yml (e25738c)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- feat: Add 4 new themes and advanced customization options (db841b5)
- ci: add auto-build workflow to rebuild dist on src changes [skip ci] (745d669)
- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)

### 🚀 Improvements | Verbesserungen

- build: update auto-generated files [skip ci] (e8e1aea)
- feat: improve card UIs with missing values and better controls (8406453)
- refactor: improve i18n type safety and efficiency (99654b7)
- 📝 Release v0.1.3 - Update changelog and version (a5cc7e5)
- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- 📝 Release v0.1.2 - Update changelog and version (6672716)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- 📝 Release v0.1.1 - Update changelog and version (99cf3a9)
- 📝 Release v0.1.1 - Update changelog and version (8954bc5)
- Update README with comprehensive feature documentation (d66166f)
- Enhance Dosing card with animated SVG droplet visualization (75914fc)
- Optimize animations and extend TypeScript types (Final improvements) (207dc55)
- Refactor: Improve type safety, accessibility, and UX (Fixes 1-9) (ab76637)
- 📝 Release v0.1.1 - Update changelog and version (40fde92)
- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-statistics-display (a3c4936)
- fix: remove unused 'value' variable from color conversion function (83b9edf)
- fix: reduce statistics display font sizes to prevent text overlap (6484e41)
- fix-german-translations (977029c)
- Fix remaining English translations in Pool Cards (350e3e0)
- Merge pull request #42 from Xerolux/fix-package-json-repo-url-15677146840970789807 (cb7664e)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- fix: Resolve all 3 high-severity security vulnerabilities (1c45410)
- fix-build-warnings (216e4e5)
- Fix TypeScript build warnings (fba7a16)
- fix-pool-dashboard-cards (4b6dfe8)
- fix: resolve TypeScript errors and rebuild dist to fix card registration (aa302e1)
- fix-unused-color-variable (c8a633a)
- fix: remove unused variables and imports (e580139)
- fix-violet-pool-card-mQNV5 (c938d53)
- Fix: Preserve customElements.define in compiled output (17540a5)
- fix-component-registration-conflict (d58dbe5)
- fix: prefix sub-components and explicit registration (1fcf7a9)
- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

### 📚 Documentation | Dokumentation

- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- Update README with comprehensive feature documentation (d66166f)

---

## [0.1.3] - 2026-03-04

### ✨ New Features | Neue Funktionen

- docs: Update README and examples with new cards (84640d0)
- ci: add workflow_dispatch to auto-build.yml (e25738c)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- feat: Add 4 new themes and advanced customization options (db841b5)
- ci: add auto-build workflow to rebuild dist on src changes [skip ci] (745d669)
- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)
- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)

### 🚀 Improvements | Verbesserungen

- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- 📝 Release v0.1.2 - Update changelog and version (6672716)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- 📝 Release v0.1.1 - Update changelog and version (99cf3a9)
- 📝 Release v0.1.1 - Update changelog and version (8954bc5)
- Update README with comprehensive feature documentation (d66166f)
- Enhance Dosing card with animated SVG droplet visualization (75914fc)
- Optimize animations and extend TypeScript types (Final improvements) (207dc55)
- Refactor: Improve type safety, accessibility, and UX (Fixes 1-9) (ab76637)
- 📝 Release v0.1.1 - Update changelog and version (40fde92)
- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)
- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)
- 📝 Release v0.1.2 - Update changelog and version (6b93afd)

### 🔧 Bug Fixes | Fehlerbehebungen

- Merge pull request #42 from Xerolux/fix-package-json-repo-url-15677146840970789807 (cb7664e)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- fix: Resolve all 3 high-severity security vulnerabilities (1c45410)
- fix-build-warnings (216e4e5)
- Fix TypeScript build warnings (fba7a16)
- fix-pool-dashboard-cards (4b6dfe8)
- fix: resolve TypeScript errors and rebuild dist to fix card registration (aa302e1)
- fix-unused-color-variable (c8a633a)
- fix: remove unused variables and imports (e580139)
- fix-violet-pool-card-mQNV5 (c938d53)
- Fix: Preserve customElements.define in compiled output (17540a5)
- fix-component-registration-conflict (d58dbe5)
- fix: prefix sub-components and explicit registration (1fcf7a9)
- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

### 📚 Documentation | Dokumentation

- docs: update readme with badges and sponsor links (31c7f2b)
- docs-update-readme-examples (1b4dfc0)
- docs: Update README and examples with new cards (84640d0)
- Update README with comprehensive feature documentation (d66166f)
- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)

---

## [0.1.2] - 2026-03-04

### ✨ New Features | Neue Funktionen

- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- feat: Add 4 new themes and advanced customization options (db841b5)
- ci: add auto-build workflow to rebuild dist on src changes [skip ci] (745d669)
- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)

### 🚀 Improvements | Verbesserungen

- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- 📝 Release v0.1.1 - Update changelog and version (99cf3a9)
- 📝 Release v0.1.1 - Update changelog and version (8954bc5)
- Update README with comprehensive feature documentation (d66166f)
- Enhance Dosing card with animated SVG droplet visualization (75914fc)
- Optimize animations and extend TypeScript types (Final improvements) (207dc55)
- Refactor: Improve type safety, accessibility, and UX (Fixes 1-9) (ab76637)
- 📝 Release v0.1.1 - Update changelog and version (40fde92)
- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- Merge pull request #42 from Xerolux/fix-package-json-repo-url-15677146840970789807 (cb7664e)
- fix(package): update repository URL to correctly point to violet-pool-card (f666419)
- fix: Add missing SVG exports and fix PumpState interface (de176d0)
- fix: Resolve all 3 high-severity security vulnerabilities (1c45410)
- fix-build-warnings (216e4e5)
- Fix TypeScript build warnings (fba7a16)
- fix-pool-dashboard-cards (4b6dfe8)
- fix: resolve TypeScript errors and rebuild dist to fix card registration (aa302e1)
- fix-unused-color-variable (c8a633a)
- fix: remove unused variables and imports (e580139)
- fix-violet-pool-card-mQNV5 (c938d53)
- Fix: Preserve customElements.define in compiled output (17540a5)
- fix-component-registration-conflict (d58dbe5)
- fix: prefix sub-components and explicit registration (1fcf7a9)
- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

### 📚 Documentation | Dokumentation

- Update README with comprehensive feature documentation (d66166f)

---

## [0.1.1] - 2026-03-03

### ✨ New Features | Neue Funktionen

- ci: add auto-build workflow to rebuild dist on src changes [skip ci] (745d669)
- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.1.1 - Update changelog and version (8954bc5)
- Update README with comprehensive feature documentation (d66166f)
- Enhance Dosing card with animated SVG droplet visualization (75914fc)
- Optimize animations and extend TypeScript types (Final improvements) (207dc55)
- Refactor: Improve type safety, accessibility, and UX (Fixes 1-9) (ab76637)
- 📝 Release v0.1.1 - Update changelog and version (40fde92)
- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-pool-dashboard-cards (4b6dfe8)
- fix: resolve TypeScript errors and rebuild dist to fix card registration (aa302e1)
- fix-unused-color-variable (c8a633a)
- fix: remove unused variables and imports (e580139)
- fix-violet-pool-card-mQNV5 (c938d53)
- Fix: Preserve customElements.define in compiled output (17540a5)
- fix-component-registration-conflict (d58dbe5)
- fix: prefix sub-components and explicit registration (1fcf7a9)
- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

### 📚 Documentation | Dokumentation

- Update README with comprehensive feature documentation (d66166f)

---

## [0.1.1] - 2026-03-03

### ✨ New Features | Neue Funktionen

- add-hacs-icon-and-logo (2fc8bcb)
- Add Kelvin Slider to Light Card and Loading Skeleton infrastructure (94856b5)
- Add 10 comprehensive enhancements to Violet Pool Card (3c894ed)
- Update README with comprehensive feature documentation (d66166f)
- Add 5 new card types and integrate advanced animations (6da6cce)
- Add icon.png and logo.png to repository root for HACS display (41d9dd4)
- Add design system, memoization utilities, and performance optimizations (Fixes 10-15) (22d57b1)

### 🚀 Improvements | Verbesserungen

- Update README with comprehensive feature documentation (d66166f)
- Enhance Dosing card with animated SVG droplet visualization (75914fc)
- Optimize animations and extend TypeScript types (Final improvements) (207dc55)
- Refactor: Improve type safety, accessibility, and UX (Fixes 1-9) (ab76637)
- 📝 Release v0.1.1 - Update changelog and version (40fde92)
- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-unused-color-variable (c8a633a)
- fix: remove unused variables and imports (e580139)
- fix-violet-pool-card-mQNV5 (c938d53)
- Fix: Preserve customElements.define in compiled output (17540a5)
- fix-component-registration-conflict (d58dbe5)
- fix: prefix sub-components and explicit registration (1fcf7a9)
- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

### 📚 Documentation | Dokumentation

- Update README with comprehensive feature documentation (d66166f)

---

## [0.1.1] - 2026-03-03

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.1.1 - Update changelog and version (eebb8ae)
- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-custom-elements (66d54c6)
- fix: use customElements.define directly instead of Lit decorator (d4c6651)
- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

---

## [0.1.1] - 2026-03-03

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.1.1 - Update changelog and version (60e2ad7)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-lit-bundling (703cac5)
- Fix module resolution errors by bundling Lit (af499d7)
- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

---

## [0.1.1] - 2026-03-03

### 🚀 Improvements | Verbesserungen

- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)
- 📝 Release v0.1.3 - Update changelog and version (bb8738d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-violet-pool-card- (a560d4c)
- fix: remove dead code causing TS warning and optimize compilation (36bb7ec)

---

## [0.1.3] - 2026-03-02

### ✨ New Features | Neue Funktionen

- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)

### 🚀 Improvements | Verbesserungen

- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)
- 📝 Release v0.1.2 - Update changelog and version (6b93afd)

### 📚 Documentation | Dokumentation

- docs: update README with v0.2.0 features (6 new card types, animated SVG icons, RGB picker, tooltips) (aa06296)

---

## [0.1.2] - 2026-03-02

### ✨ New Features | Neue Funktionen

- feat: v0.2.0 - cover/light/filter cards, animated SVG icons, RGB picker (b5890ff)
- feat: add tooltip system, chemical card, sensor card + design improvements (f2a1afd)

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.1.1 - Update changelog and version (e8e7a23)

---

## [0.1.1] - 2026-03-02

### ✨ New Features | Neue Funktionen

- fix-layout-add-details-card (4ade113)
- feat: fix layout overlaps and add new 'details' card type (6025132)
- feat: fix layout overlaps and add new 'details' card type (c5f71c1)
- feat: fix layout overlaps and add new 'details' card type (fecc595)
- fix: Optimize bundle size <100KB and add preview screenshots (f191732)
- feat: Add preview images and enhance demo page (73c4876)
- feat: v0.3.0 — Apple/Samsung design overhaul, new themes, bug fixes (d337d68)

### 🚀 Improvements | Verbesserungen

- 🎨 Palette: Improve accessibility of quick actions buttons (c5d2c94)
- fix: Optimize bundle size <100KB and add preview screenshots (f191732)
- feat: Add preview images and enhance demo page (73c4876)
- improve-pool-card-addon (90ea32f)
- Update links to violet-pool-card repository (b96e851)
- Update README.md (4740156)
- update-readme-setup (a51ebc0)
- optimize-ui-design (fcacd4c)
- chore: update package-lock.json after npm install (0482b5d)
- 📝 Release v0.1.0 - Update changelog and version (f09bec8)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-layout-add-details-card (4ade113)
- feat: fix layout overlaps and add new 'details' card type (6025132)
- feat: fix layout overlaps and add new 'details' card type (c5f71c1)
- feat: fix layout overlaps and add new 'details' card type (fecc595)
- fix: Optimize bundle size <100KB and add preview screenshots (f191732)
- feat: v0.3.0 — Apple/Samsung design overhaul, new themes, bug fixes (d337d68)
- fix: repair broken themes, fix crashes, redesign UI for premium look (f72e3a8)

### 📚 Documentation | Dokumentation

- Update README.md (4740156)
- update-readme-setup (a51ebc0)
- README komplett überarbeitet: Bilder, Features, Installation und Dashboard-Anleitung (798844d)

---

## [0.1.0] - 2026-02-06

### ✨ New Features | Neue Funktionen

- fix: Add dist/ folder for HACS repository compliance (83f05de)
- add-bundle-size-reporting (fdd0189)
- feat: Add dynamic entity prefix support for multiple controllers (dd1f9aa)
- feat: add advanced release workflow (461bf61)

### 🚀 Improvements | Verbesserungen

- 📝 Release v0.1.0-alpha.3 - Update changelog and version (a6f7879)
- chore: Update package-lock.json (d1e8ba2)
- 📝 Release v0.1.0-alpha.2 - Update changelog and version (9b28e69)
- Resolve conflicts and optimize bundle size (1add116)
- Resolve PR #15 merge conflicts and optimize bundle size (d8f138f)
- Implement Premium UI themes (iOS/OneUI style) and optimize bundle size (2fcb805)
- Update README.md (ca4d34d)
- 📝 Release v0.1.0-alpha.1 - Update changelog and version (068a4c8)
- update-to-violet-pool-card-and-screenshots (e49433b)
- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)
- Update package-lock.json (eaae0be)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix: Trim whitespace from tag input in release workflow (d973a5b)
- fix: Reduce bundle to 93KB, rewrite README, fix version mismatch (5b9d69e)
- fix-repo-structure (3d5322b)
- fix: Add dist/ folder for HACS repository compliance (83f05de)
- fix: Reduce bundle size to under 100KB limit (9bff871)
- fix-pr-15-comments (18c4bcb)
- Fix PR 15 issues: Configurable entities, CSS fixes, and Docs refactoring (6403ada)

### 📚 Documentation | Dokumentation

- fix: Reduce bundle to 93KB, rewrite README, fix version mismatch (5b9d69e)
- revert-readme (11ee510)
- Revert README.md to previous version (f0787c8)
- Fix PR 15 issues: Configurable entities, CSS fixes, and Docs refactoring (6403ada)
- Update README.md (ca4d34d)
- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)

---

## [0.1.0-alpha.3] - 2026-01-05

### ✨ New Features | Neue Funktionen

- add-bundle-size-reporting (fdd0189)
- feat: Add dynamic entity prefix support for multiple controllers (dd1f9aa)
- feat: add advanced release workflow (461bf61)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)

### 🚀 Improvements | Verbesserungen

- chore: Update package-lock.json (d1e8ba2)
- 📝 Release v0.1.0-alpha.2 - Update changelog and version (9b28e69)
- Resolve conflicts and optimize bundle size (1add116)
- Resolve PR #15 merge conflicts and optimize bundle size (d8f138f)
- Implement Premium UI themes (iOS/OneUI style) and optimize bundle size (2fcb805)
- Update README.md (ca4d34d)
- 📝 Release v0.1.0-alpha.1 - Update changelog and version (068a4c8)
- update-to-violet-pool-card-and-screenshots (e49433b)
- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)
- Update package-lock.json (eaae0be)
- improve-readme-badges (7ed69bb)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- Update README.md (bdd83d3)
- Update FUNDING.yml (5c442ba)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix: Reduce bundle size to under 100KB limit (9bff871)
- fix-pr-15-comments (18c4bcb)
- Fix PR 15 issues: Configurable entities, CSS fixes, and Docs refactoring (6403ada)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)

### 📚 Documentation | Dokumentation

- revert-readme (11ee510)
- Revert README.md to previous version (f0787c8)
- Fix PR 15 issues: Configurable entities, CSS fixes, and Docs refactoring (6403ada)
- Update README.md (ca4d34d)
- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)
- improve-readme-badges (7ed69bb)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- Update README.md (bdd83d3)

---

## [0.1.0-alpha.2] - 2026-01-05

### ✨ New Features | Neue Funktionen

- feat: add advanced release workflow (461bf61)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- add-screenshots (c84ab5c)
- Add screenshots to README.md (6a7d97a)

### 🚀 Improvements | Verbesserungen

- Resolve conflicts and optimize bundle size (1add116)
- Resolve PR #15 merge conflicts and optimize bundle size (d8f138f)
- Implement Premium UI themes (iOS/OneUI style) and optimize bundle size (2fcb805)
- Update README.md (ca4d34d)
- 📝 Release v0.1.0-alpha.1 - Update changelog and version (068a4c8)
- update-to-violet-pool-card-and-screenshots (e49433b)
- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)
- Update package-lock.json (eaae0be)
- improve-readme-badges (7ed69bb)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- Update README.md (bdd83d3)
- Update FUNDING.yml (5c442ba)
- 📖 README Update: Visual Editor Showcase (1a3da5d)

### 🔧 Bug Fixes | Fehlerbehebungen

- fix-pr-15-comments (18c4bcb)
- Fix PR 15 issues: Configurable entities, CSS fixes, and Docs refactoring (6403ada)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)

### 📚 Documentation | Dokumentation

- revert-readme (11ee510)
- Revert README.md to previous version (f0787c8)
- Fix PR 15 issues: Configurable entities, CSS fixes, and Docs refactoring (6403ada)
- Update README.md (ca4d34d)
- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)
- improve-readme-badges (7ed69bb)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- Update README.md (bdd83d3)
- Add screenshots to README.md (6a7d97a)
- 📖 README Update: Visual Editor Showcase (1a3da5d)

---

## [0.1.0-alpha.1] - 2026-01-05

### ✨ New Features | Neue Funktionen

- feat: add advanced release workflow (461bf61)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- add-screenshots (c84ab5c)
- Add screenshots to README.md (6a7d97a)
- 📊 Feature Analysis: Market Research vs Top HACS Cards (33c66a6)
- feature/ui-ux-overhaul (a7f40b5)
- feat: Overhaul UI/UX with Modern/Luxury styles and System card (f522e64)
- Add demo page and screenshot generation script (8061fc4)

### 🚀 Improvements | Verbesserungen

- update-to-violet-pool-card-and-screenshots (e49433b)
- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)
- Update package-lock.json (eaae0be)
- improve-readme-badges (7ed69bb)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- Update README.md (bdd83d3)
- Update FUNDING.yml (5c442ba)
- 📖 README Update: Visual Editor Showcase (1a3da5d)

### 🔧 Bug Fixes | Fehlerbehebungen

- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)

### 📚 Documentation | Dokumentation

- Update project to 'Violet Pool Card' and refresh documentation screenshots (01fd7d6)
- improve-readme-badges (7ed69bb)
- 🌐 Improve README: Fix badges & add bilingual structure (ea3e55c)
- Update README.md (bdd83d3)
- Add screenshots to README.md (6a7d97a)
- 📖 README Update: Visual Editor Showcase (1a3da5d)
- 📚 Phase C: Complete Documentation (8cb10ad)

---

## [1.0.0] - 2026-01-04

### Added (Sessions 9-10 - 2026-01-04)
- **Overview Card:** Water chemistry dashboard with traffic light indicators
- **Overview Card:** Active devices list with color-coded states
- **Overview Card:** Warnings section with frost protection alerts
- **Overview Card:** "All systems normal" indicator
- **Compact Card:** Auto-detected icons based on entity type
- **Compact Card:** Current value display (temp, level, pH, ORP)
- **Compact Card:** Enhanced detail status parsing
- **Compact Card:** Color-coded active/inactive icons
- **Compact Card:** Hover effect for better UX
- Responsive design with mobile optimizations (@media queries)
- Complete theme support (dark/light mode)
- ~220 lines of new CSS for overview and compact cards
- Full documentation update (README, examples)
- Final bundle size: 84KB (under 100KB target)

### Added (Sessions 5-8 - 2026-01-04)
- **Pump Card:** Runtime counter with h/min formatting
- **Pump Card:** RPM display for current speed level
- **Pump Card:** Icon animation (rotating) when pump is running
- **Pump Card:** Level badge showing current speed
- **Heater Card:** Outside temperature indicator
- **Heater Card:** Blockage warning when outside temp too low
- **Heater Card:** Icon animation (pulsing) when heating
- **Solar Card:** Pool temperature display
- **Solar Card:** Absorber temperature display
- **Solar Card:** Temperature delta calculation
- **Solar Card:** Color-coded delta hints (too cold/heating possible/ideal)
- **Dosing Card:** Current value display (pH/ORP)
- **Dosing Card:** Target value display
- **Dosing Card:** Min/Max threshold display
- **Dosing Card:** Auto-detect dosing type from entity ID
- **Dosing Card:** Icon selection based on dosing type
- **Dosing Card:** Dosing history (24h volume)
- Enhanced CSS animations (rotate, pulse-glow)
- Card-specific styling for all card types
- ~230 lines of new CSS for visual enhancements

### Added (Session 4 - 2026-01-04)
- Quick Actions Component with button grid layout
- Pump Card: 5 quick actions (OFF, AUTO, ECO, Normal, Boost)
- Heater Card: 3 quick actions (OFF, AUTO, HEAT)
- Dosing Card: 4 quick actions (OFF, AUTO, Dose 30s, Dose 60s)
- Confirmation dialogs for manual dosing
- Loading states with spinner animation
- Ripple effect on button clicks
- Touch-optimized buttons (min 48px)

### Added (Session 3 - 2026-01-04)
- Slider Control Component with touch optimization
- Service Caller Utility for all HA service calls
- Entity Helper Utility for state parsing and formatting
- Pump Card: Speed slider (0-3 with labels)
- Heater Card: Temperature slider with value display
- Debounced value changes (300ms)
- Toast notification support
- Error handling for service calls

### Added (Session 2 - 2026-01-04)
- Status Badge Component with 11 states and animations
- Value Display Component with status indicators and ranges
- Detail Status Component with auto-parsing and formatting
- Warning Chips Component with dismissable warnings
- Component integration in Pump, Dosing, and Compact cards
- Comprehensive component documentation (COMPONENT_DEMO.md)

### Added (Session 1 - 2026-01-04)
- Initial release
- Basic card structure with all card types
- Pump card (placeholder with status badge)
- Heater card (placeholder)
- Solar card (placeholder)
- Dosing card (placeholder with warning chips)
- Overview card (placeholder)
- Compact card (basic implementation with status badge)
- HACS compatibility
- TypeScript + Lit Element setup
- Rollup build system
- Full documentation (README.md, ROADMAP.md, QUICK_START.md)

---
