---
name: db-ux-community-teams-posting
description: Defines the format for DB UX Design System release posts in the Community Teams channel.
---

# Community Teams Release Posts

Use this format for release announcements in the Community Teams channel. Write the post in German unless the user requests another language.

## Output format: plain text, not Markdown

Teams does not render Markdown on paste, so the finished post is delivered as plain text. The Markdown notation in the examples below documents the structure only – it is not what gets handed over.

Leave out of the delivered text:

- Emphasis markers (`**bold**`, `_italic_`) and inline code backticks. Technical names, properties, and paths stay plain text.
- Markdown links (`[label](url)`). Write the full URL instead, after a label and a colon.
- List markers at the start of a line (`-`, `*`) and substitute bullet characters such as `•` or `◦`. The author applies Teams' own list formatting to the pasted lines, so any leading marker would have to be deleted by hand first.
- Character chains standing in for a horizontal rule (`---`, `———`). Note that Teams' own horizontal line is inserted at that position.

Keep the hierarchy readable with two spaces of indentation for sub-entries. Indentation is not a marker, so it needs no cleanup.

State which parts are to be emphasized manually in Teams: the component or topic name before the colon, `BREAKING CHANGE`, and the arrow labels in the major-release closing.

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

A step up to Beta is announced as a regular beta release under `✨ Hinzugefügt`, no matter whether the component existed as Concept before. The Concept status is not mentioned:

```text
✨ Hinzugefügt

- **Heading**: Die Komponente ist jetzt als Beta-Release verfügbar
  - Default Headings für die Level H1–H6
  - Custom Heading mit Slots
  - Dokumentation: [Deutsch](DE_URL) · [English](EN_URL)
```

Every other status transition stays under `✨ Geändert`, for example a step up from Beta to Stable or a move to Deprecated:

```text
✨ Geändert

- **Tag**: Die Komponente wurde von Beta zu Stable hochgestuft
```

## Closing

Minor and patch releases use the two fixed closing sentences shown in the standard format above.

Major releases use the longer major-release closing instead, separated from the last changelog entry by a horizontal rule (`---`), and additionally open with an intro above the first library block. Both blocks are documented in the content formatting steering under "Teams Posting Structure → Closing → Major releases". Their wording is fixed.

## Multiple releases in one post

When announcing multiple releases in one Teams post, repeat the complete structure for each release, including its title, area sections, categories, entries, and fixed closing. Use the same format for Core, DB Theme Icons, and other Design System packages.
