---
hidePage: true
category: 'Core'
version: 'v4.4.0'
date: '2026-01-26'
---

### Entwicklung

#### Geändert
- Select: Bei required Selects mit Placeholder wird die leere erste Option jetzt automatisch nach der ersten Auswahl des Nutzers ausgeblendet. Dieses Verhalten kann über die neue `showEmptyOption`-Prop überschrieben werden.

#### Hinzugefügt
- Notification: Die neue `role`-Property wurde hinzugefügt. Wenn weder `role` noch `ariaLive` gesetzt ist, wird die Rolle automatisch basierend auf der Semantik für eine bessere Screenreader-Erfahrung zugewiesen.
