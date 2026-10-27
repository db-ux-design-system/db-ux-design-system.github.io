---
name: create-learn-content
description: Create or rework articles in the Learn area of the DB UX Design System platform (content/pages/documentation/learn and the DE counterpart under lernen). Use when writing a new Learn article or tutorial, splitting an existing Learn page into stepper steps, or adding additional info, categories and keywords to a Learn article.
---

# Create Learn Content

Learn articles hold knowledge about the design system that does not belong to one component or page. If a text explains a single component, pattern or foundation topic, it belongs to that documentation page instead.

Every Learn article can be read in two views:

- **Article view:** one long page with a table of contents. Additional info is shown inline.
- **Stepper view:** one step at a time with Back and Next. Additional info is hidden behind a "Show more" button. Links in the core text appear as teaser cards.

Both views render from the same MDX. Write the content once and let the components handle the views.

Reference article: `content/pages/documentation/learn/about.mdx`.

## Principles

- **One idea per step.** A step answers one question in 1–2 sentences. If you need a table, a list or a second paragraph to explain it, the extra part is additional info.
- **More, smaller articles over one big one.** If a topic needs its own deep explanation (for example versioning), it gets its own article or stays on its documentation page. Link to it, do not reproduce it.
- **5–8 steps per article**, counted with the hero as step 1. More than that is a sign the article covers several topics. Split it.
- **Core text is the essence, additional info is the depth.** A reader who skips every "Show more" must still understand the topic.
- **Search finds the article, the stepper makes it easy to read.** Write titles and keywords so someone searching for the topic lands here.

## Files

| Language | Folder                                   | Example     |
| -------- | ---------------------------------------- | ----------- |
| EN       | `content/pages/documentation/learn/`     | `about.mdx` |
| DE       | `content/pages/de/dokumentation/lernen/` | `ueber.mdx` |

- Create the EN and the DE file together. Keep the same steps, the same order and the same additional info in both.
- The DE file name is the translated slug. Add the segment to `segmentMap` in `template/i18n/slug-mapping.ts` if it is not there yet (e.g. `about: 'ueber'`). Without it, the language switch and the navigation title of the DE page break.
- Internal links in the DE file use DE paths (`/de/dokumentation/...`).

## Frontmatter

```yaml
---
layout: '@template/layouts/documentation'
sectionSpacing: 'small'
sectionWidth: 'auto'
title: 'About the Design System'
headline: 'About the Design System'
description: 'The shared base for the digital products of Deutsche Bahn – what it is, what it contains and how binding it is.'
readingList: true
align: start
toc: true
tocMaxDepth: 2
order: 1
category: 'Foundations'
keywords: ['overview', 'status', 'db theme']
stepper: true
---
```

| Field         | Rule                                                                                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | Navigation and card title. Short.                                                                                                                           |
| `headline`    | Page headline. Together with `description` it forms step 1 of the stepper.                                                                                  |
| `description` | One sentence on what the reader learns. Shown large on step 1. Must not repeat the first block.                                                             |
| `toc`         | `true`, with `tocMaxDepth: 2`. The table of contents lists the step headings in the article view.                                                           |
| `stepper`     | `true` to offer the stepper view. The layout then wraps the content and adds the view toggle. Leave it out only for pages that are not a sequence of steps. |
| `category`    | Exactly one of: `Foundations`, `Design`, `Development`, `Tooling`, `Accessibility`, `Migration`. Same value in EN and DE.                                   |
| `keywords`    | Lowercase, EN in both languages, 8–20 terms. Include synonyms and terms people search for, not only words from the text.                                    |
| `readingList` | `true`, so the page can be added to the reading list.                                                                                                       |
| `order`       | Position in the Learn navigation.                                                                                                                           |

The category list is a first set. Extend it only together with the filter on the Learn overview.

## Structure

The MDX only contains the steps. The documentation layout does the rest when the frontmatter sets `stepper: true`: it wraps the content, adds the view toggle and the stepper navigation, and uses the page hero as step 1. Do not add a wrapper, an intro block or a title of your own.

```mdx
import LearnBlock from '@template/components/Learn/LearnBlock.astro';
import LearnAside from '@template/components/Learn/LearnAside.astro';
import TeaserCard from '@template/components/TeaserCard/TeaserCard.astro';

<LearnBlock>

## Every content has a status

A status tells you how mature a component is. **Stable** is mandatory, **Beta** is recommended, **Concept** is a design reference only.

<LearnAside>

| Status | Meaning |
| ------ | ------- |
| …      | …       |

</LearnAside>

</LearnBlock>
```

Import `TeaserCard` only if the article uses one.

### Components

