---
name: db-ux-community-teams-posting
description: Defines the format for DB UX Design System release posts in the Community Teams channel.
---

# Community Teams Release Posts

Use this format for release announcements in the Community Teams channel. Write the post in German unless the user requests another language.

## Standard format

Start each release with the scope and version as plain text:

```text
Core: v5.2.0

🎨 DESIGN & 💻 DEVELOPMENT

✨ Hinzugefügt

- **Component**: Short description
  - Additional detail

Danke für eure Unterstützung, liebe @MARKIERUNG 💕
Viel Freude beim Entdecken des neuen Updates.
```

## Sections

- Use `🎨 DESIGN` for design-only changes.
- Use `💻 DEVELOPMENT` for development-only changes.
- Use `🎨 DESIGN & 💻 DEVELOPMENT` when the same change affects both areas equally.
- Use separate area sections when design and development contain different changes. Repeat the relevant category under each area.

## Change categories

Use only categories that contain entries:

- `✨ Hinzugefügt` for new features, components, icons, variants, or capabilities.
- `✨ Geändert` for changes to existing features, status changes, visual updates, or technical adjustments.
- `✨ Behoben` for bug fixes.
- `✨ Entfernt` for removed features or files.

## Entry rules

- Start each entry with the affected component, topic, or icon in bold, followed by a colon.
- Use short, complete descriptions without commit prefixes such as `feat:` or `fix:`.
- Keep technical names, property names, icon names, and file paths in inline code.
- Use nested bullets for affected variants, implementation details, discipline-specific notes, or documentation links.
- Do not add a full stop to release bullets. The fixed closing sentences use punctuation.
- Mark breaking changes explicitly with `**BREAKING CHANGE:**` at the start of the affected entry or nested detail.
- Link the German and English documentation when a component or feature has a documentation page:
  `- Dokumentation: [Deutsch](DE_URL) · [English](EN_URL)`

## Status changes

A component that already existed as Concept or Beta is not a new component. Describe the status transition under `✨ Geändert`:

```text
✨ Geändert

- **Heading**: Die Komponente wurde von Concept zu Beta hochgestuft
  - Default Headings für die Level H1–H6
  - Custom Heading mit Slots
  - Dokumentation: [Deutsch](DE_URL) · [English](EN_URL)
```

## Multiple releases in one post

When announcing multiple releases in one Teams post, repeat the complete structure for each release, including its title, area sections, categories, entries, and fixed closing. Use the same format for Core, DB Theme Icons, and other Design System packages.
