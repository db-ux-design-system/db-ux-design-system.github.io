# TeaserCard generalization: image support, external links, configurable sizing

TeaserCard carried a dead `component` prop and `DBComponents` wildcard import that rendered arbitrary components inside cards — never actually used. This refactoring removes that preview system and replaces it with image support (via TextImage), external link handling (`target="_blank"`), configurable card spacing, and headline size variants. TeaserCard now absorbs the custom GetStartedTeaser and most of ExtensionsSection's markup, reducing two bespoke layout components to a thin wrapper and direct TeaserCard usage.

Watch for: Missing `margin: 0` reset in `.teaser-cards-large` creates an inconsistency with the other headline size variants (confirmed). The `aria-label` on a `<div>` in the `noSection` branch of ExtensionsSection has no ARIA role, making it invisible to assistive technology (confirmed). External links no longer signal "opens in new tab" to screen readers (confirmed).

## High-level view

TeaserCard becomes the single card-grid primitive for the documentation site: text-only cards for ChildPageOverview, image cards for extensions and get-started. The old `component`/preview machinery is gone without replacement because nothing used it.

ExtensionsSection shrinks from 200+ lines of duplicated card+link markup to a data array fed into TeaserCard, gaining a `noSection` prop for embedding without a wrapping `<DBSection>`. The extensions page flips from a JavaScript redirect to an inline page.

The CSS adds headline-size modifiers (`.teaser-cards-medium`, `.teaser-cards-large`) but `.teaser-cards-large` omits the `margin: 0` reset the other variants include.

ChildPageOverview gains a `redirectTo` frontmatter field — a small independent feature bundled in the same diff.

<details>
<summary>Issues (4)</summary>

1. **Missing `margin: 0` in `.teaser-cards-large`** — The default and `-medium` headline rules include `margin: 0`, but `-large` only sets `font`. Add `margin: 0` to `.teaser-cards-large .db-card h2, .teaser-cards-large .db-card h3` for consistency.
2. **`aria-label` on a bare `<div>` (ExtensionsSection `noSection` branch)** — `aria-label` on a `<div>` without an explicit ARIA role is ignored by most assistive tech. Add `role="region"` to the div, or use a `<section>` element instead.
3. **External links don't signal "opens in new tab"** — The old ExtensionsSection had explicit `aria-label="Open RI Extension"` on each anchor. The new TeaserCard relies on visible card text as the accessible name — valid, but screen-reader users can't tell the link opens a new window. Consider a visually hidden "(opens in new tab)" suffix.
4. **Leftover `h2` selector in headline CSS** — TeaserCard exclusively renders `<h3>`, but the CSS targets both `h2` and `h3`. The `h2` path is dead within TeaserCard. If anything else nests an `h2` inside `.teaser-cards .db-card`, it inherits TeaserCard's headline sizing unexpectedly. Low risk.

</details>

<details>
<summary>Details</summary>

## CSS: the missing margin reset

The three headline-size variants should be symmetric:

```css
/* Default – has margin: 0 */
.teaser-cards .db-card h2,
.teaser-cards .db-card h3 {
    margin: 0;
    font: var(--db-type-headline-3xs);
}

/* Medium – has margin: 0 */
.teaser-cards-medium .db-card h2,
.teaser-cards-medium .db-card h3 {
    margin: 0;
    font: var(--db-type-headline-2xs);
}

/* Large – no margin: 0 */
.teaser-cards-large .db-card h2,
.teaser-cards-large .db-card h3 {
    font: var(--db-type-headline-sm);
}
```

Since `.teaser-cards-large` elements also carry the base `.teaser-cards` class, the `margin: 0` from the base rule still applies via cascade — no visual bug today. But the asymmetry means a future refactor that separates these classes would regress. Adding `margin: 0` makes the intent explicit and costs nothing.

## `aria-label` on a non-landmark `<div>`

In ExtensionsSection's `noSection` branch:

```html
<div aria-label={ariaLabel} id="extensions--extensions-section">
```

Per ARIA spec, `aria-label` is only conveyed on elements with an implicit or explicit role. A `<div>` has none — screen readers silently ignore it. Two fixes: use `<section>` (which `noSection` was trying to avoid) or add `role="region"` to the div.

## External links and "opens in new tab"

The old code had `aria-label="Open RI Extension"` on each anchor. The refactored version uses card content as the accessible name via content inclusion — valid and avoids label/content drift. But there's no indication that external links open a new tab. WCAG 2.1 SC 3.2.5 recommends informing users. A visually hidden "(opens in new tab)" or an icon with alt text would satisfy this (advisory technique, not a hard failure).

## `imagePosition` default divergence

`imagePosition` defaults to `'bottom'` inside TeaserCard (via `?? 'bottom'`), but TextImage's own default is `'right'`. The get-started page explicitly passes `imagePosition: 'right'`, so it works, but someone omitting `imagePosition` from a teaser object gets `'bottom'` — which differs from using TextImage directly. This is intentional for extensions (images below text), but worth documenting in the prop's JSDoc.

</details>

<details>
<summary>File map</summary>

| File | What changed |
|------|-------------|
| `template/components/TeaserCard/TeaserCard.astro` | Removed component/preview system; added TextImage, external links, spacing/headlineSize props |
| `template/components/TeaserCard/TeaserCard.css` | Removed preview styles; added headline size modifiers and adjacent-sibling margin |
| `template/components/ExtensionsSection/ExtensionsSection.astro` | Replaced duplicated card markup with single TeaserCard; added noSection/width props |
| `template/components/ChildPageOverview/ChildPageOverview.astro` | Added redirectTo frontmatter support; passes headlineSize="medium" |
| `content/pages/documentation/get-started/_components/GetStartedTeaser.astro` | Deleted — replaced by inline TeaserCard usage |
| `content/pages/documentation/get-started/index.mdx` | Uses TeaserCard directly with image teasers |
| `content/pages/documentation/extensions/index.mdx` | Replaced JS redirect with inline ExtensionsSection |
| `content/pages/documentation/foundation/index.mdx` | Replaced hardcoded TeaserCard array with ChildPageOverview |

</details>
