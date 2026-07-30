# Instructions for AI Code Reviews

## Visual Regression Snapshots (Playwright)

Screenshots (Playwright snapshots under `tests/*-snapshots/`) are **automatically managed by the CI pipeline** – PR authors do not need to update them manually.

### How it works

1. The pipeline runs `pnpm run test` (Playwright) against the built site.
2. If snapshots are outdated, the pipeline regenerates them with `pnpm run test:regenerate`.
3. Updated snapshots are auto-committed to the PR branch.
4. If the regenerated snapshots still fail, the pipeline reports the failure.

### Consequence for reviews

- Do **not** flag missing or outdated snapshot files in a PR as a problem – the pipeline handles this.
- If snapshots are not up to date, the pipeline will fail, making the issue visible without manual intervention.

### Local workflow (optional, for documentation only)

Contributors _can_ update snapshots locally if they want fast feedback before pushing:

```sh
pnpm run test:regenerate
```

This is not required – the pipeline covers it.
