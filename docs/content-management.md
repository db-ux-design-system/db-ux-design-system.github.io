# Content Change Process

## Purpose

This process describes how content-related and functional/design-related changes are initiated, developed, reviewed, approved, and merged. It is intended to make work traceable, improve review quality, prevent avoidable pipeline failures, and ensure that both developers and content contributors can collaborate reliably.

## Scope

The process applies to two main types of changes:

1. Functional or design changes
   - Examples: changes to Astro components, templates, styling, layout, build logic, or other implementation-related parts of the website.
   - These changes usually require review by someone from the development discipline.

3. Content changes
   - Examples: changes to Markdown files, release notes, changelog entries, editorial content, or structured CMS-related content stored in the repository.
   - These changes can usually be reviewed by any qualified team member, provided the review criteria are met.

## Roles and responsibilities

### Change author

The change author is responsible for:
- creating or using an issue as the starting point for the change, where applicable;
- describing the reason and scope of the change;
- creating a dedicated branch;
- implementing the change locally;
- running the required local quality checks;
- creating a pull request with sufficient context;
- responding to review feedback;
- ensuring that generated artifacts, such as snapshots, are up to date.

### Reviewer

The reviewer is responsible for:
- checking whether the change meets the stated requirements;
- validating the content, design, functionality, or technical implementation depending on the type of change;
- verifying that the change is reproducible or reviewable via a URL, preview, screenshots, or clear instructions;
- approving the pull request only when the defined review criteria are fulfilled;
- requesting changes where the implementation, content quality, documentation, or test status is insufficient.

### Development discipline reviewer

For functional or design changes, at least one reviewer from the development discipline should review the pull request. This reviewer checks implementation quality, maintainability, technical consistency, and potential side effects.

### Team or content reviewer

For content-only Markdown changes, a review by another qualified team member should usually be sufficient. The reviewer should focus on correctness, consistency, structure, tone of voice, and adherence to agreed content conventions.

## End-to-end process

1. Start with an issue
The ideal process starts with an issue. The issue should describe the problem, requested change, or improvement before implementation begins.
The issue should include:
- a short and clear title;
- the reason for the change;
- the expected outcome;
- the affected page, feature, or content area;
- a reproducible description where applicable;
- relevant URLs, screenshots, or references;
- acceptance criteria, if known;
- an indication whether the change is content-only or functional/design-related.

If the change is urgent, the issue alone is not sufficient. Urgent topics should be communicated directly to the team, because issues may otherwise only be reviewed during the daily or regular alignment and could be missed.

2. Classify the type of change
Before implementation starts, the author should classify the change as one of the following:

### Functional or design change

A change is functional or design-related if it affects behavior, components, styling, templates, layouts, user interaction, build logic, or the technical structure of the website.
For this type of change:
- a reviewer from the development discipline should be involved;
- an automated AI-based review, such as Copilot Review, should be triggered where available;
- the pull request should be added to the development discipline project board to make the work visible and support prioritization and allocation.

### Content change
A change is content-related if it affects Markdown content, wording, editorial structure, release notes, changelog entries, or similar non-functional content.
For this type of change:
- a review by another qualified team member should usually be sufficient;
- automated checks should ensure formatting and style consistency where possible;
- AI-supported review can be used to check writing style, structure, consistency, and adherence to agreed content patterns.

3. Create a branch
The branch should be created from the current target branch, usually `main` or the agreed development branch.
If the issue platform supports it, the branch should be created directly from the issue by using the option “Create a branch for this issue”. This helps preserve the link between issue, branch, and pull request.
If the branch is created locally, the team should follow an agreed branch naming convention. A possible convention is:
- `feature/<issue-id>-short-description` for functional or design improvements;
- `content/<issue-id>-short-description` for content changes;
- `fix/<issue-id>-short-description` for bug fixes;
- `docs/<issue-id>-short-description` for documentation-only changes.
The final convention should be agreed with the team and documented in the repository.

4. Work locally
The author implements the change locally and runs the required local quality checks before opening a pull request.
Local checks should include, where applicable:
- formatting and linting;
- type checks;
- unit or component tests;
- snapshot regeneration;
- build verification;
- content preview or local page validation;
- AI-assisted quality review, for example via Amazon Q or a comparable tool.
For content changes, local checks should focus on Markdown validity, consistent structure, naming conventions, links, and editorial quality.
For functional or design changes, local checks should additionally cover technical correctness, visual consistency, component behavior, and potential regressions.

5. Follow commit conventions
Commit messages should follow a defined convention. If changes are made via an IDE or CLI, commit messages can be checked automatically with `commitlint`.
A possible convention is based on Conventional Commits, for example:
- `feat: add new content teaser component`
- `fix: correct broken changelog link`
- `docs: update release note structure`
- `style: adjust spacing in article layout`
- `content: update product description`
The team should decide whether this convention is mandatory and how strictly it should be enforced.

