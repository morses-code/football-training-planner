<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import VerticalNav from '$lib/components/VerticalNav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen overflow-hidden">
	<VerticalNav />
	<main class="flex-1 overflow-auto p-8 ml-16 transition-all duration-300">
		{@render children()}
	</main>
</div>
