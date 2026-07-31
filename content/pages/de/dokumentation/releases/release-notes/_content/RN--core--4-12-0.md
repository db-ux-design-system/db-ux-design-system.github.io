---
hidePage: true
category: 'Core'
version: 'v4.12.0'
date: '2026-06-18'
---

### Design

#### Hinzugefügt
- Checkbox, Infotext, Radio, Switch, Tooltip: Children-Slots wurden für Komponenten in voller Breite hinzugefügt.
- Mehrere Komponenten: Slot-Einstellungen wurden verbessert.

#### Behoben
- Tag: Der Größen-Bug beim entfernbaren Tag wurde behoben.

### Entwicklung

#### Hinzugefügt
- Shell: Eine neue `--db-logo-short` CSS-Variable ist für die neue DB Shell verfügbar.

#### Behoben
- ESM: Alle generierten Ausgaben (React, Vue, Web Components) erzeugen jetzt spezifikationskonformes ESM mit expliziten Import-Erweiterungen. Dies behebt `ERR_UNSUPPORTED_DIR_IMPORT` in strikten ESM-Umgebungen wie Node.js nativem ESM und Vitest 4.
