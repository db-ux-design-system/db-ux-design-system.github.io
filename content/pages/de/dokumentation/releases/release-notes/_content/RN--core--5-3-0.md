---
hidePage: true
category: 'Core'
version: 'v5.3.0'
date: '2026-09-03'
draft: true
---

### Design & Entwicklung

#### Hinzugefügt
- Control Panel: Die neue Komponente ersetzt den deprecated Header und die deprecated Navigation.
  - Varianten: Desktop (Top/Left), Mobile (Top/Bottom), Flat Icon
  - Navigationstypen: Popover, Drill Down, Tree
  - Subkomponenten: Brand, Actions 1+2, Meta
- Shell: Die neue Komponente für Seitenlayouts ist jetzt mit Desktop- und Mobile-Varianten verfügbar.
  - Subkomponenten: Sub Navigation, Content

#### Deprecated
- Header, Navigation: Diese Komponenten werden von Beta auf Deprecated gesetzt. Sie wurden durch Control Panel und Shell ersetzt und werden in einem zukünftigen Release entfernt.

### Design

#### Hinzugefügt
- Floating Container: Die neue Helper-Komponente platziert zusätzliche Elemente an einer Trigger- oder Parent-Komponente.
- Button: Floating Container wurde integriert.
- Custom Select: Alle Komponenten sind jetzt in Title Case verfügbar.

#### Geändert
- Scrollbar, Tabs Vertical: Die duplizierte Resizer-Helper-Komponente wurde durch die ursprüngliche Resizer-Helper-Komponente ersetzt.

#### Behoben
- Button: Die fixe Breite des Icon-Buttons wurde korrigiert.

#### Deprecated
- Brand Komponenten der Foundation (Logo + Pulse) werden auf Deprecated gesetzt.