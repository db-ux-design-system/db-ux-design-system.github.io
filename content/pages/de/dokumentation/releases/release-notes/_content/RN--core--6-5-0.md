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

- Table: Zeilen lassen sich jetzt aufklappen. Setze dafür ein `<details>` in eine Zelle einer interaktiven Zeile und markiere sein `<summary>` mit `data-table-row-trigger="true"`, der geöffnete Inhalt erstreckt sich dann über die ganze Zeile unter den Zellen, auch mit `mobileVariant="list"`.
- Table: Die neue CSS Custom Property `--db-table-mobile-variant-list-grid-columns` legt die Spaltenaufteilung von Label und Inhalt in `mobileVariant="list"` fest, z. B. `30% 1fr` statt des Standards `40% 1fr`.
- Web Components: Ein optionaler Build mit `experimentalSlotFixes` von Stencil steht jetzt über `@db-ux/wc-core-components/slot-fixes` und `@db-ux/wc-core-components/bundle-slot-fixes` bereit, für Frameworks, die Slot-Inhalte zur Laufzeit umsortieren. Die Standard-Einstiegspunkte bleiben unverändert.

#### Geändert

- Table: Zellen einer Spalte, deren Header-Zelle `noText` hat, erhalten kein `data-header`-Attribut mehr und zeigen in `mobileVariant="list"` damit keinen Header-Text mehr als visuelles Label.
  - Wenn du das Markup selbst schreibst, setze `data-header` nur noch für Spalten mit sichtbarem Header-Text.

#### Behoben

- Table: Die Trennlinien in `mobileVariant="list"` werden jetzt einheitlich gezeichnet. Eine Kopfzeile mit interaktiven Elementen bleibt sichtbar, und der Doppelpunkt nach dem Label entfällt.
- Table: `mobileVariant="list"` wendet die Spaced-Styles auf breiten Bildschirmen nicht mehr an, sondern nur noch unterhalb des Breakpoints `sm` der Tabelle.
- Popover: Das Trigger-Element wird jetzt unabhängig von seiner Position gefunden, sodass `aria-expanded` und `aria-haspopup` auch in den Web Components zuverlässig gesetzt werden.
