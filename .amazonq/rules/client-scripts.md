# Client-Side Scripts in Astro

## Requirements

- Page must be `.astro` file (not `.mdx`) for `slot="script"` to work
- Scripts that interact with React components using `client:only="react"` must account for hydration timing
- Use `<script is:inline slot="script">` to place scripts in document body via layout slot mechanism
- Use `define:vars={{ data }}` to pass server-side data to client scripts

## Pattern

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

## Key Points

- Initial delay: 1000ms after page load
- Retry mechanism: up to 10 attempts with 500ms intervals
- Handles React hydration timing for `client:only="react"` components
