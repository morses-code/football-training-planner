# SvelteKit + Tailwind CSS v4 Project

## Architecture Overview

This is a **SvelteKit** application using **Svelte 5** with the new runes API (`$props()`, `$state()`, etc.) and **Tailwind CSS v4** (not v3). The project uses:
- **File-based routing**: Routes defined in `src/routes/` with `+page.svelte`, `+layout.svelte` naming convention
- **$lib alias**: Points to `src/lib/` for shared components, utilities, and assets
- **TypeScript**: Strict mode enabled across all `.ts`, `.svelte`, and config files
- **Vite**: Build tool with SvelteKit and Tailwind as Vite plugins
- **SQLite Database**: Local database with better-sqlite3 for user authentication
- **Session-based Auth**: Server-side session management with HttpOnly cookies

## Key Technology Versions

- **Svelte 5.41+**: Use modern runes API (`$props()`, `$state()`, `$derived()`, `$effect()`) instead of legacy reactive declarations
- **Tailwind CSS v4**: Uses `@import 'tailwindcss'` and `@plugin` syntax in CSS, not the old `tailwind.config.js` approach
- **SvelteKit 2.x**: File-based routing with `+page.svelte`, `+layout.svelte`, `+server.ts` patterns
- **better-sqlite3**: SQLite database for user storage
- **@oslojs/crypto & @oslojs/encoding**: Modern authentication utilities for password hashing and session tokens

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

## Project Structure

### Routes (`src/routes/`)
- `+page.svelte` - Home page with welcome message for logged-in users
- `about/+page.svelte` - About page
- `contact/+page.svelte` - Contact form with banner notifications
- `login/+page.svelte` - User login form
- `register/+page.svelte` - User registration with avatar selection
- `profile/+page.svelte` - Protected profile page for viewing/editing user data
- `profile/+page.server.ts` - Server-side auth check with redirect
- `+layout.svelte` - Root layout with vertical navigation
- `+layout.server.ts` - Passes user data from server to all pages
- `layout.css` - Global styles with Tailwind imports

### API Routes (`src/routes/api/`)
- `login/+server.ts` - POST endpoint for authentication
- `register/+server.ts` - POST endpoint for user registration
- `logout/+server.ts` - POST endpoint to invalidate session
- `profile/+server.ts` - POST endpoint to update user profile

### Components (`src/lib/components/`)
- `VerticalNav.svelte` - Collapsible vertical navigation (defaults to collapsed)
- `NavItem.svelte` - Individual nav links with hover tooltips and icons
- `NavProfile.svelte` - Profile/login section at bottom of nav with logout
- `NavIcon.svelte` - SVG icon wrapper component

### Server-side (`src/lib/server/`)
- `db.ts` - SQLite database setup with users and sessions tables
- `auth.ts` - Authentication utilities (session management, password hashing)

### Hooks & Types
- `src/hooks.server.ts` - Global server hook for session validation on every request
- `src/app.d.ts` - TypeScript types for `locals.user` and `locals.session`

### State Management
- `src/lib/stores/user.ts` - Client-side user store with logout method

## File Conventions

### Svelte 5 Component Pattern
```svelte
<script lang="ts">
  // Use $props() for component props (not export let)
  let { title, items = [] } = $props<{ title: string; items?: string[] }>();
  
  // Use $state() for reactive state (not let with reactive declarations)
  let count = $state(0);
</script>
```

### API Endpoints Pattern
```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  // Check authentication via locals.user (set by hooks.server.ts)
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  // Handle request
  return json({ success: true });
};
```

### Protected Routes Pattern
```typescript
// +page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  return {};
};
```

### Styling with Tailwind v4
- Global styles in `src/routes/layout.css` using `@import 'tailwindcss'`
- Plugins declared with `@plugin '@tailwindcss/forms'` syntax (not in config file)
- Use Tailwind classes directly in `.svelte` components
- Conditional classes with `class:name={condition}` syntax

## Authentication System

