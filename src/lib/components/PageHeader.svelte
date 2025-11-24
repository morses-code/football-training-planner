<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle,
		icon,
		gradientFrom = 'blue-600',
		gradientTo = 'purple-600',
		titleSize = 'text-3xl md:text-5xl',
		subtitleSize = 'text-lg md:text-xl',
		titleMargin = 'mb-2',
		stats,
		children
	} = $props<{
		title: string;
		subtitle?: string;
		icon: Snippet;
		gradientFrom?: string;
		gradientTo?: string;
		titleSize?: string;
		subtitleSize?: string;
		titleMargin?: string;
		stats?: Snippet;
		children?: Snippet;
	}>();
</script>

<div class="bg-gradient-to-r from-{gradientFrom} to-{gradientTo} rounded-2xl shadow-xl p-6 md:p-8 mb-6 md:mb-8">
	<div class="flex items-center gap-4 md:gap-6">
		<!-- Content -->
		<div class="flex-1 min-w-0">
			<h1 class="{titleSize} font-bold text-white {titleMargin}">{title}</h1>
			{#if subtitle}
				<p class="{subtitleSize} text-white/90">
					{subtitle}
				</p>
			{/if}
		</div>

		<!-- Icon Badge - On the right side -->
		<div class="hidden md:flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30 flex-shrink-0">
			{@render icon()}
		</div>

		<!-- Stats or additional content -->
		{#if stats}
			<div class="flex-shrink-0">
				{@render stats()}
			</div>
		{/if}
	</div>

	<!-- Optional additional content below -->
	{#if children}
		<div class="mt-4">
			{@render children()}
		</div>
	{/if}
</div>
