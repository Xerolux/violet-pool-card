## v0.4.1 – Violet Pool Card

✅ **STABLE RELEASE**

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

### 📦 Installation

**HACS (Recommended):**
1. Open HACS in Home Assistant
2. Go to "Frontend"
3. Click "+" and search for "Violet Pool Card"
4. Click "Download"
5. Restart Home Assistant

**Manual:**
1. Download `violet-pool-card.js` from the assets below
2. Copy to `config/www/violet-pool-card.js`
3. Add resource in Configuration → Lovelace Dashboards → Resources
   - URL: `/local/violet-pool-card.js`
   - Type: `JavaScript Module`
4. Restart Home Assistant

### ❤️ Support | Unterstützung

Diese Karte entsteht in meiner Freizeit. Wenn sie dir hilft, freue ich mich über Unterstützung:

- ☕ **[Buy Me a Coffee](https://buymeacoffee.com/xerolux)**
- 🚗 **[Tesla Referral Code](https://ts.la/sebastian564489)**
- ⭐ **Star this repository**
