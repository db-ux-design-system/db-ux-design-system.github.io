# Content Change Process

## Purpose

This process describes how changes are initiated, developed, reviewed, and merged. It helps to:

- make work **traceable**
- improve **review quality**
- prevent avoidable **pipeline failures**
- ensure **reliable collaboration** between developers and content contributors

## Scope

The process applies to two main types of changes:

1. Functional or design changes
   - Examples: changes to Astro components, templates, styling, layout, build logic, or other implementation-related parts of the website.
   - These changes usually require review by someone from the **development discipline**.

3. Content changes
   - Examples: changes to Markdown files, release notes, changelog entries, editorial content, or structured CMS-related content stored in the repository.
   - These changes can usually be reviewed by **any qualified team member**, provided the review criteria are met.

## Roles and responsibilities

### Change author

The change author is responsible for:

- _where applicable:_ creating or referencing an **issue** as the starting point
- describing the **reason and scope** of the change
- creating a **dedicated branch**
- implementing the change **locally**
- running the required **local quality checks**
- creating a **pull request** with sufficient context
- responding to **review feedback**

### Reviewer

The reviewer is responsible for:

- checking whether the change meets the **stated requirements**
- **validating** the content, design, functionality, or technical implementation
- verifying that the change is **reviewable** (via URL, preview, screenshots, or clear instructions)
- approving the pull request only when the **review criteria are fulfilled**
- **requesting changes** where quality is insufficient

#### Development discipline reviewer

For functional or design changes, at least one dev reviewer should check implementation quality, maintainability, consistency, and potential side effects.

#### Team or content reviewer

For content-only Markdown changes, a review by another qualified team member is sufficient. Focus on correctness, consistency, structure, tone of voice, and content conventions.

## End-to-end process

### 1. Start with an issue

Every change should start with an **issue**. The issue describes the problem, requested change, or improvement before implementation begins.

The issue should include:

- a short and clear **title**
- the **reason** for the change
- if applicable: the **expected outcome**
- the affected **page, feature, or content area**
- where applicable: a **reproducible description**
- relevant **URLs, screenshots, or references**
- if known: **acceptance criteria**
- an indication whether the change is **content-only or functional/design-related**
- optional: the URL to a **Story** out of the backlog

If the change is urgent, the issue alone is not sufficient. Urgent topics should be communicated directly to the team, because issues may otherwise only be reviewed during the daily or regular alignment and could be missed.

### 2. Classify the type of change

Before implementation, classify the change:

#### Functional or design change

Examples: **behavior, components, styling, templates, layouts, user interaction, build logic, or the technical structure of the website**.

