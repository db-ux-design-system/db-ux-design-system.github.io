---
hidePage: true
category: 'Core'
version: 'v6.2.0'
date: '2026-10-30'
---

### Design

_version bump_

### Entwicklung

#### Hinzugefügt

- Button: Die nativen Formular-Attribute `formAction`, `formEncType`, `formMethod`, `formNoValidate` und `formTarget` sind jetzt als Properties verfügbar und werden am inneren `<button>` gerendert. So kann ein Submit-Button das Verhalten seines Formulars überschreiben, z. B. schließt `formMethod="dialog"` einen `<dialog>`.
- Control Panel Mobile: Der Drawer Header lässt sich jetzt anpassen. `closeButtonText` und `closeButtonId` konfigurieren den Close-Button, und der `header`-Slot ersetzt den internen Drawer Header, wenn `showDrawerHeaderSlot` gesetzt ist.
- Header: Der neue `header`-Slot ersetzt den internen Drawer Header, wenn `showDrawerHeaderSlot` gesetzt ist. So kannst du Action-Elemente oder einen Untertitel neben dem Close-Button platzieren.
  - Den Close-Button stellst du in diesem Fall selbst bereit, z. B. über `DBDrawerHeader`.
  - Web Components: Bei `db-header` hat der Slot keine Wirkung. Verwende stattdessen `db-control-panel-mobile`.

#### Behoben

- Select: Der Placeholder wird jetzt ausgeblendet, solange das Dropdown geöffnet ist, und überlagert bei der Tastaturnavigation nicht mehr den Text der Option.
