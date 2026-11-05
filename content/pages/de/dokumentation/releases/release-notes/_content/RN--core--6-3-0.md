---
hidePage: true
category: 'Core'
version: 'v6.3.0'
date: '2026-11-05'
---

### Design

_version bump_

### Entwicklung

#### Hinzugefügt

- Layout: Die Tablet- und Desktop-Breakpoints lassen sich über die Custom Properties `--db-tablet-breakpoint` und `--db-desktop-breakpoint` anpassen.
  - Das Shell Control Panel schaltet jetzt bei 1024px um (vorher 768px), angeglichen an Header. Mit `--db-desktop-breakpoint: 48rem` stellst du den vorherigen Wert wieder her.

#### Behoben

- Custom Select: Das Entfernen eines ausgewählten Tags in einem `multiple` + `selectedType="tag"` Select lässt die Web Component nicht mehr abstürzen.
- Divider: `variant="vertical"` streckt sich jetzt auf die volle Höhe seines Flex- oder Grid-Containers.
- Icons: Der Icon-Font (Whitelabel) liefert jetzt nur noch die tatsächlich genutzten Größen aus, was die veröffentlichten `@db-ux/core-foundations`-Assets verkleinert – ohne Änderung am Output, den Consumer laden.
