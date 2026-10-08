---
hidePage: true
category: 'Core'
version: 'v5.7.0'
date: '2026-10-08'
---

### Design

_version bump_

### Entwicklung

#### Hinzugefügt

- Tooltip: Die Verzögerung beim Einblenden lässt sich jetzt über die Custom Property `--db-animation-delay` anpassen.

#### Geändert

- Select: Die leere Option eines Selects mit Placeholder oder Floating Label trägt jetzt das native Attribut `hidden`, statt über eine bedingte Style-Regel ausgeblendet zu werden. Der Zustand liegt damit im Markup.
  - Wenn du das Markup selbst schreibst und dich darauf verlassen hast, dass unser Stylesheet `data-show-empty-option="false"` ausblendet, setze stattdessen `hidden` auf diese Option.

#### Behoben

- Popover: Der Abstand entspricht jetzt dem des Tooltips und nutzt `$db-spacing-fixed-sm` statt `$db-spacing-fixed-md`, passend zum Design.
- Control Panel: Action Groups über die volle Breite brechen jetzt in die nächste Zeile um, statt horizontal überzulaufen – sowohl im Drawer Footer auf Mobilgeräten als auch in der vertikalen Ausrichtung auf dem Desktop.
- Custom Select: Die Tastaturnavigation überspringt Gruppentitel jetzt einheitlich in React, Vue, Angular und Web Components, indem sie die flache Liste der Option-Inputs durchläuft.
- Dialog Header: Das `aria-labelledby` des Dialogs wird jetzt erst nach dem Weiterreichen der Attribute zusammengesetzt, sodass ein `aria-label` oder `aria-labelledby` der Consumer in den Angular- und Web-Component-Ausgaben nicht mehr durch einen veralteten Token überschrieben wird.
- Icons: Der Layout-Shift während des Ladens der Icon-Schrift tritt in WebKit nicht mehr auf.
- Tabs: Eine vertikale Tab-Liste innerhalb horizontaler Tabs zeigt bei gebrochenem Browser-Zoom keinen überflüssigen vertikalen Scrollbalken mehr und verhält sich damit wie eine eigenständige vertikale Tab-Liste.
