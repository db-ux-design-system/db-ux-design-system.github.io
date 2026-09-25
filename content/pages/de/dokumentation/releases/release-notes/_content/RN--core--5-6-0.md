---
hidePage: true
category: 'Core'
version: 'v5.6.0'
date: '2026-09-25'
---

### Design & Entwicklung

#### Hinzugefügt

- Loading Indicator: Eine neue Komponente für Ladezustände wie Spinner und Fortschrittsbalken.
- Dialog: Neue Komponenten `DBDialog`, `DBDialogHeader` und `DBDialogFooter`, die auf dem nativen `<dialog>`-Element aufbauen und dessen Zentrierung sowie Top-Layer-Verhalten nutzen.
- Pagination: Eine neue kontrollierte Pagination-Komponente.
- Button: Neue Zustände für Loading und Loading Overlay.
- Custom Select: Loading Indicator im Ladezustand des Dropdowns ergänzt.

### Design

#### Behoben

- Tag: Die Position des Content Slots wurde korrigiert und fehlende Slots wurden ergänzt.

### Entwicklung

#### Geändert

- DBDrawer: Neue Props `onClick` und `onCancel` an `DBDrawerProps`, analog zu `DBDialog`.
- MCP server: Der Server antwortet jetzt in beiden Protokoll-Epochen, dem `initialize`-Handshake von 2025 und der neuen Revision 2026-07-28 (`server/discover`-Probe). Hosts, die 2026-07-28 noch nicht übernommen haben, funktionieren unverändert weiter.

#### Behoben

- DBDrawer: Barrierefreiheit, Schließen-Verhalten und der geteilte Dialog-Layer wurden überarbeitet.
- MCP server: Das Matching von `docs_search` und der Bericht von `scan_v2_migration` wurden korrigiert.
- MCP server: `get_example_code` bietet `html` nicht mehr an, und ein toter Transport scheitert jetzt schnell.
- MCP server: `assets/` wird jetzt im veröffentlichten Bundle korrekt aufgelöst. Der Pfad ist am Paket-Root verankert, sodass `list_visuals`, `get_visual_reference` und `get_design_tokens` (inklusive der Kategorien `elevation`, `border` und `opacity`) im veröffentlichten Paket funktionieren.
- MCP server: `get_example_code` liefert im Fehlerfall jetzt eine lesbare Meldung. Der Catch-Block überschattet den importierten `error()`-Helper nicht mehr, sodass der Host das beabsichtigte lesbare Ergebnis statt eines undurchsichtigen JSON-RPC-Fehlers erhält.
