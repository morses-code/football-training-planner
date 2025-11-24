<script lang="ts">
	import type { PageData } from './$types';
	
	let { data } = $props<{ data: PageData }>();
	
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-GB', { 
			weekday: 'short', 
			day: 'numeric', 
			month: 'short',
			year: 'numeric'
		});
	}

	function getSlotTypeBadge(slotType: string) {
		const badges: Record<string, { label: string; color: string }> = {
			warmup: { label: 'Warm-up', color: 'bg-green-100 text-green-700' },
			drill: { label: 'Drill', color: 'bg-blue-100 text-blue-700' },
			small_sided: { label: 'Small Sided', color: 'bg-purple-100 text-purple-700' }
		};
		return badges[slotType] || { label: slotType, color: 'bg-slate-100 text-slate-700' };
	}

	function getRoleBadge(role: string) {
		const badges: Record<string, string> = {
			lead: 'bg-blue-100 text-blue-700',
			assistant: 'bg-slate-100 text-slate-700',
			observer: 'bg-yellow-100 text-yellow-700'
		};
		return badges[role] || 'bg-slate-100 text-slate-700';
	}
</script>

<div class="w-full">
	<div class="mb-4 md:mb-6">
		<h1 class="text-2xl md:text-4xl font-bold text-slate-900 mb-2">My Assignments</h1>
		<p class="text-base md:text-lg text-slate-600">
			Sessions and tasks assigned to you
		</p>
	</div>

	<div class="mb-16">
		{#if data.sessions && data.sessions.length > 0}
			<div class="space-y-4 md:space-y-6">
				{#each data.sessions as session}
					<div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
						<div class="p-4 md:p-6">
							<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
								<div class="flex-1">
									<div class="flex items-center gap-3 mb-2">
										<h3 class="text-lg md:text-xl font-semibold text-slate-900">
											Training Session
										</h3>
										<span class="text-sm md:text-base text-slate-500">
											{formatDate(session.date)}
										</span>
									</div>
									<div class="flex items-center gap-3 text-sm md:text-base text-slate-600">
										<span>⏰ {session.startTime}</span>
										<span>•</span>
										<span>{session.duration} minutes</span>
									</div>
									{#if session.notes}
										<p class="mt-2 text-sm md:text-base text-slate-600">{session.notes}</p>
									{/if}
								</div>
								<a
									href="/sessions/{session.id}"
									class="text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base whitespace-nowrap"
								>
									View Session →
								</a>
							</div>

							{#if session.slots && session.slots.length > 0}
								<div class="border-t border-slate-200 pt-4">
									<h4 class="text-sm font-semibold text-slate-700 mb-3">Your Assigned Tasks:</h4>
									<div class="space-y-2">
										{#each session.slots as slot}
											{@const slotBadge = getSlotTypeBadge(slot.type)}
											<div class="bg-slate-50 rounded-lg p-3">
												<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
													<div class="flex items-center gap-2 flex-wrap">
														{#if slot.type === 'setup'}
															<span class="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
																Pre-Session Setup
															</span>
															<span class="text-sm font-medium text-slate-900">Pitch Setup</span>
														{:else}
															<span class="px-2 py-1 text-xs font-medium rounded {slotBadge.color}">
																{slotBadge.label}
															</span>
															{#if slot.drillName}
																<span class="text-sm font-medium text-slate-900">{slot.drillName}</span>
															{:else}
																<span class="text-sm text-slate-500 italic">No drill assigned</span>
															{/if}
														{/if}
													</div>
													<div class="flex items-center gap-2">
														<span class="px-2 py-1 text-xs font-medium rounded {getRoleBadge(slot.role)}">
															{slot.role}
														</span>
														{#if slot.taskType}
															<span class="text-xs text-slate-600">• {slot.taskType}</span>
														{/if}
													</div>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="bg-white rounded-lg shadow p-8 md:p-12 text-center">
				<div class="text-4xl md:text-6xl mb-4">📋</div>
				<h3 class="text-lg md:text-xl font-semibold text-slate-900 mb-2">No Assignments Yet</h3>
				<p class="text-sm md:text-base text-slate-600">
					You haven't been assigned to any sessions yet. Check back later or contact the head coach.
				</p>
			</div>
		{/if}
	</div>
</div>

<!-- Bottom spacer -->
<div class="h-12 md:h-16"></div>
