---
hidePage: true
category: 'Core'
version: 'v6.5.0'
date: '2026-11-26'
---

### Design

_version bump_

### Entwicklung

#### Hinzugefügt

- Table: Zeilen lassen sich jetzt über ein `<details>`-Element in einer Zelle einer interaktiven Zeile aufklappen, das `<summary>` mit `data-table-row-trigger="true"` öffnet den Inhalt unter der ganzen Zeile. Das funktioniert im Standard-Layout und mit `mobileVariant="list"`. [siehe Commit 0a6edf1](https://github.com/db-ux-design-system/core-web/commit/0a6edf193237f97372d1a5c94343a3cf0b166108)
- Table: Die neue CSS Custom Property `--db-table-mobile-variant-list-grid-columns` legt die Spaltenaufteilung von Label und Inhalt in `mobileVariant="list"` fest. [siehe Commit 19587f4](https://github.com/db-ux-design-system/core-web/commit/19587f46b1e3124283dd0477ed54db2205ee70af)
- Web Components: Eine optionale Build-Variante mit `experimentalSlotFixes` von Stencil steht über `@db-ux/wc-core-components/slot-fixes` und `@db-ux/wc-core-components/bundle-slot-fixes` bereit. Sie eignet sich, wenn ein Framework Slot-Inhalte zur Laufzeit umsortiert. [siehe Commit b32948e](https://github.com/db-ux-design-system/core-web/commit/b32948edd73c7268995cd7815e87157197218dcd)

#### Geändert

- Table: `data-header` wird nur noch für Spalten mit sichtbarem Header-Text gesetzt. Zellen einer Spalte, deren Header-Zelle `noText` nutzt, erhalten kein `data-header`-Attribut mehr. [siehe Commit 0a6edf1](https://github.com/db-ux-design-system/core-web/commit/0a6edf193237f97372d1a5c94343a3cf0b166108)

#### Behoben

- Table: Die Trennlinien in `mobileVariant="list"` werden jetzt einheitlich gezeichnet, eine Kopfzeile mit interaktiven Elementen bleibt sichtbar und der Doppelpunkt nach dem Label entfällt. [siehe Commit 19587f4](https://github.com/db-ux-design-system/core-web/commit/19587f46b1e3124283dd0477ed54db2205ee70af)
- Table: Die Spaced-Styles von `mobileVariant="list"` greifen nur noch unterhalb des Breakpoints `sm` der Tabelle. [siehe Commit 0a6edf1](https://github.com/db-ux-design-system/core-web/commit/0a6edf193237f97372d1a5c94343a3cf0b166108)
- Popover: Das Trigger-Element wird jetzt unabhängig von seiner Position gefunden, sodass `aria-expanded` und `aria-haspopup` auch in Web Components zuverlässig gesetzt werden. [siehe Commit b32948e](https://github.com/db-ux-design-system/core-web/commit/b32948edd73c7268995cd7815e87157197218dcd)
