<script lang="ts">
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	
	let { data } = $props<{ data: PageData }>();
	
	let selectedCategory = $state<string>('all');
	let showDeleteModal = $state(false);
	let deleteDrillId = $state<string | null>(null);
	let deleteDrillName = $state<string>('');
	
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
	
	function confirmDelete(drillId: string, drillName: string) {
		deleteDrillId = drillId;
		deleteDrillName = drillName;
		showDeleteModal = true;
	}
	
	async function handleDelete() {
		if (!deleteDrillId) return;
		
		try {
			const res = await fetch(`/api/drills/${deleteDrillId}`, {
				method: 'DELETE'
			});
			
			if (res.ok) {
				await invalidateAll();
			} else {
				alert('Failed to delete drill');
			}
		} catch (error) {
			console.error('Error deleting drill:', error);
			alert('Failed to delete drill');
		} finally {
			deleteDrillId = null;
			deleteDrillName = '';
		}
	}
</script>

<div class="w-full">
	<!-- Hero Header with Gradient -->
	<div class="mb-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl md:text-5xl font-bold mb-2">Drill Library</h1>
				<p class="text-lg md:text-xl text-green-100">
					Browse and manage training drills for Under 6s
				</p>
			</div>
			<div class="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30">
				<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				</svg>
			</div>
		</div>
	</div>

	<!-- Filter Tabs -->
	<div class="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
		<div class="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
			<nav class="flex gap-4 md:gap-8 px-6 overflow-x-auto" aria-label="Drill categories">
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
					onclick={() => selectedCategory = 'passing'}
					class="py-3 md:py-4 border-b-2 font-medium text-sm md:text-base whitespace-nowrap"
					class:border-blue-600={selectedCategory === 'passing'}
					class:text-blue-600={selectedCategory === 'passing'}
					class:border-transparent={selectedCategory !== 'passing'}
					class:text-slate-600={selectedCategory !== 'passing'}
				>
					Passing
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
		{#if data.user}
			<!-- Add New Drill Card Template -->
			<a 
				href="/drills/new"
				class="group relative flex flex-col bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-dashed border-green-300 rounded-xl p-6 hover:border-green-500 hover:shadow-xl hover:from-green-100 hover:to-emerald-100 transition-all items-center justify-center min-h-[250px]"
			>
				<div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform mb-4">
					<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
				</div>
				<h3 class="text-lg font-bold text-slate-900 mb-1 text-center">Create New Drill</h3>
				<p class="text-sm text-slate-600 text-center">Click to add a new training drill</p>
			</a>
		{/if}

		{#if data.drills && data.drills.length > 0}
			{#each filteredDrills() as drill}
				{@const badge = getCategoryBadge(drill.category)}
				<div class="group relative flex flex-col bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-md border-2 border-slate-200 p-6 hover:shadow-xl hover:border-green-400 transition-all duration-200">
					<!-- Category badge ribbon -->
					<div class="absolute top-4 right-4 px-3 py-1 {badge.color} text-xs font-bold rounded-lg shadow-sm">
						{badge.label}
					</div>
					
					<h3 class="text-lg font-bold text-slate-900 mb-3 pr-20 group-hover:text-green-600 transition-colors">{drill.name}</h3>
					<p class="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow leading-relaxed">
						{drill.description}
					</p>
					
					<!-- Stats row -->
					<div class="flex items-center gap-4 mb-4">
						<div class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
							<svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span class="text-xs font-semibold text-blue-900">{drill.duration} mins</span>
						</div>
						<div class="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
							<svg class="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
							<span class="text-xs font-semibold text-purple-900">{drill.min_players}-{drill.max_players}</span>
						</div>
					</div>
					
					{#if drill.skill_focus}
						<div class="pt-4 border-t border-slate-200 mb-4">
							<div class="flex items-start gap-2">
								<svg class="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
								<span class="text-xs text-slate-600 leading-relaxed"><strong>Skills:</strong> {drill.skill_focus}</span>
							</div>
						</div>
					{/if}
					
					<!-- Action Buttons -->
					<div class="flex flex-col gap-2 mt-auto">
						<a
							href="/drills/{drill.id}"
							class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-sm"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
							</svg>
							<span>View</span>
						</a>
						<a
							href="/drills/{drill.id}/edit"
							class="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-sm"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
							</svg>
							<span>Edit</span>
						</a>
						<button
							onclick={() => confirmDelete(drill.id, drill.name)}
							class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-sm cursor-pointer"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
							<span>Delete</span>
						</button>
					</div>
				</div>
			{/each}
		{:else if !data.user}
			<div class="col-span-full text-center py-16 bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-sm border-2 border-slate-200">
				<div class="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
				</div>
				<p class="text-lg font-semibold text-slate-900 mb-2">Sign in to access the drill library</p>
				<p class="text-sm text-slate-600 mb-6">View and manage all your training drills</p>
				<a href="/login" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
					Sign In
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</a>
			</div>
		{:else}
			<div class="col-span-full text-center py-16 bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-sm border-2 border-slate-200">
				<div class="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
					</svg>
				</div>
				<p class="text-lg font-semibold text-slate-900 mb-2">No drills in your library yet</p>
				<p class="text-sm text-slate-600 mb-6">Create your first drill to get started</p>
				<a href="/drills/new" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
					Add Your First Drill
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
				</a>
			</div>
		{/if}
	</div>
</div>

<!-- Delete Confirmation Modal -->
<ConfirmModal
	bind:isOpen={showDeleteModal}
	title="Delete Drill"
	message="Are you sure you want to delete '{deleteDrillName}'? This action cannot be undone."
	confirmText="Delete"
	cancelText="Cancel"
	danger={true}
	onConfirm={handleDelete}
/>
