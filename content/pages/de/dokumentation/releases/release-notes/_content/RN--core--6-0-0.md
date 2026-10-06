---
hidePage: true
category: 'Core'
version: 'v6.0.0'
date: '2026-10-09'
---

### Design & Entwicklung

#### Geändert

- **BREAKING CHANGE** Heading: Die Property „Size“ wurde durch „Visual Size“ ersetzt. Die Visual Size entkoppelt die Darstellung von der semantischen Stufe, sodass jede Heading visuell die Größe einer beliebigen anderen Stufe einnehmen kann, ohne ihre eigene Semantik zu verlieren.

#### Entfernt

- **BREAKING CHANGE** Heading: Die Property „Alignment“ wurde entfernt.

### Design

#### Geändert

- **BREAKING CHANGE** Drawer: Der Heading-Text des Drawer Headers liegt jetzt in einem Children Slot, konsistent zum Dialog Header und zur Entwicklung.
