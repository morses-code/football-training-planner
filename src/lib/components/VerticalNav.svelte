<!--
	@component
	Vertical navigation sidebar with expand/collapse functionality.
	
	## Features
	- Animated expand/collapse (64px collapsed, 256px expanded)
	- Glass gleam effect on nav item clicks
	- Click-outside-to-collapse behavior
	- Auto-collapse after navigation when expanded
	
	## Usage
	```svelte
	<script>
		import VerticalNav from '$lib/components/VerticalNav.svelte';
	</script>
	
	<VerticalNav />
	```
	
	## Customization
	To customize nav items, edit the `navItems` array:
	```typescript
	const navItems: NavItem[] = [
		{
			label: 'Dashboard',
			href: '/dashboard',
			icon: 'M3 12l2-2m0 0l7-7...' // Heroicons SVG path
		}
	];
	```
	
	## Dependencies
	- NavItem: Individual navigation link with gleam effect
	- NavIcon: SVG icon wrapper for Heroicons paths
	- NavProfile: User profile footer section
	
	@example
	<VerticalNav />
-->
<script lang="ts">
	import NavIcon from './NavIcon.svelte';
	import NavItem from './NavItem.svelte';
	import NavProfile from './NavProfile.svelte';

	type NavItem = {
		label: string;
		href: string;
		icon: string;
	};

	let isExpanded = $state(false);
	let gleamingItem = $state<number | null>(null);
	let navElement: HTMLElement | undefined = $state();

	const navItems: NavItem[] = [
		{
			label: 'Home',
			href: '/',
			icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
		},
		{
			label: 'About',
			href: '/about',
			icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		{
			label: 'Contact Us',
			href: '/contact',
			icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
		}
	];

	function toggleNav() {
		isExpanded = !isExpanded;
	}

	function triggerGleam(index: number) {
		gleamingItem = index;
		setTimeout(() => {
			gleamingItem = null;
		}, 600);
	}

	function handleClickOutside(event: MouseEvent) {
		if (isExpanded && navElement && !navElement.contains(event.target as Node)) {
			isExpanded = false;
		}
	}

	$effect(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<nav
	bind:this={navElement}
	class="fixed left-0 top-0 h-full bg-slate-800 text-white shadow-lg transition-all duration-300 ease-in-out z-50"
	class:w-64={isExpanded}
	class:w-16={!isExpanded}
>
	<div class="flex h-full flex-col">
		<!-- Toggle Button -->
		<button
			onclick={toggleNav}
			class="flex h-16 items-center justify-center border-b border-slate-700 hover:bg-slate-700 transition-colors duration-200"
			aria-label={isExpanded ? 'Collapse navigation' : 'Expand navigation'}
		>
			<NavIcon
				path="M4 6h16M4 12h16M4 18h16"
				class="h-6 w-6 transition-transform duration-300 {isExpanded ? '' : 'rotate-180'}"
			/>
		</button>

		<!-- Navigation Items -->
		<ul class="flex-1 space-y-1 p-2">
			{#each navItems as item, index}
				<NavItem
					href={item.href}
					label={item.label}
					icon={item.icon}
					{isExpanded}
					isGleaming={gleamingItem === index}
					onGleam={() => triggerGleam(index)}
					onNavigate={() => {
						if (isExpanded) {
							isExpanded = false;
						}
					}}
				/>
			{/each}
		</ul>

		<!-- Footer -->
		<NavProfile {isExpanded} />
	</div>
</nav>

