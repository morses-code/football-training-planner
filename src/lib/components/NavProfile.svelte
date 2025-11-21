<!--
	@component
	User profile section for navigation footer with login/logout functionality.
	
	## Props
	- `isExpanded`: Whether parent nav is expanded (controls visibility)
	
	## Features
	- Shows login button when not authenticated
	- Displays user profile with avatar when authenticated
	- Logout functionality
	- Links to profile page when logged in
	
	@example
	```svelte
	<NavProfile isExpanded={true} />
	```
-->
<script lang="ts">
	import { user } from '$lib/stores/user';
	import { invalidateAll, goto } from '$app/navigation';
	import NavIcon from './NavIcon.svelte';

	let { isExpanded } = $props<{
		isExpanded: boolean;
	}>();

	const avatarPaths: Record<string, string> = {
		'user-circle': 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		'star': 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
		'heart': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
		'lightning': 'M13 10V3L4 14h7v7l9-11h-7z',
		'fire': 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
		'moon': 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
		'sun': 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
		'music': 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
	};

	async function handleLogout() {
		await user.logout();
		await invalidateAll();
		goto('/');
	}
</script>

<div class="border-t border-slate-700 p-4">
	{#if $user}
		<!-- Logged in state -->
		<a
			href="/profile"
			class="flex items-center hover:bg-slate-700 rounded-lg p-2 -m-2 transition-colors relative group"
			class:justify-start={isExpanded}
			class:justify-center={!isExpanded}
			class:gap-4={isExpanded}
		>
			<div class="h-8 w-8 flex-shrink-0 text-slate-300">
				<NavIcon path={avatarPaths[$user.avatar] || avatarPaths['user-circle']} class="h-8 w-8" />
			</div>
			<div
				class="transition-all duration-300 flex-1"
				class:opacity-0={!isExpanded}
				class:opacity-100={isExpanded}
				class:w-0={!isExpanded}
				class:overflow-hidden={!isExpanded}
			>
				<p class="text-sm font-medium whitespace-nowrap">{$user.name}</p>
				<p class="text-xs text-slate-400 whitespace-nowrap">{$user.email}</p>
			</div>
			
			<!-- Tooltip for collapsed state -->
			{#if !isExpanded}
				<div
					class="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-r-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50"
				>
					Profile
				</div>
			{/if}
		</a>
		
		{#if isExpanded}
			<button
				onclick={handleLogout}
				class="w-full mt-2 text-xs text-slate-400 hover:text-slate-200 py-2 transition-colors"
			>
				Sign out
			</button>
		{/if}
	{:else}
		<!-- Logged out state -->
		<a
			href="/login"
			class="flex items-center hover:bg-slate-700 rounded-lg p-2 -m-2 transition-colors relative group"
			class:justify-start={isExpanded}
			class:justify-center={!isExpanded}
			class:gap-4={isExpanded}
		>
			<NavIcon
				path="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
				class="h-6 w-6 flex-shrink-0"
			/>
			<span
				class="text-sm font-medium whitespace-nowrap transition-all duration-300"
				class:opacity-0={!isExpanded}
				class:opacity-100={isExpanded}
				class:w-0={!isExpanded}
				class:overflow-hidden={!isExpanded}
			>
				Sign in
			</span>
			
			<!-- Tooltip for collapsed state -->
			{#if !isExpanded}
				<div
					class="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-r-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50"
				>
					Sign in
				</div>
			{/if}
		</a>
	{/if}
</div>
