---
inclusion: fileMatch
fileMatchPattern: '**/*.{mdx,md}'
---

# Content Styleguide

Guidelines for writing documentation content consistently.

## Typography & Punctuation

- Dashes: En Dash with spaces ( – ), not Em Dash (—)
- Numbers: Use digits, not words (e.g. "2–6" not "two to six")
- Number ranges: En Dash without spaces (e.g. "2–6", "1–2 levels")
- Lists: No period at the end of bullet points, period for full sentences

## Tone & Style

- Clear, direct, not instructive
- Write naturally – no marketing language, no superlatives
- Prefer active voice ("Use Tree" not "Tree should be used")
- Short sentences, max 1–2 per guideline description

## Emphasis

- Use bold in longer texts to make key terms scannable
- Use sparingly – highlight only the most important terms, not entire sentences

## Do/Dont Texts

- Do: Formulate positively, state what to do
- Dont: Start with "Do not...", include a concrete reason
- Caution: Use instead of Dont when the usage is suboptimal but not a hard error. Formulate as a neutral observation with a recommendation
- Always provide the "why" or the consequence
- Soft wording when there is no hard error, restrictive when technically limited

## Headlines

- Guidelines: Name the core problem or aspect (e.g. "Horizontal Overflow", not "Popover Guideline")
- Examples: Name the use case (e.g. "Variant Selection")

## Language

- Documentation language: English
- Consistent terminology: "items" (not "entries"), "levels" (not "depths"), "destinations" (not "targets")

## Phrasing Patterns

- Soft rules: "Keep ... reasonable", "... is supported but reduces..."
- Hard rules: "Do not use ... for ...", state technical limits clearly
- Recommendations: "Use ... when ...", "... is better suited for..."

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

## Release Notes

Structure and tone for release notes, based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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

### Tone & Wording

- Write for humans, not machines – release notes are read by designers and developers
- Use present tense or present perfect to describe the state after the release ("is now", "has been added")
- Avoid commit prefixes like `feat:`, `fix:`, `chore:` – these belong in git history, not user-facing notes
- Be specific: name the component, the variant, or the property that changed
- Keep each entry to 1–2 sentences maximum; use sub-bullets for lists of affected items
- End every bullet point with a period – release notes entries are full sentences

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

#### Design & Development

##### Added
- Tab: The component is now available as a beta release.

##### Changed
- Drawer: The layout structure has been standardized with unified subcomponents (DrawerHeader and DrawerFooter) and consistent container sizes (small, medium, large, full, custom).

#### Design

##### Removed
- Card: The deprecated component has been removed (deprecated since v4.6).
- Popover: The deprecated component has been removed (deprecated since v4.6).

##### Fixed
- Card, Popover: The "Start Slot" and "End Slot" now default to hidden (show slot = false).
```
