<!--
	@component
	Individual navigation link with glass gleam animation effect and tooltips.
	
	## Props
	- `href`: Navigation destination URL
	- `label`: Display text for the nav item
	- `icon`: Heroicons SVG path string
	- `isExpanded`: Whether parent nav is expanded
	- `isGleaming`: Whether gleam animation is active
	- `onGleam`: Callback to trigger gleam effect
	- `onNavigate`: Optional callback fired on click (e.g., to collapse nav)
	
	## Features
	- Icons center when collapsed, left-align when expanded
	- Hover tooltips appear when navigation is collapsed
	- Glass gleam animation on click
	- Smooth transitions between states
	
	@example
	```svelte
	<NavItem
		href="/home"
		label="Home"
		icon="M3 12l2-2m0 0l7-7..."
		isExpanded={true}
		isGleaming={false}
		onGleam={() => console.log('gleam')}
		onNavigate={() => console.log('navigating')}
	/>
	```
-->
<script lang="ts">
	import NavIcon from './NavIcon.svelte';

	let {
		href,
		label,
		icon,
		isExpanded,
		isGleaming,
		onGleam,
		onNavigate
	} = $props<{
		href: string;
		label: string;
		icon: string;
		isExpanded: boolean;
		isGleaming: boolean;
		onGleam: () => void;
		onNavigate?: () => void;
	}>();

	function handleClick() {
		onGleam();
		onNavigate?.();
	}
</script>

<li class="relative group">
	<a
		{href}
		onclick={handleClick}
		class="flex items-center rounded-lg px-3 md:px-4 py-2 md:py-3 transition-all duration-200 hover:bg-slate-700 relative overflow-hidden"
		class:justify-start={isExpanded}
		class:justify-center={!isExpanded}
		class:gap-4={isExpanded}
	>
		<NavIcon path={icon} class="h-5 w-5 md:h-6 md:w-6 flex-shrink-0 relative z-10" />
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
	
	<!-- Tooltip (only visible when collapsed) -->
	{#if !isExpanded}
		<div
			class="absolute left-full top-1/2 -translate-y-1/2 bg-slate-800 text-white text-sm font-medium px-3 py-2 rounded-r-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none"
		>
			{label}
		</div>
	{/if}
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
