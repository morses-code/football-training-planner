<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="w-full">
	<h1 class="text-2xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
		Welcome{#if data.user}, {data.user.name}{/if}
	</h1>
	<p class="text-base md:text-lg text-slate-600 mb-4 md:mb-6">
		Graig Villa Dinos Under 6s Coaching Hub
	</p>
	
	<div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 md:p-6 mb-4 md:mb-6 border border-green-200">
		<h2 class="text-xl md:text-2xl font-semibold text-slate-800 mb-2 md:mb-3">⚽ Training Sessions</h2>
		<p class="text-sm md:text-base text-slate-700 mb-3 md:mb-4">
			Plan and manage your Tuesday evening training sessions. Create session plans, assign drills, 
			and coordinate with coaching staff all in one place.
		</p>
		<a 
			href="/sessions" 
			class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm md:text-base"
		>
			View Sessions →
		</a>
	</div>

	<div class="grid gap-3 md:gap-4 md:grid-cols-2 mb-4 md:mb-6">
		<div class="bg-white rounded-lg shadow p-4 md:p-6">
			<h3 class="text-lg md:text-xl font-semibold text-slate-800 mb-2">📚 Drill Library</h3>
			<p class="text-sm md:text-base text-slate-600 mb-3 md:mb-4">
				Access a comprehensive library of age-appropriate drills for Under 6s, covering warm-ups, 
				dribbling, shooting, and small-sided games.
			</p>
			<a href="/drills" class="text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base">
				Browse Drills →
			</a>
		</div>
		<div class="bg-white rounded-lg shadow p-4 md:p-6">
			<h3 class="text-lg md:text-xl font-semibold text-slate-800 mb-2">👥 About GVD</h3>
			<p class="text-sm md:text-base text-slate-600 mb-3 md:mb-4">
				Learn more about Graig Villa Dinos and our coaching team dedicated to developing 
				young footballers.
			</p>
			<a href="/about" class="text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base">
				About Us →
			</a>
		</div>
	</div>

	<div class="bg-slate-50 rounded-lg p-4 md:p-6">
		<h3 class="text-base md:text-lg font-semibold text-slate-800 mb-3 md:mb-4">Quick Stats</h3>
		<div class="grid grid-cols-3 gap-3 md:gap-4 text-center">
			<div>
				<div class="text-2xl md:text-3xl font-bold text-blue-600">60</div>
				<div class="text-xs md:text-sm text-slate-600">Minutes per session</div>
			</div>
			<div>
				<div class="text-2xl md:text-3xl font-bold text-green-600">U6</div>
				<div class="text-xs md:text-sm text-slate-600">Age group</div>
			</div>
			<div>
				<div class="text-2xl md:text-3xl font-bold text-purple-600">Tue</div>
				<div class="text-xs md:text-sm text-slate-600">Training day</div>
			</div>
		</div>
	</div>
</div>
