# design-system.deutschebahn.com (internal domain: db-ux-design-system.github.io)

![Apache 2.0 license badge](https://img.shields.io/badge/License-Apache_2.0-blue.svg)

This repository contains the One Platform site for DB UX Design System.
Pages are written in MDX/MD and are auto-mapped to navigation from folder structure.

---

## 📁 Content Structure Rules

`content/pages/**` defines the entire site structure.

Every folder containing `index.md` or `index.mdx` becomes a navigation entry.
No manual app.navigation.ts is required.

Example folder layout:

```
content/
└── pages/
├── home/                          ← start page (hidden)
│   └── index.mdx
├── products-and-services/
│   ├── index.md
│   └── foundations/index.md
└── resources/
└── documentation/
├── index.md
├── getting-started/index.md
└── foundations/index.md
```

---

## 🧾 Frontmatter Reference

Field / Type / Default / Purpose

title (string) – required for nav label + page title
order (number) – optional sorting priority
hidePage (boolean) – false = visible, true = only child pages visible
isSubNavigation (boolean) – enables local sub-nav for children
iconTrailing (string) – optional icon for nav entry
layout (string) – MUST always be "@template/layouts/default"

Example:

```
---
layout: "@template/layouts/default"
title: "Documentation"
order: 1
isSubNavigation: true
hidePage: false
---
```

---

## 🔥 Navigation Behavior

✓ Every folder = navigation node  
✓ If folder contains nested pages → they render as children  
✓ If `isSubNavigation: true` → sub-nav appears inside Shell  
✓ If `hidePage: true` → clicking parent opens first child instead  
✓ `order` controls sorting at same level

---

## 🧩 Component Architecture — Best Practices

| Type                                     | Location                                 |
| ---------------------------------------- | ---------------------------------------- |
| Reusable UI components                   | template/components/                     |
| Page-specific components                 | content/pages/\*\*/\_components/         |
| Shared styling                           | same folder as component (component.css) |
| Interactive React islands                | template/interactive/ + astro wrapper    |
| Config content (Text blocks, image refs) | content/pages/\*\*/xxx.config.ts         |

Rules:

- No inline styles in `.astro` files → always external CSS
- MD/MDX may contain only content — no component logic
- If a component needs state → convert into React Island
- Dark/light image mapping handled inside component, not page

---

## 🎨 Dark / Light Theme Rules

Theme lives only inside DB-Shell DOM.

Set via:

`data-mode="dark" | "light"`

Use:

`import { useColorMode } from template/context/ColorModeProvider`

Do not:

⛔ apply theme on <html> or <body>  
⛔ duplicate theme logic across components

---

## ⚙️ Interactive Component Pattern (React Islands)

1. Write UI in `template/interactive/MyComponent.tsx`
2. Wrap with `MyComponent.astro`
3. Load only where needed in MDX

Client hydration options:

```
client:idle    (recommended low-impact)
client:visible (best performance)
client:load    (only when required instantly)
```

Never hydrate the entire Shell.

---

## 🚀 Performance Guidance

Before production go-live:

• run Vite bundle-analyzer  
• inspect assets in Chrome → Network > Size  
• convert hero + testimonial images to WebP  
• lazy-load all non-critical visuals  
• 3D GLB assets must NOT load eager

Target target first-load bundle < 2 MB

## Deutsche Bahn brand

As we'd like to perfectly support our users and customers on their digital journey, the usage of Deutsche Bahn brand and trademarks are bound to clear guidelines and restrictions even when being used with the code that we're providing with this product.
Deutsche Bahn fully reserves all rights and ownership regarding the Deutsche Bahn brand, even though that we're providing the code of DB UI products free to use and release it under the Apache 2.0 license.
Please have a look at our [brand portal](https://marketingportal.extranet.deutschebahn.com/) for any further questions and whom to contact on any brand issues.

As these assets and visual guidelines are retrieved from our Deutsche Bahn Marketingportal, you'll agree with the ["Allgemeine Nutzungsbedingungen für das DB-Marketingportal" (german)](https://marketingportal.extranet.deutschebahn.com/marketingportal/Nutzungsbedingungen-9702684) in case of using them.

For any usage outside of Deutsche Bahn websites and applications you must remove or replace any Deutsche Bahn brand and design assets as well as protected characteristics and trademarks. We're even also planning to provide a neutral theme that would make it much easier for you to use our product without the trademarks by Deutsche Bahn.

This especially relates to (but doesn't exclude further Deutsche Bahn brand assets) the file `db_logo.svg` that is duplicated in several different places.

## License

The DB source code is licensed under the Apache License, Version 2.0, January 2004;
you may not use this file except in compliance with the License. You may obtain a copy
of the Apache License at <https://apache.org/licenses/LICENSE-2.0>. The DB source code
does not include any DB specific design assets like fonts, icons, trademarks, brandings, etc.

[Apache 2.0 license](LICENSES/Apache-2.0.txt)

All Deutsche Bahn AG (hereinafter “DB”) specific design assets like fonts, icons,
trademarks, brandings, etc. (hereinafter “DB Designs”) are licensed under the following
license agreement (the “DB Designs License”):

[DB Designs License](LICENSES/LicenseRef-DB-Designs-License.txt)

Furthermore we're using a font and icon font that have been release by third party in a [CC0 1.0 license](LICENSES/CC0-1.0.txt) and we're providing our test snapshots by this very same [CC0 1.0 license](LICENSES/CC0-1.0.txt).
