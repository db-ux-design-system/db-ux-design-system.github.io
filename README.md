# One Platform

## 📝 Creating and Managing Content

All content pages are located inside the `/content/pages/` directory. 
Each folder in this directory represents a **section**, and every section must contain an `index.md` 
(or `index.mdx`) file as the main entry for that topic.

Astro automatically scans this folder structure and builds the navigation tree based on the files it finds — no 
manual configuration is required.


### 📁 Folder structure example

```
    content/
    └── pages/
        ├── index.mdx                        → homepage (not shown in navigation)
        ├── products-and-services/
        │   ├── index.md                     → “Products & Services” (main navigation item)
        │   ├── foundations/
        │   │   └── index.md                 → child page under “Products & Services”
        │   └── components-and-patterns/
        │       └── index.md                 → child page under “Products & Services”
        └── resources/
            ├── documentation/
            │   ├── index.md                 → “Documentation” (has subnavigation)
            │   ├── getting-started/
            │   │   └── index.md             → subpage
            │   └── foundations/
            │       └── index.md             → subpage
```


### 🧩 Frontmatter properties

Each `index.md` (or `index.mdx`) file begins with a **frontmatter block**. That's the configuration area between `---` lines at the top of the file.

Example:

```
---
layout: "@template/layouts/default"
title: "Foundations"
order: 2
isSubNavigation: false
hidePage: false
iconTrailing: "arrow_right"
---
```

Below is an explanation of each field:

| Property              | Type      | Default  | Description                                                                                                                                                                                                            |
|-----------------------|-----------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`layout`**          | `string`  | required | Always use `@template/layouts/default` for standard pages.                                                                                                                                                             |
| **`title`**           | `string`  | —        | The name shown in the navigation and as the page headline.                                                                                                                                                             |
| **`hidePage`**        | `boolean` | `false`  | If set to `true`, this page will **not** be directly visible in the navigation and users will be redirected to the first visible child page instead. Useful for sections that act as folders rather than actual pages. |
| **`order`**           | `number`  | optional | Defines the order of this page among its siblings. Lower numbers appear first.                                                                                                                                         |
| **`isSubNavigation`** | `boolean` | `false`  | When set to `true`, the page acts as a **parent with subpages**. On any of its child pages, a sub-navigation will automatically appear, highlighting the current child.                                                |
| **`iconTrailing`**    | `string`  | optional | Optional trailing icon displayed next to the navigation label (uses DB UX icon names).                                                                                                                                 |


### 🧭 How navigation is generated

1. Main Navigation
   * Each top-level folder under `content/pages/` becomes a main navigation entry.
   * The order of these main items is determined by the `order` property in their respective `index.md` files.
   * The root homepage (`content/pages/index.mdx`) is automatically excluded.

2. Subpages
   * Every subfolder inside a main section appears as a child item in the navigation.
   * Their `order` values define their position within the group.

3. Sub-Navigation
   * If a parent page (like `Documentation`) has `isSubNavigation: true`, then on its child pages, a local sub-navigation bar will be shown.
   The current child page will appear highlighted in that bar.

4. Hidden Pages
   * If `hidePage: true`, the page itself is not listed in the navigation.
   * When a user clicks the parent item, they will be taken directly to the first visible child page instead.


### ✅ Best practices

* Always include a title and layout in every page’s frontmatter.
* Use `order` values like `1, 2, 3…` for clarity.
* Avoid duplicate titles in the same folder level.
* For “section overview” pages that should not have content themselves, set  `hidePage: true` and place the actual content in child pages.
* Only set `isSubNavigation: true` on parent pages that have multiple related subpages.
\n+## 🎨 TextImage Bildmasken
\n+Der `TextImage` Komponenten-Prop `mask` erlaubt weiche Ausblendungen (Fades) an einer oder zwei Kanten – ähnlich wie bei linear.app.
\n+### Verwendung
\n+```astro
<TextImage
   title="Beispiel"
   imageSrc="/assets/example.png"
   imageAlt="Beispiel Illustration"
   mask="fade-bottom-right"
>
   Beschreibungstext …
</TextImage>
```
\n+### Unterstützte Werte
\n+Einzelne Richtungen:
* `fade-right`
* `fade-left`
* `fade-top`
* `fade-bottom`
\n+Ecken (Kombination aus zwei Fades):
* `fade-bottom-right`
* `fade-bottom-left`
* `fade-top-right`
* `fade-top-left`
\n+### Technische Umsetzung
* Realisiert über CSS `mask-image` bzw. `-webkit-mask-image` mit zwei linearen Gradients bei Eck-Varianten.
* Die Gradients werden via `mask-composite: intersect` (WebKit: `-webkit-mask-composite: source-in`) kombiniert.
* Fallback: Browser ohne Mask-Unterstützung zeigen das Bild unverändert (keine zusätzliche Logik nötig).
\n+### Hinweise & Anpassung
* Die Intensität (z.B. 20% → 100%) kann bei Bedarf zentral in der CSS Datei (`TextImage.css`) angepasst werden.
* Für individuelle Projekte können weitere Varianten über zusätzliche `data-mask` Selektoren ergänzt werden.
\n+### Barrierefreiheit
* Die Maskierung beeinflusst nur die visuelle Darstellung, nicht den Alternativtext – `alt` sollte weiterhin aussagekräftig bleiben.