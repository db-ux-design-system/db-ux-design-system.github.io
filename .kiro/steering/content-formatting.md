---
inclusion: fileMatch
fileMatchPattern: '**/*.{mdx,md}'
---

# Content Formatting

Rules for consistent formatting, structure, and typography across documentation content.

## Typography & Punctuation

- Dashes: En Dash with spaces ( – ), not Em Dash (—)
- Numbers: Use digits for ranges, measurements, and values (e.g. "2–6", "20 px")
- Number ranges: En Dash without spaces (e.g. "2–6", "1–2 levels")
- Single numbers in running text: spell out one- and two-syllable numerals ("zwei Kategorien", "drei Segmente"), use digits from three syllables up ("17 Komponenten")
- Lists: No period at the end of bullet points, period for full sentences

## Emphasis

- Use bold in longer texts to make key terms scannable
- Use sparingly – highlight only the most important terms, not entire sentences

## Headlines

- Guidelines: Name the core problem or aspect (e.g. "Horizontal Overflow", not "Popover Guideline")
- Examples: Name the use case (e.g. "Variant Selection")

## Language

- Documentation language: English
- Consistent terminology: "items" (not "entries"), "levels" (not "depths"), "destinations" (not "targets")

## Terminology (DE)

Terms not listed here follow natural translation. This table only documents non-obvious decisions — terms that either stay English against expectation, or have a specific fixed German equivalent that should not vary.

### Stays English (never translate)

| Term                | Note                                                                                |
| ------------------- | ----------------------------------------------------------------------------------- |
| Interface           | not "Benutzeroberfläche" or "Oberfläche"                                            |
| Core Components     | not "Kern-Komponenten"                                                              |
| Core Foundation     | not "Kern-Grundlagen"                                                               |
| Design System       | never translated                                                                    |
| Tokens              | not "Variablen" or "Werte"                                                          |
| Pattern             | not "Muster"                                                                        |
| Templates           | not "Vorlagen"                                                                      |
| Foundation          | not "Grundlagen" or "Basis"                                                         |
| Playground          | not "Spielplatz" or "Experimentierfeld"                                             |
| Storybook           | product name                                                                        |
| Release Notes       | not "Versionshinweise"                                                              |
| Migration Guides    | not "Migrations-Leitfäden" – sibling section to Release Notes, matches the URL slug |
| Major, Minor, Patch | not "Hauptversion" – established terms for the target audience ("Major-Versionen")  |
| Breaking Change     | not "Bruch-Änderung"                                                                |
| Density             | not "Dichte"                                                                        |
| Slot                | not "Platzhalter"                                                                   |
| Figma               | product name                                                                        |
| Dev Mode            | not "Entwicklermodus"                                                               |
| User Experience     | not "Nutzererfahrung" or "Nutzungserlebnis"                                         |
| User Needs          | not "Nutzerbedürfnisse"                                                             |

### Fixed German translation (don't vary)

| EN term       | DE translation   | Context                                      |
| ------------- | ---------------- | -------------------------------------------- |
| Component     | Komponente       | when referring to a UI component generically |
| Extensions    | Erweiterungen    | in navigation/headings                       |
| Resources     | Ressourcen       | in navigation/headings                       |
| Accessibility | Barrierefreiheit | in headings and body text                    |
| Guidelines    | Richtlinien      | in headings                                  |
| contextual    | kontextbezogen   | never "kontextuell" – calque of _contextual_ |

### Abbreviations (DE)

- `z. B.` with a space, per Duden. Never `z.B.`

### Form of address (DE)

- Address the reader with **"du"** everywhere — documentation as well as Product & Services. Never "ihr/euch", never "Sie".
- Rationale: the platform is used by individuals, not by teams as a unit, and the shared `QuestionForm` component ("Deine Frage") appears on every component page. A plural address would clash with it on the same screen.
- English `your` is number-neutral — do not resolve it to a German plural.
- Prefer direct address over impersonal passive: "Rechne damit, …" instead of "Es sollte damit gerechnet werden, …".

## German Writing Rules

### Sentence structure

Write natural German sentences. Avoid English sentence patterns translated 1:1. If a sentence reads like a translated instruction manual, rewrite it. Subject or verb comes first — not the object dangling before a final infinitive.

- **Bad:** "Für Links im Fließtext Text-Link-Styles statt der eigenständigen Link-Komponente verwenden."
- **Good:** "Verwende für Links im Fließtext Text-Link-Styles statt der eigenständigen Link-Komponente."

### Compound words

Avoid overly long compound words. If a compound exceeds 3 parts or feels unnatural, split it or use the English term.

- **Bad:** "Nutzer:innenbedürfnis", "Komponenteninterna", "Auswahlkomplexität"
- **Good:** "User Needs", "für Layout und Komponenten", "Komplexität der Auswahl"

