# SvelteKit + Tailwind CSS v4 Project

## Architecture Overview

This is a **SvelteKit** application using **Svelte 5** with the new runes API (`$props()`, `$state()`, etc.) and **Tailwind CSS v4** (not v3). The project uses:
- **File-based routing**: Routes defined in `src/routes/` with `+page.svelte`, `+layout.svelte` naming convention
- **$lib alias**: Points to `src/lib/` for shared components, utilities, and assets
- **TypeScript**: Strict mode enabled across all `.ts`, `.svelte`, and config files
- **Vite**: Build tool with SvelteKit and Tailwind as Vite plugins

## Key Technology Versions

- **Svelte 5.41+**: Use modern runes API (`$props()`, `$state()`, `$derived()`, `$effect()`) instead of legacy reactive declarations
- **Tailwind CSS v4**: Uses `@import 'tailwindcss'` and `@plugin` syntax in CSS, not the old `tailwind.config.js` approach
- **SvelteKit 2.x**: File-based routing with `+page.svelte`, `+layout.svelte`, `+server.ts` patterns

## Development Commands

```bash
npm run dev              # Start dev server (port 5173 by default)
npm run build            # Production build
npm run preview          # Preview production build locally
npm run check            # Type-check with svelte-check
npm run check:watch      # Type-check in watch mode
npm run lint             # Run ESLint and Prettier checks
npm run format           # Auto-format with Prettier
```

## File Conventions

### Routes (`src/routes/`)
- `+page.svelte` - Page component
- `+layout.svelte` - Layout wrapping child routes
- `+server.ts` - API endpoints (GET, POST, etc.)
- `+page.ts` or `+page.server.ts` - Load functions for data fetching

### Svelte 5 Component Pattern
```svelte
<script lang="ts">
  // Use $props() for component props (not export let)
  let { title, items = [] } = $props<{ title: string; items?: string[] }>();
  
  // Use $state() for reactive state (not let with reactive declarations)
  let count = $state(0);
</script>
```

### Styling with Tailwind v4
- Global styles in `src/routes/layout.css` using `@import 'tailwindcss'`
- Plugins declared with `@plugin '@tailwindcss/forms'` syntax (not in config file)
- Use Tailwind classes directly in `.svelte` components

### Importing Assets
```typescript
import favicon from '$lib/assets/favicon.svg'; // Use $lib alias
```

## ESLint Configuration

- Uses **flat config** (`eslint.config.js`) with `defineConfig()`
- Integrates TypeScript ESLint, Svelte plugin, and Prettier
- Custom rule: `no-undef` disabled for TypeScript files (recommended by typescript-eslint)
- Respects `.gitignore` via `includeIgnoreFile()`

## TypeScript Setup

- Extends auto-generated `.svelte-kit/tsconfig.json`
- Strict mode enabled with `moduleResolution: "bundler"`
- Path aliases handled by SvelteKit config, not tsconfig
- `$lib` alias resolves to `src/lib/` automatically

## Common Patterns

### Layout Structure
The root layout (`src/routes/+layout.svelte`) imports global CSS and uses `{@render children()}` to inject child routes:
```svelte
<script lang="ts">
  import './layout.css';
  let { children } = $props();
</script>
{@render children()}
```

### Adapter Configuration
Uses `@sveltejs/adapter-auto` which auto-detects deployment platform (Vercel, Netlify, etc.). Switch to specific adapter for production if needed.

## Important Notes

- **Never use legacy Svelte syntax**: No `export let`, no `$:` reactive declarations—use Svelte 5 runes
- **Tailwind v4 is different**: No `tailwind.config.js`, plugins declared in CSS with `@plugin`
- **Vite config is minimal**: Tailwind and SvelteKit registered as Vite plugins in `vite.config.ts`
- **Type safety**: The project expects strict TypeScript—avoid `any` types

## Deployment

Run `npm run build` to generate production build in `.svelte-kit/` directory. The adapter-auto will configure output based on deployment target. Use `npm run preview` to test production build locally before deploying.