| Component    | Role                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `LearnBlock` | One step. Starts with a `## Heading`, followed by the core text.                                                                                 |
| `LearnAside` | Additional info of the step it sits in. Always inside a `LearnBlock`, after the core text. At most one per block; put all extra content into it. |
| `TeaserCard` | Explicit next actions, such as choosing a path. Put it directly in the block, after the core text.                                               |

`LearnArticle` is the wrapper the layout adds. Never use it in an article.

### Everything is written once

Both views render from the same markup. Nothing is authored twice:

- **Step 1** is the page hero: `headline` and `description` from the frontmatter.
- **Every other step** is a `LearnBlock`. The step label in the stepper comes from its `##` heading.
- **Link cards** in the stepper are created from the links in the core text.
- **Additional info** is the same `LearnAside`: open in the article view, behind "Show more" in the stepper.

If you feel the need to write something a second time for one of the views, the content is in the wrong place.

### Rules that keep both views working

- **The heading is Markdown.** Each `LearnBlock` starts with `## …`. Do not write an HTML heading: only Markdown headings reach the table of contents, and the stepper reads the step label from it.
- **Blank lines around Markdown inside components.** Leave an empty line after an opening tag and before a closing tag. Without it, MDX does not parse the Markdown inside.
- **Everything goes into a `LearnBlock`.** No content and no `##` outside a block.
- **No `DBSection` around blocks.** The layout already provides the section. A nested `DBSection` adds its inline padding a second time and indents the content against the headline.
- **`LearnAside` never stands alone.** It belongs to the block it is in. A loose aside at the end of the article has no step to belong to.
- **No `<script>` in components used in the MDX.** Astro does not run scripts of components inside MDX. The view behavior lives in `template/components/Learn/learn-controller.ts`, loaded by the documentation layout.
- **Headings inside a step:** `###` and below only in the additional info, not in the core text.

## Writing the steps

### Headings

- A short statement or question that already carries the message: "Every content has a status", "Coming from DB UI?". Not a label like "Status" or "Overview".
- The heading and the first sentence must not say the same thing twice.

### Core text

- 1–2 sentences. Plain language, one idea per sentence, active voice.
- No tables and no long lists in the core text. They go into the additional info.
- Bold only for the 1–3 terms that matter most in the step.
- The stepper sets the core text large, so every word counts.

### Links in the core text

In the stepper, every link in the core text appears as a teaser card below the text. The link itself then reads as plain text there. Write links with that in mind:

- **Link text = card title.** Use a meaningful phrase or name ("migration from DB UI", "GitHub"), never "here" or "this page".
- **Link title = card description.** Add a short sentence as the Markdown link title:
  `[migration from DB UI](/documentation/learn/migration "Switch from Generation 2 to Generation 3 step by step.")`
- **At most 2 links per step.** Each link is a card; more than two cards make the step a link list.
- Links in the additional info stay normal links and get no card.

### Additional info

- Everything that deepens the step but is not needed to understand it: full tables, all channels, edge cases, license details.
- It may be longer than the core text, but it still belongs to this one step. If it grows into its own topic, move it into its own article and link to it.

### Step 1: the hero

The page hero is step 1. Write `headline` and `description` so they work as an introduction on their own: what the article is about and what the reader takes away. The first `LearnBlock` is step 2 and starts with the first real piece of content, not with a repetition of the description.

### Last step

End with the next action: where to go from here. Use a `TeaserCard` with 1–3 cards when the reader has a choice (for example design or development).

## Tone and formatting

Learn articles are documentation. Follow the steering files:

- `.kiro/steering/content-tone/documentation.md` – fact-based and direct, no promotional language.
- `.kiro/steering/content-formatting.md` – en dash with spaces, digits for ranges and values, component names with spaces, DE terminology, `du` in German, German quotation marks.

Write the EN version first, then the DE version as natural German, not a word-for-word translation. Keep the step headings parallel in meaning.

## Checklist

Before you finish, check:

- [ ] EN and DE file exist, same number of steps, same additional info, slug in `slug-mapping.ts`
- [ ] Frontmatter complete: `category` from the list, `keywords`, `stepper: true`, `toc: true`, `tocMaxDepth: 2`
- [ ] MDX contains only `LearnBlock`s (and `TeaserCard`s inside them), no `LearnArticle`, no intro block
- [ ] 5–8 steps including the hero, each block with a `## heading` and 1–2 sentences of core text
- [ ] Tables and long lists only in `LearnAside`, each aside inside its block
- [ ] At most 2 links per step in the core text, each with a meaningful link text and a link title
- [ ] Last step points to the next action
- [ ] `pnpm exec astro check` without errors
- [ ] In the browser, both views: the table of contents shows every step heading in the article view; in the stepper, each step fits without scrolling the page at 1400 × 900 px with "Show more" closed, and the link cards show title and description
