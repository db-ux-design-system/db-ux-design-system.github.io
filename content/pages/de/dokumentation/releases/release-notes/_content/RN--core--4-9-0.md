---
hidePage: true
category: 'Core'
version: 'v4.9.0'
date: '2026-05-20'
---

### Design

#### Hinzugefügt
- Mehrere Komponenten: "Children"- und "Content"-Slots wurden hinzugefügt.
  - Accordion Item, Notification: "Children"-Slot unterhalb des Textinhalts
  - Badge (Text), Button, Link, Infotext (Auto Width), Tooltip (Auto Width): "Children"-Slot rechts vom Text
  - Checkbox (Auto Width), Radio (Auto Width), Switch (Auto Width): "Children"-Slot rechts vom Label
  - Tag: "Content"-Slot rechts vom Icon; "Children"-Slot rechts vom Text
  - Core-Komponenten mit verschachtelten Instanzen betroffener Komponenten wurden entsprechend aktualisiert.

### Entwicklung

#### Geändert
- Components: Die `text`-Property und die `children`-Property können jetzt gleichzeitig gesetzt werden.
