<script lang="ts">
	let { path, class: className = 'h-6 w-6' } = $props<{
		path: string;
		class?: string;
	}>();
</script>

<svg class={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={path} />
</svg>
