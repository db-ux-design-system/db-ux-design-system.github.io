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

### Reviewer

The reviewer is responsible for:
- checking whether the change meets the stated requirements;
- validating the content, design, functionality, or technical implementation depending on the type of change;
- verifying that the change is reproducible or reviewable via a URL, preview, screenshots, or clear instructions;
- approving the pull request only when the defined review criteria are fulfilled;
- requesting changes where the implementation, content quality, documentation, or test status is insufficient.

#### Development discipline reviewer

For functional or design changes, at least one reviewer from the development discipline should review the pull request. This reviewer checks implementation quality, maintainability, technical consistency, and potential side effects.

#### Team or content reviewer

For content-only Markdown changes, a review by another qualified team member should usually be sufficient. The reviewer should focus on correctness, consistency, structure, tone of voice, and adherence to agreed content conventions.

## End-to-end process

1. Start with an issue
The ideal process starts with an issue. The issue should describe the problem, requested change, or improvement before implementation begins.
The issue should include:
- a short and clear title;
- the reason for the change;
- the expected outcome, if applicable;
- the affected page, feature, or content area;
- a reproducible description where applicable;
- relevant URLs, screenshots, or references;
- acceptance criteria, if known;
- an indication whether the change is content-only or functional/design-related.
- optional: the URL to a Story out of the backlog

If the change is urgent, the issue alone is not sufficient. Urgent topics should be communicated directly to the team, because issues may otherwise only be reviewed during the daily or regular alignment and could be missed.

2. Classify the type of change
Before implementation starts, the author should classify the change as one of the following:

### Functional or design change

