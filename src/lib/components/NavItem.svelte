<script lang="ts">
	import NavIcon from './NavIcon.svelte';

	let {
		href,
		label,
		icon,
		isExpanded,
		isGleaming,
		onGleam
	} = $props<{
		href: string;
		label: string;
		icon: string;
		isExpanded: boolean;
		isGleaming: boolean;
		onGleam: () => void;
	}>();
</script>

<li class="relative">
	<a
		{href}
		onclick={onGleam}
		class="flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 hover:bg-slate-700 relative overflow-hidden"
	>
		<NavIcon path={icon} class="h-6 w-6 flex-shrink-0 relative z-10" />
		<span
			class="whitespace-nowrap text-sm font-medium transition-all duration-300 relative z-10"
			class:opacity-0={!isExpanded}
			class:opacity-100={isExpanded}
			class:w-0={!isExpanded}
			class:overflow-hidden={!isExpanded}
		>
			{label}
		</span>

		<!-- Gleam Effect -->
		{#if isGleaming}
			<div class="gleam"></div>
		{/if}
	</a>
</li>

<style>
	.gleam {
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.1) 25%,
			rgba(255, 255, 255, 0.3) 50%,
			rgba(255, 255, 255, 0.1) 75%,
			rgba(255, 255, 255, 0) 100%
		);
		animation: gleam-sweep 0.6s ease-out forwards;
		pointer-events: none;
		z-index: 5;
	}

	@keyframes gleam-sweep {
		0% {
			left: -100%;
		}
		100% {
			left: 100%;
		}
	}
</style>