### Umlauts in JSX props

German umlauts (ä, ö, ü, ß) work fine in JSX description props. Never use ASCII replacements (ae, oe, ue).

### Quotation marks (DE)

- Use German quotes `„…"` (U+201E opening, U+201C closing) everywhere: running text, single-quoted JS strings, and double-quoted JSX props. They are ordinary characters and do not affect parsing.
- Never close with a straight `"` and never use the English closing mark `”` (U+201D).
- A straight `"` (U+0022) inside a double-quoted JSX prop terminates the attribute — that is the only real constraint.
- Do not rely on a straight `"` in German markdown prose: the build converts it to English curly quotes (`“…”`) via smartypants.

## Description Structure

- Frontmatter `description`: Short general explanation of what the component does (1–2 sentences, no redundancy with bullets)
- Body bullets: Concrete use cases, variant recommendations, or availability info. Use bold for variant/position names
- Keep description and bullets non-redundant – description says "what it is", bullets say "when/how to use it"
- For components with named variants or positions: description stays generic ("displays the brand"), bullets list each variant with bold name and explain when/where it applies
- For parent layout components: description names the role ("outermost layout structure"), bullets describe what it combines and which options exist
- Test: if a bullet could replace the description without loss, it's redundant – rewrite one of them

## Visuals & Examples Scope

- Do not show pure variant displays in guideline or example visuals – the Playground covers variant exploration
- Focus visuals on a specific rule, decision, or context (e.g. when to use which variant, correct vs. incorrect usage)
- Guideline visuals demonstrate a Do/Dont; example visuals show a concrete use case, not a component catalogue

## Release Notes Structure

Structure for release notes, based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

### Document Structure

- Frontmatter: `hidePage: true`, `category`, `version` (with "v" prefix), `date` (ISO format YYYY-MM-DD)
- Top-level headings (h4 `####`): Group by scope – "Design & Development", "Design", "Development"
- Use "Design & Development" when a change affects both disciplines equally
- Subheadings (h5 `#####`): Categorize changes using Keep a Changelog types:
  - **Added** – new features or capabilities
  - **Changed** – modifications to existing functionality
  - **Deprecated** – features marked for future removal
  - **Removed** – features that have been deleted
  - **Fixed** – bug fixes
  - **Security** – vulnerability patches
- Only include categories that have entries – omit empty sections

### Entry Format

- Each entry is a bullet point (`-`) starting with the component or topic name followed by a colon, then the description
- Write complete, short sentences – not commit-message fragments
- Good: `- Drawer: The layout structure is now standardized across all variants.`
- Bad: `- feat(drawer): standardize layout structure`
- Use sub-bullets for additional details or affected sub-items when needed
- For deprecation removals, note in parentheses since when the item was deprecated: `(deprecated since v4.6)`
- When multiple components share the same change, combine them in one line: `- Dialog, Calendar, Pagination: Initial design has been added`

### Version Bumps

- When a scope (Design or Development) only contains a version bump with no user-facing changes, use the short notation: `_version bump_` (italic, no bullet, no heading)
- Do not invent entries for pure version bumps – keep them minimal

### Breaking Changes

- Mark breaking changes with `**BREAKING CHANGE**` at the start of the entry, before the component name
- Format: `- **BREAKING CHANGE** ComponentName: Description of the change.`
- For visual-only breaking changes, use: `- **BREAKING CHANGE** (visual) ComponentName: Description.`
- When a change affects both Design and Development, place it under "Design & Development" with sub-bullets for discipline-specific details:
  ```
  - **BREAKING CHANGE** Drawer: The layout structure has been standardized.
    - Design: Existing instances are reset after updating.
    - Development: Some properties have changed.
  ```
- Do not repeat the same component under a discipline-specific section if it is already covered under "Design & Development"

### Links & References

- Commit or PR links are optional and only useful for development entries with technical depth
- Format: `[see commit abc1234](URL)` at the end of the entry
- Do not use links as a substitute for a proper description

### Example

```markdown
---
hidePage: true
category: 'Core'
version: 'v5.0.0'
date: '2026-07-14'
---

### Design & Development

#### Added

- Tab: The component is now available as a beta release.

#### Changed

- Drawer: The layout structure has been standardized with unified subcomponents (DrawerHeader and DrawerFooter) and consistent container sizes (small, medium, large, full, custom).

### Design

#### Removed

- Card: The deprecated component has been removed (deprecated since v4.6).
- Popover: The deprecated component has been removed (deprecated since v4.6).

#### Fixed

- Card, Popover: The "Start Slot" and "End Slot" now default to hidden (show slot = false).
```
