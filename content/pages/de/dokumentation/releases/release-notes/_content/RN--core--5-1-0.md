---
hidePage: true
category: 'Core'
version: 'v5.1.0'
date: ''
draft: true
---

### Design & Entwicklung

#### Hinzugefügt
- Shell: Die neue Komponente für Seitenlayouts ist jetzt mit Desktop- und Mobile-Varianten verfügbar.
  - Subkomponenten: Shell Subnavigation, Shell Content
- Control Panel: Die neue Komponente ersetzt die deprecated Header und Navigation.
  - Desktop-Varianten (top/left) und Mobile-Varianten (top/bottom)
  - Navigationstypen: Popover, Tree, Flat Icon
  - Subkomponenten: ControlPanel Brand, ControlPanel PrimaryActions, ControlPanel SecondaryActions, ControlPanel MetaNavigation

#### Deprecated
- Header, Navigation: Diese Komponenten wurden durch Control Panel und Shell ersetzt und werden in einem zukünftigen Release entfernt.

### Design

#### Geändert
- Button: FloatingContainer wurde integriert.

#### Behoben
- Button: Die feste Breite des Icon-Buttons wurde korrigiert.
- Scrollbar: Die Resizer-Hilfskomponente wurde behoben.
