<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
	let isDeleting = $state(false);
	let gleamingItem = $state<string | null>(null);

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

	async function deleteDrill() {
		if (!confirm('Are you sure you want to delete this drill? This cannot be undone.')) {
			return;
		}

		isDeleting = true;

		try {
			const res = await fetch(`/api/drills/${data.drill.id}`, {
				method: 'DELETE'
			});

			if (res.ok) {
				await invalidateAll();
				goto('/drills');
			} else {
				alert('Failed to delete drill');
			}
		} catch (error) {
			alert('An error occurred. Please try again.');
		} finally {
			isDeleting = false;
		}
	}

	function print() {
		window.print();
	}

	function triggerGleam(item: string) {
		gleamingItem = item;
		setTimeout(() => {
			gleamingItem = null;
		}, 600);
	}

	const badge = $derived(getCategoryBadge(data.drill.category));
</script>

<div class="max-w-4xl">
	<!-- Header -->
	<div class="mb-6">
		<h1 class="text-4xl font-bold text-slate-900 mb-2">{data.drill.name}</h1>
		<div class="flex items-center gap-3">
			<span class="px-3 py-1 {badge.color} text-sm font-medium rounded">
				{badge.label}
			</span>
			<span class="text-slate-600">⏱️ {data.drill.duration} mins</span>
			<span class="text-slate-600">👥 {data.drill.min_players}-{data.drill.max_players} players</span>
		</div>
	</div>

	<!-- Drill Details -->
	<div class="bg-white rounded-lg shadow p-6 mb-6">
		<h2 class="text-xl font-semibold text-slate-800 mb-4">Description</h2>
		<p class="text-slate-700 leading-relaxed whitespace-pre-line">
			{data.drill.description}
		</p>
	</div>

	{#if data.drill.equipment}
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h2 class="text-xl font-semibold text-slate-800 mb-4">Equipment Needed</h2>
			<p class="text-slate-700">
				{data.drill.equipment}
			</p>
		</div>
	{/if}

	{#if data.drill.skill_focus}
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h2 class="text-xl font-semibold text-slate-800 mb-4">Skills Focus</h2>
			<p class="text-slate-700">
				{data.drill.skill_focus}
			</p>
		</div>
	{/if}

	{#if data.drill.coaching_points}
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h2 class="text-xl font-semibold text-slate-800 mb-4">Coaching Points</h2>
			<p class="text-slate-700 leading-relaxed whitespace-pre-line">
				{data.drill.coaching_points}
			</p>
		</div>
	{/if}
</div>

<!-- Sticky Action Bar -->
<div class="fixed bottom-0 left-16 right-0 bg-slate-800 border-t border-slate-700 shadow-lg print:hidden z-40">
	<div class="px-4 py-4 flex items-center justify-between">
		<a
			href="/drills"
			onclick={(e) => { triggerGleam('back'); }}
			class="inline-flex items-center gap-1.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium relative overflow-hidden"
		>
			{#if gleamingItem === 'back'}
				<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
			{/if}
			← Back
		</a>
		<div class="flex items-center gap-2">
			<button
				onclick={(e) => { triggerGleam('print'); print(); }}
				class="inline-flex items-center gap-1.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium relative overflow-hidden"
			>
				{#if gleamingItem === 'print'}
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
				{/if}
				<svg class="h-4 w-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
					/>
				</svg>
				<span class="relative z-10">Print</span>
			</button>
			<a
				href="/drills/{data.drill.id}/edit"
				onclick={(e) => { triggerGleam('edit'); }}
				class="inline-flex items-center gap-1.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium relative overflow-hidden"
			>
				{#if gleamingItem === 'edit'}
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
				{/if}
				<svg class="h-4 w-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
					/>
				</svg>
				<span class="relative z-10">Edit</span>
			</a>
			<button
				onclick={(e) => { triggerGleam('delete'); deleteDrill(); }}
				disabled={isDeleting}
				class="inline-flex items-center gap-1.5 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 relative overflow-hidden"
			>
				{#if gleamingItem === 'delete'}
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
				{/if}
				<svg class="h-4 w-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					/>
				</svg>
				<span class="relative z-10">{isDeleting ? 'Deleting...' : 'Delete'}</span>
			</button>
		</div>
	</div>
</div>

<!-- Spacer to prevent content from being hidden behind sticky bar -->
<div class="h-20 print:hidden"></div>
