<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { browser } from '$app/environment';
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

	// Handle back navigation
	function handleBack(e: MouseEvent) {
		e.preventDefault();
		triggerGleam('back');
		if (browser) {
			window.history.back();
		}
	}

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

	function triggerGleam(item: string) {
		gleamingItem = item;
		setTimeout(() => {
			gleamingItem = null;
		}, 600);
	}
</script>

<div class="w-full max-w-6xl mx-auto">
	<!-- Hero Header with Gradient -->
	<div class="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
		<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
			<div class="flex-1">
				<h1 class="text-3xl md:text-5xl font-bold mb-4">Training Session</h1>
				<div class="flex flex-wrap items-center gap-3 mb-2">
					<div class="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						<span class="text-sm font-medium">{formattedDate}</span>
					</div>
					<div class="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span class="text-sm font-medium">{data.session.start_time}</span>
					</div>
					<div class="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
						<span class="text-sm font-medium">{data.session.duration} minutes</span>
					</div>
				</div>
			</div>
			<!-- Large icon -->
			<div class="hidden md:flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30">
				<svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
				</svg>
			</div>
		</div>
	</div>

	{#if data.session.notes}
		<div class="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 md:p-6 mb-6 shadow-lg">
			<div class="flex items-start gap-3">
				<div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
					<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<div class="flex-1">
					<h3 class="font-bold text-blue-900 mb-2 text-lg">Session Notes</h3>
					<p class="text-base text-blue-800 leading-relaxed">{data.session.notes}</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Session Timeline -->
	<div class="bg-white rounded-xl shadow-lg p-6 mb-6">
		<div class="bg-gradient-to-r from-slate-50 to-slate-100 -m-6 px-6 py-4 mb-6 border-b border-slate-200">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
					<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h2 class="text-xl font-bold text-slate-800">Session Plan</h2>
			</div>
		</div>

		<div class="space-y-4 md:space-y-6">
			<!-- Pre-Session Setup -->
			{#if (Object.entries(data.slotCoaches).find(([slotId]) => slotId === 'null' || slotId === 'session')?.[1] as any[])?.filter((c: any) => c.taskType === 'setup')?.length > 0}
				{@const setupCoaches = (Object.entries(data.slotCoaches).find(([slotId]) => slotId === 'null' || slotId === 'session')?.[1] as any[])?.filter((c: any) => c.taskType === 'setup') || []}
				<div class="relative">
					<!-- Timeline connector -->
					<div class="absolute left-5 md:left-6 top-10 md:top-12 bottom-0 w-0.5 bg-slate-200 -mb-4 md:-mb-6"></div>

					<div class="flex gap-3 md:gap-4">
						<!-- Timeline dot -->
						<div class="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg relative z-10 text-sm md:text-base">
							<svg class="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
							</svg>
						</div>

						<!-- Content -->
						<div class="flex-1 bg-orange-50 rounded-lg p-3 md:p-4 border border-orange-200">
							<div class="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
								<h3 class="text-base md:text-lg font-semibold text-orange-900">
									Pre-Session Setup
								</h3>
								<span class="px-2 py-1 text-xs font-medium rounded bg-orange-600 text-white whitespace-nowrap">
									Setup Task
								</span>
							</div>

							<div class="bg-white rounded-lg p-2 md:p-3 mb-3 border border-orange-200">
								<div class="text-xs md:text-sm font-semibold text-slate-700 mb-2">Setup Instructions:</div>
								<div class="text-xs md:text-sm text-slate-600 whitespace-pre-line">Set up 3 pitches (20x28 yards each) with small goals and cones</div>
							</div>

							<div class="bg-white rounded-lg p-2 md:p-3 border border-orange-200">
								<div class="text-xs md:text-sm font-semibold text-slate-700 mb-2">Assigned Coaches:</div>
								<div class="flex flex-wrap gap-2">
									{#each setupCoaches as coach}
										<div class="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
											<div class="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-sm flex-shrink-0">
												{coach.name.charAt(0)}
											</div>
											<div class="flex flex-col min-w-0">
												<span class="text-xs md:text-sm font-medium text-slate-900 truncate">{coach.name}</span>
												<span class="text-xs text-slate-500 capitalize">{coach.role}</span>
											</div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}

			{#each data.slots as slot, index}
				{@const slotBadge = getSlotTypeBadge(slot.slot_type)}
				{@const coaches = data.slotCoaches[slot.id] || []}
				
				<div class="relative">
					<!-- Timeline connector -->
					{#if index < data.slots.length - 1}
						<div class="absolute left-5 md:left-6 top-10 md:top-12 bottom-0 w-0.5 bg-slate-200 -mb-4 md:-mb-6"></div>
					{/if}

					<div class="flex gap-3 md:gap-4">
						<!-- Timeline dot -->
						<div class="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg relative z-10 text-sm md:text-base">
							{index + 1}
						</div>

						<!-- Content -->
						<div class="flex-1 bg-slate-50 rounded-lg p-3 md:p-4">
							<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 md:mb-3 gap-2">
								<div class="flex-1 min-w-0">
									<div class="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
										<h3 class="text-base md:text-lg font-semibold text-slate-900">
											{slot.drill_name || `Slot ${index + 1}`}
										</h3>
										<span class="px-2 py-1 text-xs font-medium rounded {slotBadge.color} whitespace-nowrap">
											{slotBadge.label}
										</span>
										<span class="text-xs md:text-sm text-slate-500">{slot.duration} mins</span>
									</div>
									{#if slot.drill_description}
										<p class="text-sm md:text-base text-slate-600 mb-2">{slot.drill_description}</p>
									{/if}
									{#if slot.drill_skill_focus}
										<div class="text-xs md:text-sm text-slate-500 mb-2">
											<span class="font-semibold">Skills:</span> {slot.drill_skill_focus}
										</div>
									{/if}
									{#if slot.drill_min_players && slot.drill_max_players}
										<div class="text-xs md:text-sm text-slate-500">
											👥 {slot.drill_min_players}-{slot.drill_max_players} players
										</div>
									{/if}
								</div>
							</div>

							{#if slot.drill_equipment}
								<div class="bg-white rounded-lg p-2 md:p-3 mb-2 md:mb-3 border border-slate-200">
									<div class="text-xs md:text-sm font-semibold text-slate-700 mb-1">Equipment Needed:</div>
									<div class="text-xs md:text-sm text-slate-600">{slot.drill_equipment}</div>
								</div>
							{/if}

							{#if slot.drill_instructions}
								<div class="bg-white rounded-lg p-2 md:p-3 mb-2 md:mb-3 border border-slate-200">
									<div class="text-xs md:text-sm font-semibold text-slate-700 mb-2">Instructions:</div>
									<div class="text-xs md:text-sm text-slate-600 whitespace-pre-line">{slot.drill_instructions}</div>
								</div>
							{/if}

							{#if coaches.length > 0}
								<div class="border-t border-slate-200 pt-2 md:pt-3 mt-2 md:mt-3">
									<div class="text-xs md:text-sm font-semibold text-slate-700 mb-2">Assigned Coaches:</div>
									<div class="flex flex-wrap gap-2">
										{#each coaches as coach}
											<div class="flex items-center gap-1.5 md:gap-2 bg-blue-50 px-2 md:px-3 py-1 rounded-full">
												<div class="w-5 h-5 md:w-6 md:h-6 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
													{coach.name.charAt(0).toUpperCase()}
												</div>
												<span class="text-xs md:text-sm text-blue-900 font-medium">{coach.name}</span>
												<span class="text-[10px] md:text-xs text-blue-600">({coach.role})</span>
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
<div class="fixed bottom-0 left-12 md:left-16 right-0 bg-white shadow-lg z-40">
	<div class="px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
		<button
			onclick={handleBack}
			class="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium relative overflow-hidden"
		>
			{#if gleamingItem === 'back'}
				<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
			{/if}
			<span class="relative z-10">← Back</span>
		</button>
		<div class="flex items-center gap-2">
			<a
				href="/sessions/{data.session.id}/edit"
				onclick={(e) => { triggerGleam('edit'); }}
				class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-sm relative overflow-hidden"
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
				class="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
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
<div class="h-12 md:h-16"></div>
