<!--
	@component
	Reusable SVG icon wrapper for Heroicons outline icons.
	
	## Props
	- `path`: SVG path data (d attribute) from Heroicons
	- `class`: Optional Tailwind classes (default: 'h-6 w-6')
	
	## Icon Sources
	Get icon paths from https://heroicons.com/ (outline style)
	
	@example
	```svelte
	<NavIcon path="M3 12l2-2m0 0l7-7 7 7..." class="h-5 w-5 text-blue-500" />
	```
-->
<script lang="ts">
	let { path, class: className = 'h-6 w-6' } = $props<{
		path: string;
		class?: string;
	}>();
</script>

<svg class={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={path} />
</svg>
