<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import VerticalNav from '$lib/components/VerticalNav.svelte';
	import { user } from '$lib/stores/user';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	let { children, data }: { children: any; data: LayoutData } = $props();
	let mainElement: HTMLElement | undefined = $state();

	// Initialize user from server data
	$effect(() => {
		user.set(data.user);
	});

	// Scroll to top on navigation
	$effect(() => {
		$page.url.pathname; // Track pathname changes
		if (mainElement) {
			mainElement.scrollTo(0, 0);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen overflow-hidden">
	<VerticalNav />
	<main bind:this={mainElement} class="flex-1 overflow-auto p-4 md:p-8 ml-12 md:ml-16 transition-all duration-300">
		{@render children()}
	</main>
</div>
