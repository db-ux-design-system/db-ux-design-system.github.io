---
hidePage: true
category: 'Core'
version: 'v6.1.0'
date: '2026-10-22'
---

### Design

_version bump_

### Entwicklung

#### Hinzugefügt

- Heading: Die Font-Weights lassen sich jetzt pro Theme über `OverwriteHeadingFontWeights` überschreiben.

#### Behoben

- Custom Select: Die entfernbaren Tags im Modus `selectedType="tag"` rendern nicht mehr innerhalb des interaktiven `<summary>`, womit der Nested-Interactive-Verstoß (WCAG 4.1.2) behoben ist. Die öffentliche API (Props, Events, Custom-Element-Tags) bleibt unverändert, nur die gerenderte HTML-Struktur hat sich geändert.
  - Wenn du das Markup selbst kopiert hast, zieh die neue Struktur nach: Die Feldbox ist jetzt ein umschließendes `<div class="db-custom-select-form-field">` um das `<details>` – vorher trug das `<summary>` diese Klasse.
  - Der Toggle ist ein leeres `<summary class="db-custom-select-summary">`, die Auswahl wird daneben statt darin gerendert.
  - Ausgewählte Labels rendern jetzt in `<span class="db-custom-select-label">`, Tags in `<div class="db-custom-select-tags">`.
  - Der Clear-Button ist jetzt ein `<button class="db-custom-select-clear">` als Flex-Element im Feld, statt darüber positioniert zu sein.
- Foundation: Die Assets in `theme/relative.css`, `fonts/relative.css` und `icons/relative.css` werden jetzt relativ zum Package-Root aufgelöst. Der Standard-Asset-Pfad ändert sich von `../../assets/` zu `../../../assets/`, sodass Fonts und Icon-Fonts direkt im Package gefunden werden, z. B. beim Laden von einem CDN.
  - **Aktion erforderlich**, wenn du `build/styles/` und `assets/` nebeneinander in deinen Public-Ordner kopierst: Behalte die Package-Struktur bei (`build/styles/` neben `assets/`) oder überschreibe `$icons-path`, `$fonts-path` und `$images-path`.
- ESLint Plugin (`select-requires-options`): Die Regel erkennt jetzt auch Options, die über Control Flow, Schleifen und `<optgroup>` gerendert werden. Erkannt werden Angular `@for`/`@if`/`@switch`, `*ngFor`/`*ngIf` und `ng-container`, Vue `<template v-for>`, React Fragments, `&&`-/Ternary-Ausdrücke und `.map()` sowie `<optgroup>` in allen Frameworks.
