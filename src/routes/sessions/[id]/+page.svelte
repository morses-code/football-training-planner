<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import BottomActionBar from '$lib/components/BottomActionBar.svelte';
	import ActionButton from '$lib/components/ActionButton.svelte';

	let { data } = $props<{ data: PageData }>();
	let isDeleting = $state(false);
	let gleamingItem = $state<string | null>(null);

	// Format date
	const sessionDate = new Date(data.session.session_date);
	const formattedDate = sessionDate.toLocaleDateString('en-US', { 
		weekday: 'long', 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric' 
	});

	// Get category badge color
	function getCategoryColor(category: string) {
		const colors: Record<string, string> = {
			warmup: 'bg-green-100 text-green-700',
			dribbling: 'bg-blue-100 text-blue-700',
			shooting: 'bg-red-100 text-red-700',
			passing: 'bg-yellow-100 text-yellow-700',
			small_sided: 'bg-purple-100 text-purple-700',
			other: 'bg-slate-100 text-slate-700'
		};
		return colors[category] || colors.other;
	}

	// Get slot type badge
	function getSlotTypeBadge(slotType: string) {
		const badges: Record<string, { label: string; color: string }> = {
			warmup: { label: 'Warm-up', color: 'bg-green-100 text-green-700' },
			drill: { label: 'Drill', color: 'bg-blue-100 text-blue-700' },
			small_sided: { label: 'Small Sided', color: 'bg-purple-100 text-purple-700' }
		};
		return badges[slotType] || { label: slotType, color: 'bg-slate-100 text-slate-700' };
	}

	async function deleteSession() {
		if (!confirm('Are you sure you want to delete this session? This cannot be undone.')) {
			return;
		}

		isDeleting = true;

		try {
			const res = await fetch(`/api/sessions/${data.session.id}`, {
				method: 'DELETE'
			});

			if (res.ok) {
				await invalidateAll();
				goto('/sessions');
			} else {
				alert('Failed to delete session');
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
</script>

<div class="max-w-4xl">
	<!-- Header -->
	<div class="mb-6">
		<h1 class="text-4xl font-bold text-slate-900 mb-2">Training Session</h1>
		<div class="flex items-center gap-4 text-lg text-slate-600">
			<span>{formattedDate}</span>
			<span>•</span>
			<span>{data.session.start_time}</span>
			<span>•</span>
			<span>{data.session.duration} minutes</span>
		</div>
	</div>

	{#if data.session.notes}
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
			<h3 class="font-semibold text-blue-900 mb-1">Session Notes</h3>
			<p class="text-blue-800">{data.session.notes}</p>
		</div>
	{/if}

	<!-- Session Timeline -->
	<div class="bg-white rounded-lg shadow p-6 mb-6">
		<h2 class="text-xl font-semibold text-slate-800 mb-4">Session Plan</h2>

		<div class="space-y-6">
			{#each data.slots as slot, index}
				{@const slotBadge = getSlotTypeBadge(slot.slot_type)}
				{@const coaches = data.slotCoaches[slot.id] || []}
				
				<div class="relative">
					<!-- Timeline connector -->
					{#if index < data.slots.length - 1}
						<div class="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-200 -mb-6"></div>
					{/if}

					<div class="flex gap-4">
						<!-- Timeline dot -->
						<div class="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg relative z-10">
							{index + 1}
						</div>

						<!-- Content -->
						<div class="flex-1 bg-slate-50 rounded-lg p-4">
							<div class="flex items-start justify-between mb-3">
								<div>
									<div class="flex items-center gap-3 mb-2">
										<h3 class="text-lg font-semibold text-slate-900">
											{slot.drill_name || `Slot ${index + 1}`}
										</h3>
										<span class="px-2 py-1 text-xs font-medium rounded {slotBadge.color}">
											{slotBadge.label}
										</span>
										<span class="text-sm text-slate-500">{slot.duration} mins</span>
									</div>
									{#if slot.drill_description}
										<p class="text-slate-600 mb-2">{slot.drill_description}</p>
									{/if}
									{#if slot.drill_skill_focus}
										<div class="text-sm text-slate-500 mb-2">
											<span class="font-semibold">Skills:</span> {slot.drill_skill_focus}
										</div>
									{/if}
									{#if slot.drill_min_players && slot.drill_max_players}
										<div class="text-sm text-slate-500">
											👥 {slot.drill_min_players}-{slot.drill_max_players} players
										</div>
									{/if}
								</div>
							</div>

							{#if slot.drill_equipment}
								<div class="bg-white rounded-lg p-3 mb-3 border border-slate-200">
									<div class="text-sm font-semibold text-slate-700 mb-1">Equipment Needed:</div>
									<div class="text-sm text-slate-600">{slot.drill_equipment}</div>
								</div>
							{/if}

							{#if slot.drill_instructions}
								<div class="bg-white rounded-lg p-3 mb-3 border border-slate-200">
									<div class="text-sm font-semibold text-slate-700 mb-2">Instructions:</div>
									<div class="text-sm text-slate-600 whitespace-pre-line">{slot.drill_instructions}</div>
								</div>
							{/if}

							{#if coaches.length > 0}
								<div class="border-t border-slate-200 pt-3 mt-3">
									<div class="text-sm font-semibold text-slate-700 mb-2">Assigned Coaches:</div>
									<div class="flex flex-wrap gap-2">
										{#each coaches as coach}
											<div class="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
												<div class="w-6 h-6 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
													{coach.name.charAt(0).toUpperCase()}
												</div>
												<span class="text-sm text-blue-900 font-medium">{coach.name}</span>
												<span class="text-xs text-blue-600">({coach.role})</span>
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Sticky Action Bar -->
<div class="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 print:hidden z-40">
	<div class="max-w-4xl mx-auto px-4 py-4">
		<div class="flex items-center gap-2">
			<a
				href="/sessions"
				onclick={(e) => { triggerGleam('back'); }}
				class="inline-flex items-center gap-1.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium relative overflow-hidden"
			>
				{#if gleamingItem === 'back'}
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
				{/if}
				← Back
			</a>
			<div class="flex-1"></div>
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
				href="/sessions/{data.session.id}/edit"
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
				onclick={(e) => { triggerGleam('delete'); deleteSession(); }}
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

<style>
	@media print {
		:global(nav) {
			display: none;
		}
		:global(button) {
			display: none;
		}
	}
</style>
