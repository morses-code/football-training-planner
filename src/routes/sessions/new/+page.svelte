<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import type { Coach, Drill, Slot } from '$lib/types/sessions';
	import PageHeader from '$lib/components/PageHeader.svelte';

	let { data } = $props<{ data: PageData }>();

	// Get today's date in YYYY-MM-DD format for min date
	const today = new Date().toISOString().split('T')[0];

	let sessionData = $state({
		date: '',
		time: '17:30',
		duration: 60,
		notes: '',
		setupNotes: 'Set up 3 pitches (20x28 yards each) with small goals and cones'
	});

	let setupCoaches = $state<Coach[]>([]);

	let slots = $state<Slot[]>([
		{ id: '1', type: 'warmup', name: 'Warm-up', duration: 10, drillId: null, drill: null, coaches: [] },
		{ id: '2', type: 'drill', name: 'Drill 1', duration: 15, drillId: null, drill: null, coaches: [] },
		{ id: '3', type: 'drill', name: 'Drill 2', duration: 15, drillId: null, drill: null, coaches: [] },
		{ id: '4', type: 'small_sided', name: '4v4 Game', duration: 20, drillId: null, drill: null, coaches: [] }
	]);

	let isSubmitting = $state(false);
	let error = $state<string | null>(null);
	let selectingSlotIndex = $state<number | null>(null);
	let assigningCoachSlotIndex = $state<number | null>(null);
	let assigningSetupCoach = $state(false);

	function selectDrillForSlot(slotIndex: number) {
		selectingSlotIndex = slotIndex;
	}

	function assignDrill(slotIndex: number, drillId: string) {
		const drill = data.drills.find((d: Drill) => d.id === drillId);
		if (drill) {
			slots[slotIndex].drillId = drillId;
			slots[slotIndex].drill = drill as Drill;
			slots[slotIndex].duration = drill.duration;
		}
		selectingSlotIndex = null;
	}

	function removeDrill(slotIndex: number) {
		slots[slotIndex].drillId = null;
		slots[slotIndex].drill = null;
	}

	function assignCoachToSlot(slotIndex: number) {
		assigningCoachSlotIndex = slotIndex;
	}

	function addCoachToSlot(slotIndex: number, coachId: string, role: string) {
		const coach = data.coaches.find((c: Coach) => c.id === coachId);
		if (coach && !slots[slotIndex].coaches.find((c: Coach) => c.id === coachId)) {
			slots[slotIndex].coaches.push({ ...coach, role } as Coach);
		}
		assigningCoachSlotIndex = null;
	}

	function addCoachToSetup(coachId: string, role: string) {
		const coach = data.coaches.find((c: Coach) => c.id === coachId);
		if (coach && !setupCoaches.find((c: Coach) => c.id === coachId)) {
			setupCoaches.push({ ...coach, role } as Coach);
		}
		assigningSetupCoach = false;
	}

	function removeCoachFromSlot(slotIndex: number, coachId: string) {
		slots[slotIndex].coaches = slots[slotIndex].coaches.filter((c) => c.id !== coachId);
	}

	function removeCoachFromSetup(coachId: string) {
		setupCoaches = setupCoaches.filter((c) => c.id !== coachId);
	}

	async function handleSubmit() {
		isSubmitting = true;
		error = null;

		try {
			// Build coach assignments array
			const coachAssignments: Array<{
				slotId: null;
				coachId: string;
				role: string;
				slotIndex: number;
				taskType?: string;
			}> = [];
			
			// Add setup coaches (slotIndex: -1 to indicate pre-session setup)
			setupCoaches.forEach((coach: Coach) => {
				coachAssignments.push({
					slotId: null,
					coachId: coach.id,
					role: coach.role,
					slotIndex: -1,
					taskType: 'setup'
				});
			});
			
			slots.forEach((slot: Slot, index: number) => {
				slot.coaches.forEach((coach: Coach) => {
					coachAssignments.push({
						slotId: null, // We'll need to map these after slots are created
						coachId: coach.id,
						role: coach.role,
						slotIndex: index
					});
				});
			});

			const res = await fetch('/api/sessions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sessionDate: sessionData.date,
					startTime: sessionData.time,
					duration: sessionData.duration,
					notes: sessionData.notes,
					setupNotes: sessionData.setupNotes,
					slots: slots.map((slot: Slot) => ({
						type: slot.type,
						drillId: slot.drillId,
						duration: slot.duration,
						notes: null
					})),
					coaches: coachAssignments
				})
			});

			const responseData = await res.json();

			if (!res.ok) {
				error = responseData.error || 'Failed to create session';
				return;
			}

			await invalidateAll();
			goto('/sessions');
		} catch (e) {
			error = 'An error occurred. Please try again.';
		} finally {
			isSubmitting = false;
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

	function getCategoryLabel(category: string) {
		const labels: Record<string, string> = {
			warmup: 'Warm-up',
			dribbling: 'Dribbling',
			shooting: 'Shooting',
			passing: 'Passing',
			small_sided: 'Small Sided',
			other: 'Other'
		};
		return labels[category] || category;
	}
</script>

<div class="w-full">
	<!-- Hero Header -->
	<PageHeader 
		title="New Training Session"
		subtitle="Plan your Under 6s training session"
		gradientFrom="blue-600"
		gradientTo="purple-600"
	>
		{#snippet icon()}
			<svg class="h-12 w-12 md:h-16 md:w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
			</svg>
		{/snippet}
	</PageHeader>

	{#if error}
		<div class="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
			<svg class="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{error}</span>
		</div>
	{/if}

	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
		<!-- Session Details -->
		<div class="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-md border-2 border-slate-200 p-6 mb-6">
			<div class="flex items-center gap-3 mb-6">
				<div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
					<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				</div>
				<h2 class="text-xl font-bold text-slate-900">Session Details</h2>
			</div>
			
			<div class="grid md:grid-cols-2 gap-4 mb-4">
				<div>
					<label for="date" class="block text-sm font-bold text-slate-700 mb-2">
						Date
					</label>
					<input
						type="date"
						id="date"
						bind:value={sessionData.date}
						min={today}
						required
						class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
					/>
				</div>
				
				<div>
					<label for="time" class="block text-sm font-bold text-slate-700 mb-2">
						Start Time
					</label>
					<input
						type="time"
						id="time"
						bind:value={sessionData.time}
						required
						class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
					/>
				</div>
			</div>

			<div class="mb-4">
				<label for="notes" class="block text-sm font-bold text-slate-700 mb-2">
					Session Notes
				</label>
				<textarea
					id="notes"
					bind:value={sessionData.notes}
					rows="3"
					placeholder="Any special notes or reminders for this session..."
					class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
				></textarea>
			</div>
		</div>

		<!-- Pitch Setup Section -->
		<div class="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-md border-2 border-slate-200 p-6 mb-6">
			<div class="flex items-center gap-3 mb-6">
				<div class="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
					<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
					</svg>
				</div>
				<h2 class="text-xl font-bold text-slate-900">Pre-Session Setup</h2>
			</div>
			
			<div class="mb-4">
				<div class="block text-sm font-bold text-slate-700 mb-2">
					Setup Instructions
				</div>
				<div class="bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-700">
					{sessionData.setupNotes}
				</div>
			</div>

			<!-- Setup Coaches -->
			<div>
				<div class="flex items-center justify-between mb-3">
					<div class="block text-sm font-bold text-slate-700">
						Assigned Coaches
					</div>
					<button
						type="button"
						onclick={() => assigningSetupCoach = true}
						class="text-sm text-blue-600 hover:text-blue-700 font-bold"
					>
						+ Assign Coach
					</button>
				</div>
				
				{#if setupCoaches.length > 0}
					<div class="space-y-2">
						{#each setupCoaches as coach}
							<div class="flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg px-3 py-2">
								<div class="flex items-center gap-2">
									<span class="text-sm font-bold text-slate-900">{coach.name}</span>
									<span class="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded">
										{coach.role}
									</span>
								</div>
								<button
									type="button"
									onclick={() => removeCoachFromSetup(coach.id)}
									class="text-red-600 hover:text-red-700 text-sm font-semibold"
								>
									Remove
								</button>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-slate-500 italic">No coaches assigned to setup yet</p>
				{/if}
			</div>
		</div>

		<!-- Session Structure -->
		<div class="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-md border-2 border-slate-200 p-6 mb-6">
			<div class="flex items-center gap-3 mb-6">
				<div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
					<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
					</svg>
				</div>
				<h2 class="text-xl font-bold text-slate-900">Session Structure (60 mins)</h2>
			</div>
			
			<div class="space-y-4">
				{#each slots as slot, index}
					<div class="border border-slate-200 rounded-lg p-4">
						<div class="flex items-center justify-between mb-3">
							<div class="flex items-center gap-3">
								<span class="text-lg font-semibold text-slate-900">{slot.name}</span>
								<span class="text-sm text-slate-500">{slot.duration} mins</span>
								{#if slot.type === 'warmup'}
									<span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
										Warm-up
									</span>
								{:else if slot.type === 'small_sided'}
									<span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
										Small Sided
									</span>
								{:else}
									<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
										Drill
									</span>
								{/if}
							</div>
						</div>
						
						{#if slot.drill}
							<!-- Assigned drill -->
							<div class="bg-slate-50 rounded-lg p-3 mb-3">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<h4 class="font-semibold text-slate-900 mb-1">{slot.drill.name}</h4>
										<p class="text-sm text-slate-600 mb-2">{slot.drill.description}</p>
										<div class="flex gap-3 text-xs text-slate-500">
											<span>⏱️ {slot.drill.duration} mins</span>
											<span>👥 {slot.drill.min_players}-{slot.drill.max_players} players</span>
										</div>
									</div>
									<button
										type="button"
										onclick={() => removeDrill(index)}
										class="text-red-600 hover:text-red-700 text-sm font-medium"
									>
										Remove
									</button>
								</div>
							</div>
						{:else}
							<!-- No drill selected -->
							<button
								type="button"
								onclick={() => selectDrillForSlot(index)}
								class="w-full px-4 py-2 mb-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium"
							>
								+ Select Drill
							</button>
						{/if}

						<!-- Assigned Coaches -->
						{#if slot.coaches.length > 0}
							<div class="mb-3">
								<h5 class="text-xs font-semibold text-slate-600 mb-2">Assigned Coaches:</h5>
								<div class="flex flex-wrap gap-2">
									{#each slot.coaches as coach}
										<div class="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-sm">
											<span class="text-blue-900">{coach.name}</span>
											<span class="text-blue-600 text-xs">({coach.role})</span>
											<button
												type="button"
												onclick={() => removeCoachFromSlot(index, coach.id)}
												class="text-blue-600 hover:text-blue-800"
											>
												×
											</button>
										</div>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Assign Coach Button -->
						<button
							type="button"
							onclick={() => assignCoachToSlot(index)}
							class="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
						>
							+ Assign Coach
						</button>
					</div>
				{/each}
			</div>
		</div>

		<!-- Drill Selection Modal -->
		{#if selectingSlotIndex !== null}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="fixed inset-0 backdrop-blur-sm bg-slate-900/20 flex items-center justify-center p-4 z-50" onclick={(e) => { if (e.target === e.currentTarget) selectingSlotIndex = null; }}>
				<div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
					<div class="p-6 border-b border-slate-200">
						<div class="flex items-center justify-between">
							<h3 class="text-xl font-semibold text-slate-900">
								Select Drill for {slots[selectingSlotIndex].name}
							</h3>
							<button
								type="button"
								onclick={() => selectingSlotIndex = null}
								class="text-slate-400 hover:text-slate-600"
								aria-label="Close drill selection modal"
							>
								<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>
					<div class="p-6 overflow-y-auto max-h-[60vh]">
						{#if selectingSlotIndex !== null}
							{@const currentSlotType = slots[selectingSlotIndex].type}
							{@const filteredDrills = data.drills.filter((drill: Drill) => {
								if (currentSlotType === 'warmup') {
									return drill.category === 'warmup';
								} else if (currentSlotType === 'small_sided') {
									return drill.category === 'small_sided';
								} else {
									// Regular drill slots: show everything except warmup and small_sided
									return drill.category !== 'warmup' && drill.category !== 'small_sided';
								}
							})}
							
							{#if filteredDrills.length > 0}
								<div class="grid md:grid-cols-2 gap-4">
									{#each filteredDrills as drill}
										<button
											type="button"
											onclick={() => assignDrill(selectingSlotIndex!, drill.id)}
											class="text-left bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
										>
											<div class="flex items-start justify-between mb-2">
												<h4 class="font-semibold text-slate-900">{drill.name}</h4>
												<span class="px-2 py-1 text-xs font-medium rounded {getCategoryColor(drill.category)}">
													{getCategoryLabel(drill.category)}
												</span>
											</div>
											<p class="text-sm text-slate-600 mb-2 line-clamp-2">{drill.description}</p>
											<div class="flex gap-3 text-xs text-slate-500">
												<span>⏱️ {drill.duration} mins</span>
												<span>👥 {drill.min_players}-{drill.max_players} players</span>
											</div>
										</button>
									{/each}
								</div>
							{:else}
								<div class="text-center py-8">
									<p class="text-slate-500 mb-2">No {getCategoryLabel(currentSlotType)} drills available</p>
									<p class="text-sm text-slate-400">Create a drill in the appropriate category first</p>
								</div>
							{/if}
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- Coach Assignment Modal -->
		{#if assigningCoachSlotIndex !== null}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="fixed inset-0 backdrop-blur-sm bg-slate-900/20 flex items-center justify-center p-4 z-50" onclick={(e) => { if (e.target === e.currentTarget) assigningCoachSlotIndex = null; }}>
				<div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
					<div class="p-6 border-b border-slate-200">
						<div class="flex items-center justify-between">
							<h3 class="text-xl font-semibold text-slate-900">
								Assign Coach to {slots[assigningCoachSlotIndex].name}
							</h3>
							<button
								type="button"
								onclick={() => assigningCoachSlotIndex = null}
								class="text-slate-400 hover:text-slate-600"
								aria-label="Close coach assignment modal"
							>
								<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>
					<div class="p-6">
						<div class="space-y-3">
							{#each data.coaches as coach}
								<div class="border border-slate-200 rounded-lg p-4">
									<div class="flex items-center justify-between mb-3">
										<div class="flex items-center gap-3">
											<div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
												{coach.name.charAt(0).toUpperCase()}
											</div>
											<div>
												<div class="font-semibold text-slate-900">{coach.name}</div>
												<div class="text-sm text-slate-500">{coach.email}</div>
											</div>
										</div>
									</div>
									<div class="flex gap-2">
										<button
											type="button"
											onclick={() => addCoachToSlot(assigningCoachSlotIndex!, coach.id, 'lead')}
											class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
										>
											Lead Coach
										</button>
										<button
											type="button"
											onclick={() => addCoachToSlot(assigningCoachSlotIndex!, coach.id, 'assistant')}
											class="flex-1 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded transition-colors"
										>
											Assistant
										</button>
										<button
											type="button"
											onclick={() => addCoachToSlot(assigningCoachSlotIndex!, coach.id, 'setup')}
											class="flex-1 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded transition-colors"
										>
											Setup
										</button>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Setup Coach Assignment Modal -->
		{#if assigningSetupCoach}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="fixed inset-0 backdrop-blur-sm bg-slate-900/20 flex items-center justify-center p-4 z-50" onclick={(e) => { if (e.target === e.currentTarget) assigningSetupCoach = false; }}>
				<div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
					<div class="p-6 border-b border-slate-200">
						<div class="flex items-center justify-between">
							<h3 class="text-xl font-semibold text-slate-900">
								Assign Coach to Setup
							</h3>
							<button
								type="button"
								onclick={() => assigningSetupCoach = false}
								class="text-slate-400 hover:text-slate-600"
								aria-label="Close coach assignment modal"
							>
								<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>
					<div class="p-6">
						<div class="space-y-3">
							{#each data.coaches as coach}
								<div class="border border-slate-200 rounded-lg p-4">
									<div class="flex items-center justify-between mb-3">
										<div class="flex items-center gap-3">
											<div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
												{coach.name.charAt(0).toUpperCase()}
											</div>
											<div>
												<div class="font-semibold text-slate-900">{coach.name}</div>
												<div class="text-sm text-slate-500">{coach.email}</div>
											</div>
										</div>
									</div>
									<div class="flex gap-2">
										<button
											type="button"
											onclick={() => addCoachToSetup(coach.id, 'lead')}
											class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
										>
											Lead Setup
										</button>
										<button
											type="button"
											onclick={() => addCoachToSetup(coach.id, 'assistant')}
											class="flex-1 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded transition-colors"
										>
											Assistant
										</button>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Action Buttons -->
		<div class="flex items-center justify-end gap-3 pt-6">
			<a
				href="/sessions"
				class="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all font-semibold cursor-pointer"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
				<span>Cancel</span>
			</a>
			<button
				type="submit"
				disabled={isSubmitting}
				class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg text-white rounded-lg transition-all font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
				<span>{isSubmitting ? 'Creating...' : 'Create Session'}</span>
			</button>
		</div>

	</form>
</div>
