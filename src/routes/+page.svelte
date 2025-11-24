<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="w-full">
	<!-- Hero Header -->
	<div class="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-2xl shadow-xl p-6 md:p-10 mb-6 md:mb-8">
		<div class="max-w-3xl">
			<h1 class="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
				Welcome{#if data.user}, {data.user.name}{/if}
			</h1>
			<p class="text-lg md:text-2xl text-white/90 font-medium mb-2">
				Graig Villa Dinos Under 6s
			</p>
			<p class="text-base md:text-lg text-white/80">
				Your complete coaching hub for managing training sessions and drills
			</p>
		</div>
	</div>
	
	<!-- Main Sessions Card -->
	<div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border-2 border-blue-200 p-6 md:p-8 mb-6 md:mb-8 hover:shadow-xl hover:border-blue-400 transition-all">
		<div class="flex items-start gap-4 md:gap-6 mb-4">
			<div class="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
				<svg class="h-7 w-7 md:h-9 md:w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			</div>
			<div class="flex-1">
				<h2 class="text-xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-3">Training Sessions</h2>
				<p class="text-sm md:text-base text-slate-700 leading-relaxed">
					Plan and manage your Tuesday evening training sessions. Create session plans, assign drills, 
					and coordinate with coaching staff all in one place.
				</p>
			</div>
		</div>
		<a 
			href="/sessions" 
			class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white font-bold py-3 px-6 rounded-xl transition-all text-sm md:text-base"
		>
			View Sessions
			<svg class="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</a>
	</div>

	<!-- Feature Cards Grid -->
	<div class="grid gap-4 md:gap-6 md:grid-cols-2 mb-6 md:mb-8">
		<div class="group bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md border-2 border-green-200 p-5 md:p-7 hover:shadow-xl hover:border-green-400 hover:-translate-y-1 transition-all">
			<div class="flex items-start gap-4 mb-4">
				<div class="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
					<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
				</div>
				<div class="flex-1">
					<h3 class="text-lg md:text-xl font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">Drill Library</h3>
					<p class="text-sm md:text-base text-slate-700 leading-relaxed">
						Access a comprehensive library of age-appropriate drills for Under 6s, covering warm-ups, 
						dribbling, shooting, and small-sided games.
					</p>
				</div>
			</div>
			<a href="/drills" class="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-bold text-sm md:text-base group-hover:gap-3 transition-all">
				Browse Drills
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</a>
		</div>
		
		<div class="group bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md border-2 border-purple-200 p-5 md:p-7 hover:shadow-xl hover:border-purple-400 hover:-translate-y-1 transition-all">
			<div class="flex items-start gap-4 mb-4">
				<div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
					<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
				</div>
				<div class="flex-1">
					<h3 class="text-lg md:text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">About GVD</h3>
					<p class="text-sm md:text-base text-slate-700 leading-relaxed">
						Learn more about Graig Villa Dinos and our coaching team dedicated to developing 
						young footballers.
					</p>
				</div>
			</div>
			<a href="/about" class="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold text-sm md:text-base group-hover:gap-3 transition-all">
				About Us
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</a>
		</div>
	</div>

	<!-- Quick Stats -->
	<div class="bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-md border-2 border-slate-200 p-6 md:p-8">
		<div class="flex items-center gap-3 mb-5 md:mb-6">
			<div class="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
				<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
				</svg>
			</div>
			<h3 class="text-lg md:text-xl font-bold text-slate-900">Quick Stats</h3>
		</div>
		<div class="grid grid-cols-3 gap-4 md:gap-6">
			<div class="text-center p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200">
				<div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2">60</div>
				<div class="text-xs md:text-sm font-semibold text-slate-700">Minutes per session</div>
			</div>
			<div class="text-center p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200">
				<div class="text-3xl md:text-4xl font-bold text-green-600 mb-2">U6</div>
				<div class="text-xs md:text-sm font-semibold text-slate-700">Age group</div>
			</div>
			<div class="text-center p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200">
				<div class="text-3xl md:text-4xl font-bold text-purple-600 mb-2">Tue</div>
				<div class="text-xs md:text-sm font-semibold text-slate-700">Training day</div>
			</div>
		</div>
	</div>
</div>
