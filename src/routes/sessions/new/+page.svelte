<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import type { Coach, Drill, Slot } from '$lib/types/sessions';

	let { data } = $props<{ data: PageData }>();

	let sessionData = $state({
		date: '',
		time: '17:30',
		duration: 60,
		notes: ''
	});

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

	function removeCoachFromSlot(slotIndex: number, coachId: string) {
		slots[slotIndex].coaches = slots[slotIndex].coaches.filter((c) => c.id !== coachId);
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
			}> = [];
			
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

<div class="max-w-4xl">
	<div class="mb-6">
		<h1 class="text-4xl font-bold text-slate-900 mb-2">New Training Session</h1>
		<p class="text-lg text-slate-600">
			Plan your Under 6s training session
		</p>
	</div>

	{#if error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
			{error}
		</div>
	{/if}

	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
		<!-- Session Details -->
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h2 class="text-xl font-semibold text-slate-800 mb-4">Session Details</h2>
			
			<div class="grid md:grid-cols-2 gap-4 mb-4">
				<div>
					<label for="date" class="block text-sm font-semibold text-slate-700 mb-2">
						Date
					</label>
					<input
						type="date"
						id="date"
						bind:value={sessionData.date}
						required
						class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					/>
				</div>
				
				<div>
					<label for="time" class="block text-sm font-semibold text-slate-700 mb-2">
						Start Time
					</label>
					<input
						type="time"
						id="time"
						bind:value={sessionData.time}
						required
						class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					/>
				</div>
			</div>

			<div class="mb-4">
				<label for="notes" class="block text-sm font-semibold text-slate-700 mb-2">
					Session Notes
				</label>
				<textarea
					id="notes"
					bind:value={sessionData.notes}
					rows="3"
					placeholder="Any special notes or reminders for this session..."
					class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
				></textarea>
			</div>
		</div>

		<!-- Session Structure -->
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h2 class="text-xl font-semibold text-slate-800 mb-4">Session Structure (60 mins)</h2>
			
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
						<div class="grid md:grid-cols-2 gap-4">
							{#each data.drills as drill}
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
		<div class="fixed bottom-0 left-16 right-0 bg-slate-800 border-t border-slate-700 print:hidden z-40">
			<div class="px-4 py-4">
				<div class="flex items-center gap-2">
					<a
						href="/sessions"
						onclick={(e) => { triggerGleam('cancel'); }}
						class="inline-flex items-center gap-1.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium relative overflow-hidden"
					>
						{#if gleamingItem === 'cancel'}
							<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
						{/if}
						← Cancel
					</a>
					<div class="flex-1"></div>
					<button
						type="submit"
						disabled={isSubmitting}
						onclick={(e) => { if (!isSubmitting) triggerGleam('create'); }}
						class="inline-flex items-center gap-1.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 relative overflow-hidden"
					>
						{#if gleamingItem === 'create'}
							<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
						{/if}
						<svg class="h-4 w-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
						<span class="relative z-10">{isSubmitting ? 'Creating...' : 'Create Session'}</span>
					</button>
				</div>
			</div>
		</div>
	</form>
</div>

<!-- Spacer to prevent content from being hidden behind sticky bar -->
<div class="h-20 print:hidden"></div>