A change is functional or design-related if it affects behavior, components, styling, templates, layouts, user interaction, build logic, or the technical structure of the website.
For this type of change:
- an automated AI-based review, such as Copilot Review, should be triggered where available;
- the pull request should be added to the [UX Engineering Team Backlog project board](https://github.com/orgs/db-ux-design-system/projects/6) to make the work visible and support prioritization and allocation.

### Content change

A change is content-related if it affects Markdown content, wording, editorial structure, release notes, changelog entries, or similar non-functional content.
For this type of change:
- a review by another qualified team member should usually be sufficient;
- automated checks should ensure formatting and style consistency where possible;
- AI-supported review can be used to check writing style, structure, consistency, and adherence to agreed content patterns.

3. Create a branch
The branch should usually be created from the `main` target branch.
The easiest would be to create the branch directly from the issue by using the option “Create a branch for this issue or link a pull request”. This helps preserve the link between issue, branch, and pull request. In this case, the branch name would differ from the regular branch naming conventions.
If the branch is created locally, the team should follow an agreed branch naming convention. A possible convention is:
- `feat/<issue-id>-short-description` for functional or design improvements;
- `content/<issue-id>-short-description` for content changes;
- `fix/<issue-id>-short-description` for bug fixes;
- `docs/<issue-id>-short-description` for documentation-only changes.
These prefixes could get adapted by the [Git commits conventions](conventions.md).

4. Work locally
The author implements the change locally and runs the required local quality checks before opening a pull request.
Local checks should include, where applicable:
- formatting and linting (handled automatically by `prettier`);
- content preview or local page validation, by running `pnpm run start` in a terminal from the workspace directory;
- AI-assisted quality review, for example via Kiro or GitHub Copilot or a comparable tool.
For content changes, local checks should focus on Markdown validity, consistent structure, naming conventions, links, and editorial quality.
For functional or design changes, local checks should additionally cover technical correctness, visual consistency, component behavior, and potential regressions.

5. Follow commit conventions
Commit messages should follow a defined convention. If changes are made via an IDE or CLI, commit messages are checked automatically with `commitlint`.
Our [Git Commit conventions](conventions.md) are based on Conventional Commits, for example:
- `feat: add new content teaser component`
- `fix: correct broken changelog link`
- `docs: update release note structure or update product description`
- `style: adjust spacing in article layout`
In this commit message, focus on describing the "why" behind the change, and not the "what", as this clear by having a look at the changes themselves. The description could include further and longer texts.

6. Create the pull request
The pull request should be linked to the original issue whenever an issue exists. The pull request description should provide enough context for reviewers to understand the change without additional explanation.
A pull request should include:
- a short summary of what was changed;
- the reason why the change was made;
- a link to the related issue (if it hasn't been created out of the issue via GitHub.com UI);
- affected URLs, previews, or screenshots, if not mentioned in the linked issue already;
- instructions for reproduction or validation;
- a note whether the change is content-only or functional/design-related;
- information about local checks that were executed;
- any known limitations or open questions.
For functional or design pull requests, the pull request should also be added to the [UX Engineering Team Backlog project board](https://github.com/orgs/db-ux-design-system/projects/6). This ensures visibility and allows the team to discuss ownership, prioritization, and review allocation.
- If you feel confident enough and the content could get merged after a review right away and doesn't have any timing constraints, you could already choose the "Enable auto-merge (squash)" button, that would auto-merge the PR after the approval has been done.

7. Run automated checks
After the pull request is opened, automated checks should run in the pipeline.
The pipeline will verify, where applicable:
- formatting;
- linting;
- build status;
- tests;
- snapshot consistency, regenerating them elsewhere;
- Markdown or content structure;
Pull requests will not be possible to get merged while the pipeline is failing.

8. Review the pull request
The reviewer checks the pull request against the minimum review criteria.

### Minimum review criteria for all pull requests

A pull request can be approved only if:
- the purpose of the change is clear;
- the change is linked to an issue where applicable;
- the implementation or content matches the requested outcome;
- the change can be reviewed using a URL, preview, screenshot, or clear reproduction steps;
- required checks have passed;
- generated files and snapshots are up to date – this is checked (and if necessary updated) by the pipeline itself, it would fail accordingly;
- no unresolved review comments remain – this is checked by the GitHub itself, it would fail accordingly;
- the change follows agreed repository conventions.

### Additional criteria for functional or design changes

For functional or design changes, the reviewer should additionally check:
- technical correctness;
- maintainability;
- possible side effects;
- layout and visual consistency (partly covered by screenshot regeneration, but still those need to get checked for expected output);
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
If changes are requested, the author gets a notification via GitHub (e-mail, mobile app, etc.) updates the branch and responds to each review comment.
The reviewer and author should keep communication within the pull request where possible, so decisions remain traceable. If a discussion happens outside the pull request, the outcome should be summarized in the pull request.
If feedback leads to a larger change in scope, the issue and pull request description should be updated accordingly.

10. Approve and merge
A pull request may be approved when all minimum review criteria are fulfilled and the required checks have passed.
Before merging, our repository settings and the pipeline will verify:
- the pull request has the required approvals;
- the pipeline is successful;
- no required reviewer or team review is missing;
- the branch is up to date with the target branch (if not, the person would need to press the "Update branch" button);
- snapshots and generated files are current;

Before merging, the person merging should verify:
- the pull request is linked to the relevant issue;
- the pull request is represented on the development discipline project board if it is functional or design-related.
After merging, the related story in out backlog should be closed or updated. If follow-up work remains, it should be captured in new sub-stories or a new story rather than being left only in comments or informal notes.

## Error handling

### Failed pipeline

If the pipeline fails, the pull request is prohibited to get merged until the failure is understood and resolved.
The author is primarily responsible for investigating the failure. If the failure is technical, unclear, or related to infrastructure, the author should involve an appropriate developer or team member.
The team should define how failed pipelines are communicated. Until a more explicit process exists, GitHub notifications can be used as the default mechanism. However, critical or blocking failures should also be communicated directly in the relevant team channel.

### Snapshot failures

Snapshots are re-generated by the pipeline automatically, and need to get reviewed by the person. If something goes horribly wrong, the pipeline might still fail. In that case a developer needs to get involved directly.

## Tooling and automation

The following automation options should be considered:
- `commitlint` to enforce commit message conventions;
- `lint-staged` to enforce formatting and code style before commits;
- branch protection rules have been enabled to prevent merging failing pull requests;
- CODEOWNERS to automatically request suitable reviewers;
- Copilot Review or comparable tools for AI-assisted pull request review;
- Kiro or comparable tools for local review before opening a pull request;
- repository instructions or review skills to enforce writing style, structure, and recurring content patterns.
