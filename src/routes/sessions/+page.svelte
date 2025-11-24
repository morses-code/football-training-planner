<script lang="ts">
	import type { PageData } from './$types';
	import CalendarView from '$lib/components/CalendarView.svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import { invalidateAll } from '$app/navigation';
	
	let { data } = $props<{ data: PageData }>();
	
	let showDeleteModal = $state(false);
	let deleteSessionId = $state<number | null>(null);
	let deleteSessionDate = $state<string>('');
	
	function confirmDelete(sessionId: number, sessionDate: string) {
		deleteSessionId = sessionId;
		deleteSessionDate = new Date(sessionDate).toLocaleDateString('en-US', { 
			weekday: 'long', 
			month: 'short', 
			day: 'numeric' 
		});
		showDeleteModal = true;
	}
	
	async function handleDelete() {
		if (!deleteSessionId) return;
		
		try {
			const res = await fetch(`/api/sessions/${deleteSessionId}`, {
				method: 'DELETE'
			});
			
			if (res.ok) {
				await invalidateAll();
			} else {
				alert('Failed to delete session');
			}
		} catch (error) {
			console.error('Error deleting session:', error);
			alert('Failed to delete session');
		} finally {
			deleteSessionId = null;
			deleteSessionDate = '';
		}
	}
</script>

<div class="w-full">
	<!-- Hero Header with Gradient -->
	<div class="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl md:text-5xl font-bold mb-2">Training Sessions</h1>
				<p class="text-lg md:text-xl text-blue-100">
					Manage your Under 6s football training sessions
				</p>
			</div>
			<div class="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30">
				<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			</div>
		</div>
	</div>

	<div class="grid lg:grid-cols-3 gap-6">
		<!-- Left Column: Sessions List and Stats -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Quick Stats -->
			<div class="grid grid-cols-2 gap-4">
				<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-4 md:p-6 border border-blue-200">
					<div class="flex items-center gap-3 mb-2">
						<div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
							<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<h3 class="text-xs md:text-sm font-bold text-blue-900">Upcoming</h3>
					</div>
					<p class="text-2xl md:text-4xl font-bold text-blue-900">{data.sessions?.length || 0}</p>
				</div>
				<div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-4 md:p-6 border border-purple-200">
					<div class="flex items-center gap-3 mb-2">
						<div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
							<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<h3 class="text-xs md:text-sm font-bold text-purple-900">Completed</h3>
					</div>
					<p class="text-2xl md:text-4xl font-bold text-purple-900">{data.pastSessionsCount || 0}</p>
				</div>
			</div>

			<!-- Sessions List -->
			<div class="bg-white rounded-xl shadow-lg overflow-hidden">
				<div class="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
							<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
							</svg>
						</div>
						<h2 class="text-xl font-bold text-slate-800">All Sessions</h2>
					</div>
				</div>
				<div class="p-6">
					{#if data.user}
						<div class="space-y-4">
							{#if data.sessions && data.sessions.length > 0}
								<!-- Add New Session Card Template -->
								<a 
									href="/sessions/new"
									class="block bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg hover:from-blue-100 hover:to-purple-100 transition-all group"
								>
									<div class="flex items-center justify-center gap-4">
										<div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
											<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
											</svg>
										</div>
										<div class="text-center">
											<h3 class="text-xl font-bold text-slate-900 mb-1">Create New Session</h3>
											<p class="text-sm text-slate-600">Click to add a new training session</p>
										</div>
									</div>
								</a>
								{#each data.sessions as session}
									<div class="bg-gradient-to-r from-slate-50 to-white border-2 border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all">
										<div class="flex items-center gap-3 mb-2">
											<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
												{new Date(session.session_date).getDate()}
											</div>
											<div class="flex-1">
												<span class="block text-lg font-bold text-slate-900">
													{new Date(session.session_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
												</span>
												<div class="flex items-center gap-2 text-sm text-slate-600">
													<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
													<span>{session.start_time}</span>
													<span>•</span>
													<span>{session.duration} minutes</span>
												</div>
											</div>
										</div>
										{#if session.notes}
											<p class="text-sm text-slate-600 mb-3">{session.notes}</p>
										{/if}
										<div class="flex gap-2 flex-wrap mb-4">
											<span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200">
												{session.slot_count} slots
											</span>
											<span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
												{session.drills_assigned} drills
											</span>
										</div>
										<!-- Action Buttons -->
										<div class="flex flex-col gap-2">
											<a
												href="/sessions/{session.id}"
												class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-sm"
											>
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
												</svg>
												<span>View</span>
											</a>
											<a
												href="/sessions/{session.id}/edit"
												class="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-sm"
											>
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
												</svg>
												<span>Edit</span>
											</a>
											<button
												onclick={() => confirmDelete(session.id, session.session_date)}
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
							{:else}
								<!-- Empty state -->
								<div class="text-center py-16">
									<div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<svg class="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
									</div>
									<h3 class="text-xl font-bold text-slate-900 mb-2">No training sessions yet</h3>
									<p class="text-slate-600 mb-6">Create your first training session to get started</p>
									<a href="/sessions/new" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-colors">
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
										</svg>
										<span>Create Session</span>
									</a>
								</div>
							{/if}
						</div>
					{:else}
						<div class="text-center py-16">
							<div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg class="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
							</div>
							<p class="text-lg text-slate-700 mb-4">Please sign in to view training sessions</p>
							<a href="/login" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-colors">
								Sign In
							</a>
						</div>
			{/if}
		</div>
	</div>
</div>

<!-- Delete Confirmation Modal -->
<ConfirmModal
	bind:isOpen={showDeleteModal}
	title="Delete Session"
	message="Are you sure you want to delete the session on {deleteSessionDate}? This action cannot be undone."
	confirmText="Delete"
	cancelText="Cancel"
	danger={true}
	onConfirm={handleDelete}
/>
		<!-- Right Column: Calendar -->
		<div class="lg:col-span-1">
			{#if data.user}
				<div class="bg-white rounded-xl shadow-lg lg:sticky lg:top-6 overflow-hidden">
					<div class="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
								<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>
							<h2 class="text-lg font-bold text-slate-800">Calendar</h2>
						</div>
					</div>
					<div class="p-6">
						<CalendarView 
							sessions={data.sessions || []}
						/>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>