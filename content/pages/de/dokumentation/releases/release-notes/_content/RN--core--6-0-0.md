---
hidePage: true
category: 'Core'
version: 'v6.0.0'
date: '2026-10-09'
---

### Design & Entwicklung

#### Hinzugefügt

- Breadcrumb, Paragraph, Text Group: Diese Komponenten sind jetzt als Beta-Release verfügbar.
- Farben: Lilac ist als neue Markenfarbe in der Farbpalette der Foundation verfügbar.
- Typografie: Der neue Headline-Font steht als zusätzlicher Schriftschnitt in der Foundation bereit.
- Heading: H1 erhält „Wide ExtraBlack“ als zusätzliche Font-Weight-Property.

#### Geändert

- **BREAKING CHANGE** (visual) Markendesign: Alle betroffenen Komponenten wurden auf das neue Markendesign aktualisiert.
  - Eckenradius: Die Tokens 3xs–3xl sind jetzt 0px. `border-radius-full` bleibt unverändert, damit runde Komponenten wie Badges oder Radios ihre Form behalten.
  - Betroffene Komponenten: Accordion, Badge, Button, Card, Checkbox, Control Panel, Custom Select, Dialog, Drawer, Heading, Input, Link, Loading Indicator, Notification, Pagination, Popover, Select, Shell, Tabs, Tag, Textarea, Tooltip
- **BREAKING CHANGE** Heading: Die Property „Size“ wurde durch „Visual Size“ ersetzt. Die Visual Size entkoppelt die Darstellung von der semantischen Stufe, sodass jede Heading visuell die Größe einer beliebigen anderen Stufe einnehmen kann, ohne ihre eigene Semantik zu verlieren.

#### Deprecated

- Drawer: Die Property „rounded“ ist deprecated und wird mit einem der nächsten Major Releases entfernt.

#### Entfernt

- **BREAKING CHANGE** Heading: Die Property „Alignment“ wurde entfernt.

### Design

#### Geändert

- **BREAKING CHANGE** Drawer: Der Heading-Text des Drawer Headers liegt jetzt in einem Children Slot, konsistent zum Dialog Header und zur Entwicklung.
