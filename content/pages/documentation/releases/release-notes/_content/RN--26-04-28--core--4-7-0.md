---
hidePage: true
category: 'Core'
version: 'v4.7.0'
date: '2026-04-28'
---

### Design

- chore(components): component level versioning
	- Starting with this release, each component will be tagged with the version number of its latest update in the background — invisible to users and with no impact on existing designs. This information serves as the basis for potential migration support in future major releases that include breaking changes.
	- Recommendation: Keep your component instances up to date — only up-to-date instances can migrated with support in major releases.

### Development

- In DBSelect, the empty `option` HTML element — which we render for select elements with a defined placeholder or the “floating label” variant — is hidden as soon as the `select` element is opened, rather than only when another `option` is selected, as was previously the case.
- And in the DBNotification, you can insert any content (block-level elements) into the content area, not just plain text.
