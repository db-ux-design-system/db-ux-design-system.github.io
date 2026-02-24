--- START: Documentation Quality Rules – do not edit below ---

# Documentation Quality Rules

## Token Accuracy

**CRITICAL: Design System tokens must be 100% accurate.**

### Rules

1. **NEVER estimate, guess, or interpolate token values**
   - Always read actual values from source files in `node_modules/@db-ux/core-foundations/`
   - Never assume patterns or calculate values based on other tokens

2. **Always verify token values from these sources:**
   - CSS: `node_modules/@db-ux/core-foundations/build/css/`
   - SCSS: `node_modules/@db-ux/core-foundations/build/styles/defaults/_default-variables.scss`
   - Use `grep` or `fsRead` to extract exact values

3. **Token types that require verification:**
   - Sizing tokens (`--db-sizing-*`)
   - Spacing tokens (`--db-spacing-*`)
   - Color tokens (`--db-*-origin-*`, `--db-*-[0-14]`)
   - Border tokens (`--db-border-*`)
   - Container tokens (`--db-container-*`)

4. **When creating tables or playgrounds with token values:**
   - Read values directly from source files
   - Include both rem and px values
   - Verify all three density variants (functional, regular, expressive) if applicable

### Example: Correct approach

```bash
# Read actual sizing token values
grep "db-sizing-functional\|db-sizing-regular\|db-sizing-expressive" \
  node_modules/@db-ux/core-foundations/build/styles/defaults/_default-variables.scss
```

### Example: WRONG approach ❌

```javascript
// NEVER do this:
const tokens = [
  { token: '3xs', functional: '1rem' }, // Guessed value
  { token: '2xs', functional: '1.25rem' }, // Interpolated value
];
```

## Why This Matters

- Design System documentation is the source of truth for developers
- Incorrect token values lead to inconsistent implementations
- Token accuracy is critical for design-to-code handoff
- Errors propagate across all applications using the design system

--- END: Documentation Quality Rules – do not edit above ---
