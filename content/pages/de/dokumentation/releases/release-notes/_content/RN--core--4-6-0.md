---
hidePage: true
category: 'Core'
version: 'v4.6.0'
date: '2026-04-09'
---

### Design

#### Hinzugefügt
- Card, Popover, Section: Neue Komponentenvarianten mit dem Figma-Slot-Feature wurden eingeführt. Inhalte werden direkt im Slot platziert, anstatt die separate Slot-Komponente zu verwenden.

#### Deprecated
- Card, Popover, Section: Die alten Varianten mit der Slot-Komponente wurden als deprecated markiert und werden in v5.0.0 entfernt.
  - Migration: Alle deprecated Varianten durch die neue Komponente ersetzen und Inhalte im Slot platzieren.

### Entwicklung

#### Hinzugefügt
- MCP Server: Das neue Paket [`@db-ux/mcp-server`](https://www.npmjs.com/@db-ux/mcp-server) verbindet KI-Coding-Assistenten (z. B. Amazon Q, GitHub Copilot, Claude) direkt mit dem DB UX Design System. Es stellt Komponenten-APIs, Framework-spezifische Code-Beispiele, Design Tokens und Icon-Namen als Single Source of Truth bereit. Vorgefertigte KI-Workflows für Scaffolding, Code Reviews, Migration und Accessibility-Audits sind enthalten.
- Vite Plugin: Das neue Paket [`@db-ux/core-vite-plugin`](https://www.npmjs.com/package/@db-ux/core-vite-plugin) stellt sicher, dass nur die tatsächlich genutzten Styles in der App enthalten sind. Erfordert `@db-ux/core-foundations` >= 4.6.0.
- PostCSS Plugin: Das neue Paket [`@db-ux/core-postcss-plugin`](https://www.npmjs.com/package/@db-ux/core-postcss-plugin) löst alle `--db-`-Variablen und Properties so weit wie möglich auf und schreibt z. B. Farb-Hex-Werte direkt in Custom Properties. Dies eliminiert die meisten Variablen-Referenzen und behebt DevTools-Probleme mit neueren Chromium-Browsern. Funktioniert unabhängig von anderen Paketversionen.

#### Geändert
- Foundations: Der Whitelabel-Theme-Fallback wurde entfernt – moderne Bundler binden ihn nicht in die Ausgabe ein, daher ist keine Aktion erforderlich, wenn das DB Theme verwendet wird.
- Tailwind v4: Variablen verwenden jetzt <a href="https://tailwindcss.com/docs/theme#referencing-other-variables" target="_blank" rel="noopener noreferrer">@theme inline</a>, was die Anzahl zusätzlicher Variablen deutlich reduziert. Keine Aktion erforderlich.

#### Behoben
- Input, Textarea: `undefined` als `value` wird jetzt korrekt unterstützt. Numerische Eingabewerte werden beim Eingeben eines Dezimaltrennzeichens nicht mehr gelöscht.
- Drawer: Benutzerdefinierte `max-width`/`max-height`-Werte werden nicht mehr durch interne `min-width`-Regeln überschrieben. Ein Positionierungsproblem mit verschachtelten fixed-Elementen (z. B. Custom Select Dropdowns) innerhalb des Drawers wurde ebenfalls behoben.
