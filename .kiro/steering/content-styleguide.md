---
inclusion: fileMatch
fileMatchPattern: '**/*.mdx'
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
