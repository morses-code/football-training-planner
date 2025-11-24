<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import type { Coach, Drill, Slot } from '$lib/types/sessions';
	import PageHeader from '$lib/components/PageHeader.svelte';

	let { data } = $props<{ data: PageData }>();

	// Convert session date from timestamp to YYYY-MM-DD format
	const sessionDate = new Date(data.session.session_date);
	const dateString = sessionDate.toISOString().split('T')[0];

	let sessionData = $state({
		date: dateString,
		time: data.session.start_time,
		duration: data.session.duration,
		notes: data.session.notes || ''
	});

	// Initialize slots from existing data
	let slots = $state<Slot[]>(
		data.slots.map((slot: any, index: number) => {
			const slotCoaches = data.slotCoaches[slot.id] || [];
			return {
				id: slot.id,
				type: slot.slot_type,
				name: slot.slot_type === 'warmup' ? 'Warm-up' : 
					  slot.slot_type === 'small_sided' ? '4v4 Game' : 
					  `Drill ${index}`,
				duration: slot.duration,
				drillId: slot.drill_id || null,
				drill: slot.drill_id ? {
					id: slot.drill_id,
					name: slot.drill_name,
					category: slot.drill_category,
					duration: slot.duration
				} : null,
				coaches: slotCoaches.map((c: any) => ({ ...c }))
			};
		})
	);

	let isSubmitting = $state(false);
	let error = $state<string | null>(null);
	let selectingSlotIndex = $state<number | null>(null);
	let assigningCoachSlotIndex = $state<number | null>(null);
	let gleamingItem = $state<string | null>(null);

	function triggerGleam(item: string) {
		gleamingItem = item;
		setTimeout(() => {
			gleamingItem = null;
		}, 600);
	}

	function selectDrillForSlot(slotIndex: number) {
		selectingSlotIndex = slotIndex;
	}

	function assignDrill(slotIndex: number, drillId: string) {
		const drill = data.drills.find((d: any) => d.id === drillId);
		if (drill) {
			slots[slotIndex].drillId = drillId;
			slots[slotIndex].drill = drill;
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
		const coach = data.coaches.find((c: any) => c.id === coachId);
		if (coach && !slots[slotIndex].coaches.find((c: any) => c.id === coachId)) {
			slots[slotIndex].coaches.push({ ...coach, role });
		}
		assigningCoachSlotIndex = null;
	}

	function removeCoachFromSlot(slotIndex: number, coachId: string) {
		slots[slotIndex].coaches = slots[slotIndex].coaches.filter((c: any) => c.id !== coachId);
	}

	async function handleSubmit() {
		isSubmitting = true;
		error = null;

		try {
			const coachAssignments: Array<{
				slotId: null;
				coachId: string;
				role: string;
				slotIndex: number;
			}> = [];
			
			slots.forEach((slot: Slot, index: number) => {
				slot.coaches.forEach((coach: Coach) => {
					coachAssignments.push({
						slotId: null,
						coachId: coach.id,
						role: coach.role,
						slotIndex: index
					});
				});
			});

			const res = await fetch(`/api/sessions/${data.session.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sessionDate: sessionData.date,
					startTime: sessionData.time,
					duration: sessionData.duration,
					notes: sessionData.notes,
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
				error = responseData.error || 'Failed to update session';
				return;
			}

			await invalidateAll();
			goto(`/sessions/${data.session.id}`);
		} catch (e) {
			error = 'An error occurred. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

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
		title="Edit Training Session"
		subtitle="Update your Under 6s training session"
		gradientFrom="blue-600"
		gradientTo="purple-600"
	>
		{#snippet icon()}
			<svg class="h-12 w-12 md:h-16 md:w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
			</svg>
		{/snippet}
	</PageHeader>

	{#if error}
		<div class="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
			<svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

		<!-- Session Structure -->
		<div class="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-md border-2 border-slate-200 p-6 mb-6">
			<div class="flex items-center gap-3 mb-6">
				<div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
					<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
					</svg>
				</div>
				<h2 class="text-xl font-bold text-slate-900">Session Structure</h2>
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
							<div class="bg-slate-50 rounded-lg p-3 mb-3">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<h4 class="font-semibold text-slate-900 mb-1">{slot.drill.name}</h4>
										<div class="flex gap-3 text-xs text-slate-500">
											<span>⏱️ {slot.drill.duration} mins</span>
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
							<button
								type="button"
								onclick={() => selectDrillForSlot(index)}
								class="w-full px-4 py-2 mb-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium"
							>
								+ Select Drill
							</button>
						{/if}

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
							{@const filteredDrills = data.drills.filter((drill: any) => {
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

		<!-- Actions -->
		<div class="fixed bottom-0 left-12 md:left-16 right-0 bg-white border-t-2 border-slate-200 shadow-xl z-40">
			<div class="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4">
				<div class="flex items-center gap-3">
					<a
						href="/sessions/{data.session.id}"
						onclick={(e) => { triggerGleam('cancel'); }}
						class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all text-sm font-semibold relative overflow-hidden"
					>
						{#if gleamingItem === 'cancel'}
							<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-gleam"></div>
						{/if}
						<svg class="h-4 w-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						<span class="relative z-10">Cancel</span>
					</a>
					<div class="flex-1"></div>
					<button
						type="submit"
						disabled={isSubmitting}
						onclick={(e) => { if (!isSubmitting) triggerGleam('save'); }}
						class="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white rounded-lg transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
					>
						{#if gleamingItem === 'save'}
							<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-gleam"></div>
						{/if}
						<svg class="h-5 w-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
						<span class="relative z-10">{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
					</button>
				</div>
			</div>
		</div>
	</form>
</div>

<!-- Spacer to prevent content from being hidden behind sticky bar -->
<div class="h-12 md:h-16"></div>
