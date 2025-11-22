<script lang="ts">
	import type { PageData } from './$types';
	import CalendarView from '$lib/components/CalendarView.svelte';
	
	let { data } = $props<{ data: PageData }>();
	let gleamingItem = $state<string | null>(null);

	function triggerGleam(item: string) {
		gleamingItem = item;
		setTimeout(() => {
			gleamingItem = null;
		}, 600);
	}
</script>

<div class="max-w-6xl">
	<div class="mb-4 md:mb-6">
		<h1 class="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Training Sessions</h1>
		<p class="text-base md:text-lg text-slate-600">
			Manage your Under 6s football training sessions
		</p>
	</div>

	<div class="grid lg:grid-cols-3 gap-4 md:gap-6">
		<!-- Left Column: Sessions List and Stats -->
		<div class="lg:col-span-2 space-y-4 md:space-y-6">
			<!-- Sessions List -->
			<div class="bg-white rounded-lg shadow">
				<div class="p-4 md:p-6">
					<h2 class="text-lg md:text-xl font-semibold text-slate-800 mb-4">All Sessions</h2>
					
					{#if data.user}
						<div class="space-y-4">
							{#if data.sessions && data.sessions.length > 0}
								{#each data.sessions as session}
									<div class="border border-slate-200 rounded-lg p-3 md:p-4 hover:border-blue-500 transition-colors">
										<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
											<div class="flex-1">
												<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
													<span class="text-base md:text-lg font-semibold text-slate-900">
														{new Date(session.session_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
													</span>
													<span class="text-sm text-slate-500">{session.start_time}</span>
												</div>
												<p class="text-sm md:text-base text-slate-600 mb-3">{session.duration} minutes</p>
												{#if session.notes}
													<p class="text-xs md:text-sm text-slate-600 mb-3">{session.notes}</p>
												{/if}
												<div class="flex gap-2 flex-wrap">
													<span class="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
														{session.slot_count} slots
													</span>
													<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
														{session.drills_assigned} drills assigned
													</span>
												</div>
											</div>
											<a
												href="/sessions/{session.id}"
												class="text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base self-start"
											>
												View →
											</a>
										</div>
									</div>
								{/each}
							{:else}
								<!-- Empty state -->
								<div class="text-center py-12 text-slate-500">
									<svg class="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									<p class="text-lg mb-2">No training sessions yet</p>
									<p class="text-sm mb-4">Create your first training session to get started</p>
									<a href="/sessions/new" class="text-blue-600 hover:text-blue-700 font-medium">
										Create Session →
									</a>
								</div>
							{/if}
						</div>
					{:else}
						<div class="text-center py-12">
							<p class="text-slate-600 mb-4">Please sign in to view training sessions</p>
							<a href="/login" class="text-blue-600 hover:text-blue-700 font-medium">
								Sign In →
							</a>
						</div>
					{/if}
				</div>
			</div>

			<!-- Quick Stats -->
			<div class="grid grid-cols-3 gap-3 md:gap-6">
				<div class="bg-white rounded-lg shadow p-3 md:p-6">
					<h3 class="text-xs md:text-sm font-semibold text-slate-600 mb-1 md:mb-2">Total Sessions</h3>
					<p class="text-xl md:text-3xl font-bold text-slate-900">{data.sessions?.length || 0}</p>
				</div>
				<div class="bg-white rounded-lg shadow p-3 md:p-6">
					<h3 class="text-xs md:text-sm font-semibold text-slate-600 mb-1 md:mb-2">Active Coaches</h3>
					<p class="text-xl md:text-3xl font-bold text-slate-900">1</p>
				</div>
				<div class="bg-white rounded-lg shadow p-3 md:p-6">
					<h3 class="text-xs md:text-sm font-semibold text-slate-600 mb-1 md:mb-2">Drill Library</h3>
					<p class="text-xl md:text-3xl font-bold text-slate-900">{data.drillCount || 0}</p>
				</div>
			</div>
		</div>

		<!-- Right Column: Calendar -->
		<div class="lg:col-span-1">
			{#if data.user && data.sessions && data.sessions.length > 0}
				<div class="bg-white rounded-lg shadow lg:sticky lg:top-6">
					<div class="p-4 md:p-6">
						<CalendarView 
							sessions={data.sessions}
						/>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Sticky Action Bar -->
<div class="fixed bottom-0 left-12 md:left-16 right-0 bg-slate-800 border-t border-slate-700 z-40">
	<div class="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
		<div class="flex items-center justify-end">
			<a
				href="/sessions/new"
				onclick={(e) => { triggerGleam('new'); }}
				class="inline-flex items-center gap-1.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium relative overflow-hidden"
			>
				{#if gleamingItem === 'new'}
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
				{/if}
				<svg class="h-4 w-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				<span class="relative z-10">New Session</span>
			</a>
		</div>
	</div>
</div>

<!-- Spacer to prevent content from being hidden behind sticky bar -->
<div class="h-20"></div>