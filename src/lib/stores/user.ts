/**
 * @fileoverview Client-side user store for authentication state.
 * 
 * This module provides a Svelte store for managing user authentication state
 * on the client side. The store is synchronized with server-side session data
 * via the root layout's load function and $effect.
 * 
 * @module lib/stores/user
 * 
 * ## Usage
 * The store is automatically synced with server data in +layout.svelte.
 * Components can subscribe to the store to access current user state.
 * 
 * @example
 * ```svelte
 * <script>
 *   import { user } from '$lib/stores/user';
 * </script>
 * 
 * {#if $user}
 *   <p>Welcome, {$user.name}!</p>
 *   <button onclick={() => user.logout()}>Sign Out</button>
 * {:else}
 *   <a href="/login">Sign In</a>
 * {/if}
 * ```
 * 
 * @example
 * ```typescript
 * // Manually set user (typically done in layout from server data)
 * user.set({ id: '1', name: 'John', email: 'john@example.com', avatar: 'star' });
 * 
 * // Logout
 * await user.logout(); // Calls API and clears store
 * ```
 */
import { writable } from 'svelte/store';

/** User data type. Null when not authenticated. */
export type User = {
	/** Unique user identifier */
	id: string;
	/** User's display name */
	name: string;
	/** User's email address */
	email: string;
	/** Avatar icon identifier */
	avatar: string;
} | null;

/**
 * Creates the user store with logout functionality.
 * 
 * @returns A Svelte store with subscribe, set, and logout methods
 */
function createUserStore() {
	const { subscribe, set } = writable<User>(null);

	return {
		subscribe,
		set,
		/**
		 * Logs out the current user.
		 * 
		 * Calls the logout API endpoint to invalidate the server-side session,
		 * then clears the client-side user state.
		 * 
		 * @note The caller should use `invalidateAll()` and `goto('/')` after logout
		 * to refresh server data and redirect appropriately.
		 */
		logout: async () => {
			await fetch('/api/logout', { method: 'POST' });
			set(null);
		}
	};
}

/**
 * Global user store for authentication state.
 * 
 * This store is automatically synchronized with server-side session data
 * through the root layout. Subscribe to this store to access current user
 * information and authentication status.
 * 
 * @type {import('svelte/store').Writable<User> & { logout: () => Promise<void> }}
 */
export const user = createUserStore();
