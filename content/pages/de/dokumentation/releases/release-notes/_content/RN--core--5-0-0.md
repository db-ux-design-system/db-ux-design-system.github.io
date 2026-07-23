---
hidePage: true
category: 'Core'
version: 'v5.0.0'
date: '2026-07-14'
---

### Design & Entwicklung

#### Geändert
- **BREAKING CHANGE** Drawer: Die Layout-Struktur wurde mit einheitlichen Subkomponenten (DrawerHeader und DrawerFooter) und neuen konsistenten Containergrößen (small, medium, large, full, custom) standardisiert.
  - Design: Bestehende Instanzen werden nach dem Update zurückgesetzt.
  - Development: Einige Properties haben sich geändert und Unterstützung für Safe Areas wurde hinzugefügt.
- Tab: Die Komponente ist jetzt als Beta-Release verfügbar.
  - Development: **BREAKING CHANGE** – Signifikante HTML-Anpassungen aufgrund von Accessibility-Tool-Feedback sowie Umbenennung und Umstrukturierung von Properties.

### Design

#### Hinzugefügt
- Resizer: Eine dedizierte Hilfskomponente zum Resizen wurde hinzugefügt.

#### Geändert
- **BREAKING CHANGE** Accordion: Die Accordion List-Hilfskomponente wurde durch einen Children-Slot ersetzt. Bestehende Accordion-Instanzen werden nach dem Update zurückgesetzt.
- **BREAKING CHANGE** CustomSelect: Die CustomSelect List- und CustomSelect Tab List-Hilfskomponente wurde durch einen Children-Slot ersetzt. Bestehende CustomSelect-Instanzen mit offenen Dropdowns und ausgefüllten Feldern mit Tabs werden nach dem Update zurückgesetzt.
- **BREAKING CHANGE** Card, Popover: "Start Slot" und "End Slot" sind jetzt standardmäßig ausgeblendet (show slot = false).
- Properties: Property-Kategorien verwenden jetzt Icon-Präfixe für bessere Usability (🔀 Variantenauswahl, 👁️ Ein-/Ausblenden-Booleans, 📦 Slots, ✏️ Textebenen, 🔄 Swaps). Keine Aktion erforderlich.
- Scrollbar: Die Scrollbar verwendet jetzt intern die neue Resizer-Komponente. Benutzerdefinierte Anpassungen an Handle-Größe oder freier Position (z. B. in CustomSelect-Dropdowns) müssen nach dem Update erneut angewendet werden.

#### Entfernt
- **BREAKING CHANGE** Card, Popover, Section, Drawer: Die deprecated Komponenten wurden entfernt (deprecated seit v4.6).
- **BREAKING CHANGE** Accordion Item, Tag: Die deprecated Slot-Hilfskomponenten wurden entfernt (deprecated seit v4.6).
- **BREAKING CHANGE** Tooltip: Die deprecated Resizer-Ebene wurde entfernt.

#### Behoben
- Tooltip: Der Border-Radius ist jetzt konsistent mit der Code-Implementierung (strong) und wurde bei der Weak-Variante ergänzt, wo er fehlte.

### Entwicklung

#### Geändert
- **BREAKING CHANGE** (visual) Icon Pseudo-Elemente: Das Standard-`margin-inline` wurde von `[data-icon]` Pseudo-Elementen zugunsten eines `gap` entfernt.
- CSS Custom Properties: Properties werden nicht mehr auf dem `:host`-Selektor als Ergänzung zu `:root` definiert, da dies nicht mehr notwendig ist. Es werden keine Probleme erwartet – Feedback ist willkommen, falls welche auftreten.
- `@db-ux/core-migration`: Das deprecated Node-Paket wird nicht mehr unterstützt, da seine "Search and Replace"-Operationen zu einfach waren. Stattdessen wird KI- und/oder manuelle Migrationsarbeit empfohlen.
