---
hidePage: true
category: 'Core'
version: 'v6.0.0'
date: '2026-10-15'
---

### Design & Entwicklung

#### Hinzugefügt

- Breadcrumb, Paragraph, Text Group: Diese Komponenten sind jetzt als Beta-Release verfügbar.
- Farben: Lilac ist als neue Markenfarbe in der Farbpalette der Foundation verfügbar.
- Typografie: Der neue Headline-Font steht als zusätzlicher Schriftschnitt in der Foundation bereit.
- Heading: H1 erhält „Wide ExtraBlack“ als zusätzliche Font-Weight-Property.

#### Geändert

- **BREAKING CHANGE** (visual) Markendesign: Alle betroffenen Komponenten wurden auf das neue Markendesign aktualisiert.
  - Eckenradius: Die Tokens 3xs–3xl sind jetzt 0 px. `border-radius-full` bleibt unverändert, damit runde Komponenten wie Badges oder Radios ihre Form behalten.
  - Betroffene Komponenten: Accordion, Badge, Button, Card, Checkbox, Control Panel, Custom Select, Dialog, Drawer, Heading, Input, Link, Loading Indicator, Notification, Pagination, Popover, Select, Shell, Tabs, Tag, Textarea, Tooltip
- **BREAKING CHANGE** Heading: Die Property „Size“ wurde durch „Visual Size“ ersetzt. Die Visual Size entkoppelt die Darstellung von der semantischen Stufe, sodass jede Heading visuell die Größe einer beliebigen anderen Stufe einnehmen kann, ohne ihre eigene Semantik zu verlieren.
  - Design: Instanzen mit einer der entfernten Sizes sind nach dem Update nicht mehr korrekt verknüpft und müssen nachgezogen werden.

#### Deprecated

- Drawer: Die Property „rounded“ ist deprecated und wird mit einem der nächsten Major Releases entfernt.

#### Entfernt

- **BREAKING CHANGE** Heading: Die Properties „Alignment“ und „Paragraph Spacing“ wurden entfernt.
  - Design: Die Ausrichtung setzt du am Layer innerhalb der Komponente. Instanzen mit einer anderen Ausrichtung als „Left“ sind nach dem Update nicht mehr korrekt verknüpft und müssen nachgezogen werden.
  - Entwicklung: Die Ausrichtung setzt du mit `text-align` auf der Heading selbst, den Blockabstand über das Opt-in `data-text-spacing` aus der Foundation.

### Design

#### Geändert

- **BREAKING CHANGE** Drawer: Der Heading-Text des Drawer Headers liegt jetzt in einem Children Slot, konsistent zum Dialog Header und zur Entwicklung.
  - Kopiere den Heading-Text vor dem Update – das Update setzt den bestehenden Inhalt zurück.

### Entwicklung

#### Geändert

- **BREAKING CHANGE** Stack: Der Default `block-size: 100%` wurde entfernt und durch die expliziten Properties `width` und `height` ersetzt.
  - `width` (`full` | `auto`, Default `full`) und `height` (`full` | `auto`, Default `auto`) steuern die Abmessungen des Stacks.
  - Verschachtelte Stacks dehnen sich nicht mehr auf die Höhe des Elternelements. Mit `height="full"` erhältst du das vorherige Verhalten zurück.
- **BREAKING CHANGE** Dialog, Drawer: Die Styles des nativen `dialog`-Elements sind jetzt auf `.db-dialog` und `.db-drawer` gescopet. Native `<dialog>`-Elemente außerhalb des Design Systems werden nicht mehr gestylt, das Rendering von `DBDialog` und `DBDrawer` bleibt unverändert.
- **BREAKING CHANGE** Heading: `visualSize` nimmt Heading-Level (`h1`–`h6`) und Paragraph-Größen (`p-small`, `p-medium`, `p-large`) statt der abstrakten Skala `3xl`–`3xs`. Das Attribut heißt jetzt `data-visual-size` statt `data-size`.
- **BREAKING CHANGE** MCP Server, Agent CLI: Die Executables wurden auf ein einheitliches `db-ux-` Prefix umbenannt: `mcp-server` heißt jetzt `db-ux-mcp-server`, `agent-cli` heißt jetzt `db-ux-agent-cli`.
- **BREAKING CHANGE** MCP Server, Agent CLI: Die öffentliche API nutzt generationsbasiertes Naming statt der Kurzform `v2` / `v3`.
  - Das Tool `scan_v2_migration` heißt jetzt `scan_generation_2_migration`.
  - Die `source_context`-Werte folgen dem Muster `db-ux-generation-3`.
  - Das Skill `migrate-to-v3` heißt jetzt `migrate-to-generation-3`.
- Typografie: Blocktext (`h1`–`h6`, `p`) hat standardmäßig kein `margin-block`. Das Opt-in `data-text-spacing="true"` ergänzt den Abstand, mit `data-text-spacing="false"` nimmst du einen Teilbaum wieder heraus.
- Tooltip: Der hartkodierte `border-radius` am Tooltip-Pfeil wurde entfernt, die Rundung folgt jetzt den `db-border-radius` Tokens.
- Loading Indicator: `stroke-linecap: round` wurde am kreisförmigen Segment entfernt, dadurch sind die Segmentenden nicht mehr abgerundet.
- Drawer: `DBHeader` und `DBControlPanelMobile` setzen die deprecated Property `rounded` intern nicht mehr.

#### Entfernt

- **BREAKING CHANGE** Dialog: Der veröffentlichte Entry Point `@db-ux/core-components/build/styles/dialog-init` wurde entfernt. Die Variablen `$backdrop-color-strong` und `$backdrop-color-weak` liegen jetzt in den internen Dialog-Styles.

#### Behoben

- Stack: Der Focus Ring von Kindelementen wird nicht mehr abgeschnitten. Der Stack ist kein Scroll-Container mehr, dadurch bleiben Fokus-Indikatoren vollständig sichtbar.
- Heading: Default-Headings behalten ihre Größe und reagieren weiterhin auf `data-density`, auch wenn `default-fonts` nicht importiert ist.
