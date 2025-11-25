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

	function triggerGleam(item: string) {
		gleamingItem = item;
		setTimeout(() => {
			gleamingItem = null;
		}, 600);
	}

	const badge = $derived(getCategoryBadge(data.drill.category));
</script>

<div class="w-full">
	<!-- Hero Header with Gradient -->
	<div class="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
		<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
			<div class="flex-1">
				<h1 class="text-3xl md:text-5xl font-bold mb-4">{data.drill.name}</h1>
				<div class="flex flex-wrap items-center gap-3">
					<span class="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-lg border border-white/30">
						{badge.label}
					</span>
					<div class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span class="text-sm font-medium">{data.drill.duration} minutes</span>
					</div>
					<div class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
						<span class="text-sm font-medium">{data.drill.min_players}-{data.drill.max_players} players</span>
					</div>
				</div>
			</div>
			<!-- Large category icon -->
			<div class="hidden md:flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30">
				<svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				</svg>
			</div>
		</div>
	</div>

	<div class="grid md:grid-cols-3 gap-6 mb-6">
		<!-- Main Content - 2 columns -->
		<div class="md:col-span-2 space-y-6">
			<!-- Description -->
			<div class="bg-white rounded-xl shadow-lg overflow-hidden">
				<div class="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-slate-200">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
							<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
						<h2 class="text-xl font-bold text-slate-800">Description</h2>
					</div>
				</div>
				<div class="p-6">
					<p class="text-slate-700 text-lg leading-relaxed whitespace-pre-line">
						{data.drill.description}
					</p>
				</div>
			</div>

			{#if data.drill.coaching_points}
				<!-- Coaching Points -->
				<div class="bg-white rounded-xl shadow-lg overflow-hidden">
					<div class="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-slate-200">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
								<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
								</svg>
							</div>
							<h2 class="text-xl font-bold text-slate-800">Coaching Points</h2>
						</div>
					</div>
					<div class="p-6">
						<p class="text-slate-700 text-lg leading-relaxed whitespace-pre-line">
							{data.drill.coaching_points}
						</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Sidebar - 1 column -->
		<div class="space-y-6">
			{#if data.drill.equipment}
				<!-- Equipment -->
				<div class="bg-white rounded-xl shadow-lg overflow-hidden">
					<div class="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-slate-200">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
								<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
								</svg>
							</div>
							<h2 class="text-lg font-bold text-slate-800">Equipment</h2>
						</div>
					</div>
					<div class="p-6">
						<p class="text-slate-700 leading-relaxed">
							{data.drill.equipment}
						</p>
					</div>
				</div>
			{/if}

			{#if data.drill.skill_focus}
				<!-- Skills Focus -->
				<div class="bg-white rounded-xl shadow-lg overflow-hidden">
					<div class="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-slate-200">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
								<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<h2 class="text-lg font-bold text-slate-800">Skills Focus</h2>
						</div>
					</div>
					<div class="p-6">
						<p class="text-slate-700 leading-relaxed">
							{data.drill.skill_focus}
						</p>
					</div>
				</div>
			{/if}

			<!-- Quick Stats Card -->
			<div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg p-6 border border-slate-200">
				<h3 class="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">Quick Stats</h3>
				<div class="space-y-3">
					<div class="flex items-center justify-between p-3 bg-white rounded-lg">
						<span class="text-sm text-slate-600">Duration</span>
						<span class="text-lg font-bold text-slate-900">{data.drill.duration} min</span>
					</div>
					<div class="flex items-center justify-between p-3 bg-white rounded-lg">
						<span class="text-sm text-slate-600">Min Players</span>
						<span class="text-lg font-bold text-slate-900">{data.drill.min_players}</span>
					</div>
					<div class="flex items-center justify-between p-3 bg-white rounded-lg">
						<span class="text-sm text-slate-600">Max Players</span>
						<span class="text-lg font-bold text-slate-900">{data.drill.max_players}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
