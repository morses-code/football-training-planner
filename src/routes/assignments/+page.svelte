<script lang="ts">
	import type { PageData } from './$types';
	import PageHeader from '$lib/components/PageHeader.svelte';
	
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
	<!-- Hero Header -->
	<PageHeader 
		title="My Assignments"
		subtitle="Sessions and tasks assigned to you"
		gradientFrom="orange-600"
		gradientTo="amber-600"
	>
		{#snippet icon()}
			<svg class="h-12 w-12 md:h-16 md:w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
			</svg>
		{/snippet}
	</PageHeader>

	<div class="mb-16">
		{#if data.sessions && data.sessions.length > 0}
			<div class="space-y-4 md:space-y-6">
				{#each data.sessions as session}
					<div class="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-md border-2 border-slate-200 hover:shadow-xl hover:border-orange-400 transition-all">
						<div class="p-4 md:p-6">
							<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
								<div class="flex-1">
									<div class="mb-3">
										<h3 class="text-lg md:text-xl font-bold text-slate-900 mb-1">
											Training Session
										</h3>
										<div class="text-sm md:text-base font-semibold text-orange-600">
											{formatDate(session.date)}
										</div>
									</div>
									<div class="flex items-center gap-4 mb-3">
										<div class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
											<svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											<span class="text-xs font-semibold text-blue-900">{session.startTime}</span>
										</div>
										<div class="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
											<svg class="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
											</svg>
											<span class="text-xs font-semibold text-purple-900">{session.duration} mins</span>
										</div>
									</div>
									{#if session.notes}
										<p class="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">{session.notes}</p>
									{/if}
								</div>
								<a
									href="/sessions/{session.id}"
									class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm md:text-base whitespace-nowrap self-start"
								>
									View Session
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
									</svg>
								</a>
							</div>

							{#if session.slots && session.slots.length > 0}
								<div class="border-t-2 border-slate-200 pt-4">
									<div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg px-4 py-3 mb-3">
										<h4 class="text-sm md:text-base font-bold text-slate-900">Your Assigned Tasks</h4>
									</div>
									<div class="space-y-2">
										{#each session.slots as slot}
											{@const slotBadge = getSlotTypeBadge(slot.type)}
											<div class="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-lg p-3 hover:border-orange-300 transition-colors">
												<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
													<div class="flex-1">
														{#if slot.type === 'setup'}
															<div class="text-xs font-semibold text-orange-600 mb-1">Pre-Session Setup</div>
															<div class="text-sm md:text-base font-medium text-slate-900">Pitch Setup</div>
														{:else}
															<div class="text-xs font-semibold {slotBadge.color.replace('bg-', 'text-').replace('-100', '-600')} mb-1">{slotBadge.label}</div>
															{#if slot.drillName}
																<div class="text-sm md:text-base font-medium text-slate-900">{slot.drillName}</div>
															{:else}
																<div class="text-sm md:text-base text-slate-500 italic">No drill assigned</div>
															{/if}
														{/if}
													</div>
													<div class="flex items-center gap-2 flex-shrink-0">
														<span class="px-3 py-1 text-xs font-bold rounded-lg {getRoleBadge(slot.role)}">
															{slot.role.toUpperCase()}
														</span>
														{#if slot.taskType}
															<span class="text-xs text-slate-600 font-medium">• {slot.taskType}</span>
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
			<div class="text-center py-16 bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-sm border-2 border-slate-200">
				<div class="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="h-10 w-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
					</svg>
				</div>
				<h3 class="text-lg md:text-xl font-bold text-slate-900 mb-2">No Assignments Yet</h3>
				<p class="text-sm md:text-base text-slate-600 mb-6 max-w-md mx-auto">
					You haven't been assigned to any sessions yet. Check back later or contact the head coach.
				</p>
				<a href="/sessions" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
					View All Sessions
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</a>
			</div>
		{/if}
	</div>
</div>

<!-- Bottom spacer -->
<div class="h-12 md:h-16"></div>
