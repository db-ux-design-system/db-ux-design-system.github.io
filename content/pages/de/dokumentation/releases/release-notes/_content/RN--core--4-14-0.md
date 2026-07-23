---
hidePage: true
category: 'Core'
version: 'v4.14.0'
date: '2026-07-09'
---

### Design

#### Behoben

- Tag: Die Slot-Notiz ist jetzt für alle Varianten verfügbar. Zuvor wurde sie nur für die statische Weak-Variante angezeigt.

### Entwicklung

#### Hinzugefügt

- Angular Signal Forms-Unterstützung für reaktive Formular-Komponenten. Fügt Validation Bridge, Version Detection Utilities und Post-Build-Script-Updates für Angular Signal Model/Output-Generierung hinzu. Aktualisiert Angular Showcase Formular-Komponenten zur Demonstration der Signal Forms-Nutzung.

#### Geändert

- Optimierte Positionierungslogik für Floating-Komponenten (Tooltips, Popovers, Custom Selects, Tabs) durch gemeinsame abstrakte Listener-Klassen, was Code-Duplizierung reduziert und die Wartbarkeit verbessert.

#### Behoben

- Tailwind: Die `text-body-*`- und `text-head-*`-Tailwind-Typografie-Utilities erlauben jetzt `font-weight`-Überschreibungen (wie font-bold), ohne ihr Standard-Token-Gewicht zu verlieren. Dies behebt ein Problem, bei dem die Font-Shorthand `font-weight` zurücksetzte und Tailwind font-weight-Utilities nicht funktionierten.
- Accordion: Korrekte Varianten-Hintergründe passend zum Design (Divider ist transparent, Card ist level-1 inklusive des offenen Inhaltsbereichs).
- `inline-flex` mit `align-items: center` für Link-Komponenten verwendet, um Text mit fester Höhe über alle Densities vertikal zu zentrieren.
- Sichergestellt, dass die speziellen `key`/`track`-Attribute innerhalb unserer Komponenten einzigartig sind.