6. Create the pull request
The pull request should be linked to the original issue whenever an issue exists. The pull request description should provide enough context for reviewers to understand the change without additional explanation.
A pull request should include:
- a short summary of what was changed;
- the reason why the change was made;
- a link to the related issue;
- affected URLs, previews, or screenshots;
- instructions for reproduction or validation;
- a note whether the change is content-only or functional/design-related;
- information about local checks that were executed;
- information about regenerated snapshots or generated files, where applicable;any known limitations or open questions.
For functional or design pull requests, the pull request should also be added to the development discipline project board. This ensures visibility and allows the team to discuss ownership, prioritization, and review allocation.

7. Run automated checks
After the pull request is opened, automated checks should run in the pipeline.
The pipeline should verify, where applicable:
- formatting;
- linting;
- commit message compliance;
- build status;
- tests;
- snapshot consistency;
- Markdown or content structure;
- code style via `lint-staged` or comparable tooling.
Pull requests should not be merged while the pipeline is failing. If this is currently possible, branch protection rules and merge permissions should be reviewed and adjusted.

8. Review the pull request
The reviewer checks the pull request against the minimum review criteria.

### Minimum review criteria for all pull requests

A pull request can be approved only if:
- the purpose of the change is clear;
- the change is linked to an issue where applicable;
- the implementation or content matches the requested outcome;
- the change can be reviewed using a URL, preview, screenshot, or clear reproduction steps;
- required checks have passed;
- generated files and snapshots are up to date;
- no unresolved review comments remain;
- the change follows agreed repository conventions.

### Additional criteria for functional or design changes

For functional or design changes, the reviewer should additionally check:
- technical correctness;
- maintainability;
- possible side effects;
- layout and visual consistency;
- responsive behavior where relevant;
- accessibility impact where relevant;
- whether a development discipline reviewer has reviewed or should review the change;
- whether AI-based review, such as Copilot Review, has been triggered where available.

### Additional criteria for content changes
For content changes, the reviewer should additionally check:
- factual correctness;
- clarity and readability;
- tone of voice;
- consistent structure;
- consistent formatting of recurring content types, such as release or changelog entries;
- correct links and references;
- whether the content follows agreed writing guidelines.

9. Handle review feedback
If changes are requested, the author updates the branch and responds to each review comment.
The reviewer and author should keep communication within the pull request where possible, so decisions remain traceable. If a discussion happens outside the pull request, the outcome should be summarized in the pull request.
If feedback leads to a larger change in scope, the issue and pull request description should be updated accordingly.

10. Approve and merge
A pull request may be approved when all minimum review criteria are fulfilled and the required checks have passed.
Before merging, the person merging should verify:
- the pull request has the required approvals;
- the pipeline is successful;
- no required reviewer or team review is missing;
- the pull request is linked to the relevant issue;
- the branch is up to date with the target branch, if required by the repository rules;
- snapshots and generated files are current;
- the pull request is represented on the development discipline project board if it is functional or design-related.
After merging, the related issue should be closed or updated. If follow-up work remains, it should be captured in new issues rather than being left only in comments or informal notes.

## Error handling

### Failed pipeline

If the pipeline fails, the pull request must not be merged until the failure is understood and resolved.
The author is primarily responsible for investigating the failure. If the failure is technical, unclear, or related to infrastructure, the author should involve an appropriate developer or team member.
The team should define how failed pipelines are communicated. Until a more explicit process exists, GitHub notifications can be used as the default mechanism. However, critical or blocking failures should also be communicated directly in the relevant team channel.

### Snapshot failures

Snapshot-related failures are a recurring source of errors. Authors must ensure that snapshots are regenerated reliably when affected by a change.
The team should improve resilience around snapshot generation so that missing or outdated snapshots are detected before the pull request reaches the pipeline. This may include local scripts, pre-commit hooks, documentation, or CI checks with clearer error messages.

### Accidental merge of failing pull requests

The team should analyze whether pull requests can currently be merged despite failing checks. If this is possible, branch protection rules should be reviewed. Required checks should be configured so that failing pull requests cannot be merged into the target branch.

## Tooling and automation

The following automation options should be considered:
- `commitlint` to enforce commit message conventions;
- `lint-staged` to enforce formatting and code style before commits;
- branch protection rules to prevent merging failing pull requests;
- CODEOWNERS to automatically request suitable reviewers;
- Copilot Review or comparable tools for AI-assisted pull request review;
- Amazon Q or comparable tools for local review before opening a pull request;
- repository instructions or review skills to enforce writing style, structure, and recurring content patterns.
