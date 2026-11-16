---
hidePage: true
category: 'Core'
version: 'v6.4.0'
date: '2026-11-12'
---

### Design

_version bump_

### Entwicklung

#### Hinzugefügt

- Layout: Die Tablet- und Desktop-Breakpoints lassen sich jetzt über ein einzelnes vererbendes `--db-breakpoint`-Token anpassen. Komponenten schalten über eine Container Style Query um, sodass Consumer einen Schaltpunkt auf einem beliebigen Vorfahren verschieben oder ein Layout erzwingen können, ohne Media Queries anzufassen. [siehe Commit 78559f9](https://github.com/db-ux-design-system/core-web/commit/78559f9147423b1a243f3470f7868d0722496cf0)
- Table: Table Data Cell und Table Header Cell erhalten eine optionale `text`-Property als Alternative zum Slot, dazu ein überarbeitetes Zellen-Padding und Styling der ausgewählten Zeile. [siehe Commit e873176](https://github.com/db-ux-design-system/core-web/commit/e873176a18d90fd09dbf357b56daf851c2062d9e)
- Textarea: Mit der neuen CSS Custom Property `--db-form-component-min-block-size` lässt eine Mindesthöhe auf einer DBTextarea setzen, zum Beispiel damit eine `fieldSizing="content"`-Textarea auch im leeren Zustand Platz für ein paar Zeilen behält. [siehe Commit 7c9b6e7](https://github.com/db-ux-design-system/core-web/commit/7c9b6e7aebf0de7b030afd56dbb1331733231a1e)