### Database Schema
- **users table**: id, email (unique), name, password_hash, avatar, created_at
- **sessions table**: id (token), user_id (FK), expires_at

### Session Management
- 30-day session expiration
- Auto-refresh when <15 days remaining
- HttpOnly cookies for security
- Server-side validation on every request via `hooks.server.ts`

### Password Security
- SHA-256 hashing with @oslojs/crypto
- Passwords never stored in plain text
- Session tokens generated with crypto.randomBytes

### User Flow
1. Register → Hash password → Create user → Create session → Set cookie
2. Login → Verify credentials → Create session → Set cookie
3. Request → Validate session (hooks) → Set locals.user → Pass to pages
4. Logout → Invalidate session → Clear cookie → Redirect

### Data Synchronization
- Use `invalidateAll()` after login/register/logout/profile updates
- Layout's `$effect` syncs server data to client-side user store
- Server data is source of truth, passed via `+layout.server.ts`

## Navigation System

### Vertical Navigation Features
- Defaults to collapsed state (64px width)
- Expands to 256px on click
- Auto-collapses after navigation or click-outside
- Icons centered when collapsed, left-aligned when expanded
- Hover tooltips appear when collapsed (square left, rounded right)
- Profile section at bottom with avatar/name display and logout

### Navigation Items
- Home, About, Contact, Profile (protected)
- Each item has an SVG icon
- Conditional justification based on expanded state
- Glass gleam animation effect on hover

### Profile Section
- Shows user avatar and name when logged in (links to profile)
- Shows "Sign in" link when logged out
- Logout button appears when nav is expanded
- Tooltips match regular nav items when collapsed

## Important Notes

### Svelte 5 Best Practices
- **Never use legacy Svelte syntax**: No `export let`, no `$:` reactive declarations—use Svelte 5 runes
- Use `$effect()` for side effects (like syncing stores with server data)
- Use `$derived()` for computed values
- Use `$state()` for reactive state

### Tailwind v4 Differences
- No `tailwind.config.js`, plugins declared in CSS with `@plugin`
- Must use `@import 'tailwindcss'` in CSS files

### Authentication Considerations
- Always check `locals.user` in server routes for protected endpoints
- Use `+page.server.ts` with redirects for protected pages
- Call `invalidateAll()` after mutations to refresh server data
- Never trust client-side state alone—validate on server

### Type Safety
- The project expects strict TypeScript—avoid `any` types
- Use proper types from `./$types` for load functions and actions
- Define component prop types with `$props<Type>()`

## Common Patterns

### Layout Structure with Auth
```svelte
<script lang="ts">
  import './layout.css';
  import VerticalNav from '$lib/components/VerticalNav.svelte';
  import { user } from '$lib/stores/user';
  
  let { children, data } = $props();
  
  // Sync server data to store
  $effect(() => {
    if (data.user) {
      user.set(data.user);
    } else {
      user.set(null);
    }
  });
</script>

<VerticalNav />
<main>{@render children()}</main>
```

### Form with API Integration
```svelte
<script lang="ts">
  import { invalidateAll, goto } from '$app/navigation';
  
  let formData = $state({ /* fields */ });
  let isSubmitting = $state(false);
  
  async function handleSubmit() {
    isSubmitting = true;
    try {
      const res = await fetch('/api/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        await invalidateAll(); // Refresh server data
        goto('/success-page');
      }
    } finally {
      isSubmitting = false;
    }
  }
</script>
```

## Adapter Configuration
Uses `@sveltejs/adapter-auto` which auto-detects deployment platform (Vercel, Netlify, etc.). Switch to specific adapter for production if needed.

## Database Notes
- Database file: `app.db` in project root (not tracked in git)
- WAL mode enabled for better concurrency
- Foreign keys enforced
- Indexes on email (users) and user_id (sessions) for performance

## Deployment Considerations
- Ensure SQLite database path is writable in production
- Consider migrating to PostgreSQL/MySQL for production at scale
- Environment variables should be used for sensitive configuration
- Session cookie settings may need adjustment for production domains
