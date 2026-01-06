# One Platform – Documentation Overview

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
