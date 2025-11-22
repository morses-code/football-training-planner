<script lang="ts">
	import type { PageData } from './$types';
	
	let { data } = $props<{ data: PageData }>();
	
	let selectedCategory = $state<string>('all');
	let gleamingItem = $state<string | null>(null);

	function triggerGleam(item: string) {
		gleamingItem = item;
		setTimeout(() => {
			gleamingItem = null;
		}, 600);
	}
	
	// Filter drills by category
	const filteredDrills = $derived(() => {
		if (!data.drills) return [];
		if (selectedCategory === 'all') return data.drills;
		return data.drills.filter((drill: any) => drill.category === selectedCategory);
	});
	
	// Get category display name and color
	function getCategoryBadge(category: string) {
		const badges: Record<string, { label: string; color: string }> = {
			warmup: { label: 'Warm-up', color: 'bg-green-100 text-green-700' },
			dribbling: { label: 'Dribbling', color: 'bg-blue-100 text-blue-700' },
			shooting: { label: 'Shooting', color: 'bg-red-100 text-red-700' },
			passing: { label: 'Passing', color: 'bg-yellow-100 text-yellow-700' },
			small_sided: { label: 'Small Sided', color: 'bg-purple-100 text-purple-700' },
			other: { label: 'Other', color: 'bg-slate-100 text-slate-700' }
		};
		return badges[category] || badges.other;
	}
</script>

<div class="max-w-6xl">
	<div class="mb-4 md:mb-6">
		<h1 class="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Drill Library</h1>
		<p class="text-base md:text-lg text-slate-600">
			Browse and manage training drills for Under 6s
		</p>
	</div>

	<!-- Filter Tabs -->
	<div class="bg-white rounded-lg shadow mb-4 md:mb-6">
		<div class="border-b border-slate-200">
			<nav class="flex gap-4 md:gap-8 px-4 md:px-6 overflow-x-auto" aria-label="Drill categories">
				<button 
					onclick={() => selectedCategory = 'all'}
					class="py-3 md:py-4 border-b-2 font-medium text-sm md:text-base whitespace-nowrap"
					class:border-blue-600={selectedCategory === 'all'}
					class:text-blue-600={selectedCategory === 'all'}
					class:border-transparent={selectedCategory !== 'all'}
					class:text-slate-600={selectedCategory !== 'all'}
				>
					All Drills
				</button>
				<button 
					onclick={() => selectedCategory = 'warmup'}
					class="py-3 md:py-4 border-b-2 font-medium text-sm md:text-base whitespace-nowrap"
					class:border-blue-600={selectedCategory === 'warmup'}
					class:text-blue-600={selectedCategory === 'warmup'}
					class:border-transparent={selectedCategory !== 'warmup'}
					class:text-slate-600={selectedCategory !== 'warmup'}
				>
					Warm-ups
				</button>
				<button 
					onclick={() => selectedCategory = 'dribbling'}
					class="py-3 md:py-4 border-b-2 font-medium text-sm md:text-base whitespace-nowrap"
					class:border-blue-600={selectedCategory === 'dribbling'}
					class:text-blue-600={selectedCategory === 'dribbling'}
					class:border-transparent={selectedCategory !== 'dribbling'}
					class:text-slate-600={selectedCategory !== 'dribbling'}
				>
					Dribbling
				</button>
				<button 
					onclick={() => selectedCategory = 'shooting'}
					class="py-3 md:py-4 border-b-2 font-medium text-sm md:text-base whitespace-nowrap"
					class:border-blue-600={selectedCategory === 'shooting'}
					class:text-blue-600={selectedCategory === 'shooting'}
					class:border-transparent={selectedCategory !== 'shooting'}
					class:text-slate-600={selectedCategory !== 'shooting'}
				>
					Shooting
				</button>
				<button 
					onclick={() => selectedCategory = 'small_sided'}
					class="py-3 md:py-4 border-b-2 font-medium text-sm md:text-base whitespace-nowrap"
					class:border-blue-600={selectedCategory === 'small_sided'}
					class:text-blue-600={selectedCategory === 'small_sided'}
					class:border-transparent={selectedCategory !== 'small_sided'}
					class:text-slate-600={selectedCategory !== 'small_sided'}
				>
					Small Sided
				</button>
			</nav>
		</div>
	</div>

	<!-- Drills Grid -->
	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
		{#if data.drills && data.drills.length > 0}
			{#each filteredDrills() as drill}
				{@const badge = getCategoryBadge(drill.category)}
				<a
					href="/drills/{drill.id}"
					class="block bg-white rounded-lg shadow p-4 md:p-6 hover:shadow-lg transition-shadow"
				>
					<div class="flex items-start justify-between mb-3">
						<h3 class="text-base md:text-lg font-semibold text-slate-900">{drill.name}</h3>
						<span class="px-2 py-1 {badge.color} text-xs font-medium rounded whitespace-nowrap ml-2">
							{badge.label}
						</span>
					</div>
					<p class="text-sm md:text-base text-slate-600 mb-3 md:mb-4 line-clamp-3">
						{drill.description}
					</p>
					<div class="flex items-center justify-between text-xs md:text-sm text-slate-500">
						<span>⏱️ {drill.duration} mins</span>
						<span>👥 {drill.min_players}-{drill.max_players}</span>
					</div>
					{#if drill.skill_focus}
						<div class="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-200">
							<span class="text-xs text-slate-500">Skills: {drill.skill_focus}</span>
						</div>
					{/if}
				</a>
			{/each}
		{:else if !data.user}
			<div class="col-span-full text-center py-12 bg-slate-50 rounded-lg">
				<svg class="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				</svg>
				<p class="text-slate-600 mb-4">Sign in to access the drill library</p>
				<a href="/login" class="text-blue-600 hover:text-blue-700 font-medium">
					Sign In →
				</a>
			</div>
		{:else}
			<div class="col-span-full text-center py-12 bg-slate-50 rounded-lg">
				<svg class="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
				<p class="text-slate-600 mb-4">No drills in your library yet</p>
				<a href="/drills/new" class="text-blue-600 hover:text-blue-700 font-medium">
					Add Your First Drill →
				</a>
			</div>
		{/if}
	</div>
</div>

<!-- Sticky Action Bar -->
{#if data.user}
	<div class="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 print:hidden z-40">
		<div class="max-w-6xl mx-auto px-4 py-4">
			<div class="flex items-center justify-end">
				<a
					href="/drills/new"
					onclick={(e) => { triggerGleam('new'); }}
					class="inline-flex items-center gap-1.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium relative overflow-hidden"
				>
					{#if gleamingItem === 'new'}
						<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
					{/if}
					<svg class="h-4 w-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
					<span class="relative z-10">Add Drill</span>
				</a>
			</div>
		</div>
	</div>

	<!-- Spacer to prevent content from being hidden behind sticky bar -->
	<div class="h-20 print:hidden"></div>
{/if}
