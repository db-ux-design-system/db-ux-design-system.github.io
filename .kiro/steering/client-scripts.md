---
inclusion: fileMatch
fileMatchPattern: '**/*.astro'
---

# Client-Side Scripts in Astro

## Preferred Pattern: `waitForElements`

This project provides a utility for waiting on DOM elements that depend on React hydration:

```ts
import { waitForElements } from '@template/utils/client.utils.ts';
```

Use it inside a standard `<script>` tag (bundled by Astro):

```astro
<script>
	import { waitForElements } from '@template/utils/client.utils.ts';

	function init(): boolean {
		const element = document.getElementById('my-element');
		if (!element) return false;

		// initialization logic here
		element.addEventListener('click', () => {
			/* ... */
		});

		return true; // signals success, disconnects the observer
	}

	waitForElements(init);
</script>
```

### How it works

- Uses a `MutationObserver` on `document.body` (childList + subtree)
- Calls your `initFn` on every DOM mutation
- When `initFn` returns `true`, the observer disconnects automatically
- No arbitrary timeouts or polling — reacts to actual DOM changes

### Rules

- Your init function MUST return `boolean`: `true` when all elements are found and initialized, `false` otherwise
- Place the `<script>` tag at the bottom of your `.astro` file (after the template)
- Use standard `<script>` (not `is:inline`) so Astro can bundle and optimize it

## Legacy Pattern: `slot="script"` with `is:inline`

Only use this when you need `define:vars` to pass server-side data to the client:

```astro
<script define:vars={{ serverData }} is:inline slot="script">
	function tryInit(attempts = 0) {
		const element = document.getElementById('target');
		if (!element && attempts < 10) {
			setTimeout(() => tryInit(attempts + 1), 500);
			return;
		}
		// initialization logic
	}

	window.addEventListener('load', () => {
		setTimeout(() => tryInit(), 1000);
	});
</script>
```

### When to use `is:inline`

- You need `define:vars={{ }}` to pass frontmatter/server data to the script
- The page uses `slot="script"` in the layout for placement control
- The page must be `.astro` (not `.mdx`) for `slot="script"` to work

### When NOT to use `is:inline`

- If you don't need server-side data, use a standard `<script>` with `waitForElements`
- Standard scripts are bundled, deduplicated, and optimized by Astro
- `is:inline` scripts are emitted as-is (no bundling, no deduplication)

## Key Points

- Prefer `waitForElements` + standard `<script>` over polling/setTimeout patterns
- Account for React hydration timing when interacting with `client:only="react"` components
- Keep init functions focused: check for elements, attach listeners, return success/failure