- trigger an **automated AI-based review** (e.g. Copilot Review) where available
- add the PR to the [UX Engineering Team Backlog](https://github.com/orgs/db-ux-design-system/projects/6) for visibility and prioritization

#### Content change

Examples: **markdown content, wording, editorial structure, release notes, changelog entries, or similar non-functional content**.

- a review by another **qualified team member** is sufficient
- automated checks ensure **formatting and style consistency**
- **AI-supported review** can check writing style, structure, and adherence to content patterns

### 3. Create a branch

Create the branch from the **`main`** branch.

The easiest option: create the branch **directly from the issue** using "Create a branch for this issue or link a pull request". This preserves the link between issue, branch, and pull request (branch name may differ from conventions in this case).

If created locally, follow the naming convention:

- `feat/<issue-id>-short-description` for functional or design improvements;
- `content/<issue-id>-short-description` for content changes;
- `fix/<issue-id>-short-description` for bug fixes;
- `docs/<issue-id>-short-description` for documentation-only changes.

These prefixes could get adapted by the [Git commits conventions](conventions.md).

### 4. Work locally

Implement the change locally and run quality checks **before** opening a pull request.

Local checks should include:

- **formatting and linting** (handled automatically by `prettier`);
- **content preview** or local page validation via `pnpm run start`;
- **AI-assisted quality review** (e.g. via Kiro, GitHub Copilot, or comparable tools).

For **content changes**\
focus on: Markdown validity, consistent structure, naming conventions, links, and editorial quality.

For **functional or design changes**\
additionally check: technical correctness, visual consistency, component behavior, and potential regressions.
### 5. Follow commit conventions

Commit messages follow [Conventional Commits](conventions.md) and are checked automatically with `commitlint`.

Examples:

- `feat: add new content teaser component`
- `fix: correct broken changelog link`
- `docs: update release note structure`
- `style: adjust spacing in article layout`
- `content: update product description`

Focus on describing the **"why"** behind the change, not the "what" (which is visible in the diff). The description can include longer explanations.

### 6. Create the pull request

Link the pull request to the **original issue** whenever one exists. The description should give reviewers enough context to understand the change without additional explanation.

A pull request should include:

- a short **summary** of what was changed
- the **reason** why the change was made
- a **link to the related issue** (if not auto-linked via GitHub UI)
- affected **URLs, previews, or screenshots** (if not in the linked issue)
- instructions for **reproduction or validation**
- a note whether the change is **content-only or functional/design-related**
- information about **local checks** that were executed
- any known **limitations or open questions**

For functional or design PRs, add the pull request to the [UX Engineering Team Backlog](https://github.com/orgs/db-ux-design-system/projects/6) for visibility and review allocation.

If the content could be merged right away after review and has no timing constraints, you can already select **"Enable auto-merge (squash)"** to auto-merge after approval.

### 7. Run automated checks

After opening the pull request, the **pipeline** runs automatically and verifies:

- formatting
- linting
- build status
- tests
- snapshot consistency (regenerating if needed)
- Markdown or content structure

**⚠️ Pull requests cannot be merged while the pipeline is failing.**

### 8. Review the pull request

The reviewer checks the pull request against the minimum review criteria.

#### Minimum criteria (all pull requests)

A pull request can be approved only if:

- the **purpose** of the change is clear
- the change is **linked to an issue** where applicable
- the implementation or content **matches the requested outcome**
- the change can be **reviewed** using a URL, preview, screenshot, or clear steps
- required **checks have passed**
- generated files and **snapshots are up to date** (pipeline checks and updates this)
- no **unresolved review comments** remain (GitHub enforces this)
- the change follows **agreed repository conventions**

#### Additional criteria: functional or design changes

- technical correctness
- maintainability
- possible side effects
- layout and visual consistency (partly covered by screenshot regeneration, but still needs manual review)
- responsive behavior where relevant
- accessibility impact where relevant
- dev discipline reviewer has reviewed or should review
- AI-based review (e.g. Copilot Review) has been triggered where available

#### Additional criteria: content changes

- factual correctness
- clarity and readability
- tone of voice
- consistent structure
- consistent formatting of recurring content types (e.g. release or changelog entries)
- correct links and references
- adherence to agreed writing guidelines

### 9. Handle review feedback

If changes are requested, the author gets a **notification via GitHub** (e-mail, mobile app, etc.), updates the branch, and responds to each review comment.

Keep communication **within the pull request** so decisions remain traceable. If a discussion happens outside the PR, summarize the outcome in the PR.

If feedback leads to a **larger scope change**, update the issue and pull request description accordingly.

### 10. Approve and merge

A pull request may be approved when all criteria are fulfilled and checks have passed.

**Before merging, the repository settings and pipeline verify:**

- the PR has the required approvals
- the pipeline is successful
- no required reviewer or team review is missing
- the branch is up to date with the target branch (if not, press "Update branch")
- snapshots and generated files are current

**Before merging, the person merging should verify:**

- the PR is linked to the relevant issue
- the PR is on the project board (if functional/design-related)

**After merging**, close or update the related story in the backlog. If follow-up work remains, capture it in new sub-stories or a new story rather than leaving it in comments or informal notes.

## Error handling

### Failed pipeline

If the pipeline fails, the **pull request cannot be merged** until the failure is resolved.

The **author** is primarily responsible for investigating. If the failure is technical, unclear, or infrastructure-related, involve an appropriate developer or team member.

Critical or blocking failures should be communicated directly in the relevant team channel (not just via GitHub notifications).

### Snapshot failures

Snapshots are **re-generated by the pipeline automatically** and need to be reviewed by the author. If something goes wrong and the pipeline still fails, a developer needs to get involved directly.

## Tooling and automation

The following tools and automations are in use or should be considered:

- **`commitlint`** to enforce commit message conventions
- **`lint-staged`** to enforce formatting and code style before commits
- **branch protection rules** to prevent merging failing pull requests
- **CODEOWNERS** to automatically request suitable reviewers
- **Copilot Review** or comparable tools for AI-assisted pull request review
- **Kiro** or comparable tools for local review before opening a pull request
- **repository instructions or review skills** to enforce writing style, structure, and recurring content patterns
