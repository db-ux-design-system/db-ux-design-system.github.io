---
hidePage: true
category: 'Core'
version: 'v4.7.0'
date: '2026-04-28'
---

### Design

#### Hinzugefügt
- Components: Versionierung auf Komponentenebene wurde eingeführt.
  - Jede Komponente wird jetzt im Hintergrund mit der Versionsnummer ihres letzten Updates versehen – unsichtbar für Nutzer und ohne Auswirkung auf bestehende Designs.
  - Diese Information dient als Grundlage für potenzielle Migrationsunterstützung in zukünftigen Major Releases mit Breaking Changes.
  - Empfehlung: Komponenteninstanzen aktuell halten – nur aktuelle Instanzen können bei Major Releases mit Unterstützung migriert werden.

### Entwicklung

#### Behoben
- Select: Das leere `option`-Element (gerendert bei Select-Elementen mit Placeholder oder "Floating Label"-Variante) wird jetzt ausgeblendet, sobald das `select` geöffnet wird, anstatt erst nach Auswahl einer anderen Option.

#### Geändert
- Notification: Der Inhaltsbereich unterstützt jetzt beliebige Block-Level-Elemente, nicht nur reinen Text.
