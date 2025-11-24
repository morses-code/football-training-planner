<script lang="ts">
	import type { PageData } from './$types';
	import PageHeader from '$lib/components/PageHeader.svelte';

	let { data } = $props<{ data: PageData }>();
</script>

<div class="w-full">
	<PageHeader 
		title="About Graig Villa Dinos"
		subtitle="Under 6s Football Coaching Programme"
		gradientFrom="green-600"
		gradientTo="emerald-600"
	>
		{#snippet icon()}
			<svg class="h-12 w-12 md:h-16 md:w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		{/snippet}
	</PageHeader>

	<div class="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border-2 border-green-200 p-6 md:p-8 mb-6">
		<div class="flex items-start gap-4 md:gap-6 mb-4">
			<div class="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
				<svg class="h-7 w-7 md:h-9 md:w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
				</svg>
			</div>
			<div class="flex-1">
				<h2 class="text-xl md:text-3xl font-bold text-slate-900 mb-3">Our Mission</h2>
				<p class="text-sm md:text-base text-slate-700 leading-relaxed mb-3">
					At Graig Villa Dinos (GVD), we're dedicated to developing young footballers through 
					fun, engaging, and age-appropriate training sessions. Our Under 6s programme focuses on 
					building fundamental skills, fostering teamwork, and instilling a love for the game.
				</p>
				<p class="text-sm md:text-base text-slate-700 leading-relaxed">
					We train every Tuesday evening, delivering structured 60-minute sessions that balance 
					skill development with enjoyment. This coaching hub helps our team plan sessions, 
					manage drills, and coordinate coaching assignments efficiently.
				</p>
			</div>
		</div>
	</div>

	<div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border-2 border-blue-200 p-6 md:p-8 mb-6">
		<div class="flex items-start gap-4 md:gap-6 mb-4">
			<div class="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
				<svg class="h-7 w-7 md:h-9 md:w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
			</div>
			<div class="flex-1">
				<h2 class="text-xl md:text-3xl font-bold text-slate-900 mb-4">Our Coaching Team</h2>
				<p class="text-sm md:text-base text-slate-600 mb-4">
					Our registered coaches work together to deliver quality training sessions:
				</p>
				{#if data.coaches && data.coaches.length > 0}
					<div class="grid gap-3 md:gap-4 md:grid-cols-2">
						{#each data.coaches as coach}
							<div class="flex items-center gap-3 md:gap-4 bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-xl p-3 md:p-4 hover:shadow-md transition-all">
								<div class="w-10 h-10 md:w-12 md:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-base md:text-lg shrink-0">
									{coach.name.charAt(0).toUpperCase()}
								</div>
								<div class="min-w-0">
									<div class="font-semibold text-slate-900 text-sm md:text-base">{coach.name}</div>
									<div class="text-xs md:text-sm text-slate-600 truncate">{coach.email}</div>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-sm md:text-base text-slate-500">No coaches registered yet.</p>
				{/if}
			</div>
		</div>
	</div>

	<div class="grid gap-4 md:gap-6 md:grid-cols-2 mb-6">
		<div class="group bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-md border-2 border-indigo-200 p-5 md:p-7 hover:shadow-xl hover:border-indigo-400 hover:-translate-y-1 transition-all">
			<div class="flex items-start gap-4 mb-4">
				<div class="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
					<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				</div>
				<div class="flex-1">
					<h3 class="text-lg md:text-xl font-bold text-slate-900 mb-2">Training Details</h3>
					<ul class="text-sm md:text-base text-slate-700 space-y-1.5 md:space-y-2">
						<li><strong>Day:</strong> Tuesday Evenings</li>
						<li><strong>Time:</strong> 5:30 PM</li>
						<li><strong>Duration:</strong> 60 minutes</li>
						<li><strong>Age Group:</strong> Under 6s</li>
						<li><strong>Focus:</strong> Fun & Development</li>
					</ul>
				</div>
			</div>
		</div>
		
		<div class="group bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md border-2 border-purple-200 p-5 md:p-7 hover:shadow-xl hover:border-purple-400 hover:-translate-y-1 transition-all">
			<div class="flex items-start gap-4 mb-4">
				<div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
					<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
					</svg>
				</div>
				<div class="flex-1">
					<h3 class="text-lg md:text-xl font-bold text-slate-900 mb-2">Programme Goals</h3>
					<ul class="text-sm md:text-base text-slate-700 space-y-1.5 md:space-y-2">
						<li>• Develop basic ball skills</li>
						<li>• Build confidence & teamwork</li>
						<li>• Encourage active participation</li>
						<li>• Foster love for football</li>
						<li>• Create positive experiences</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-md border-2 border-slate-200 p-6 md:p-8">
		<div class="flex items-start gap-4 md:gap-6">
			<div class="w-12 h-12 md:w-14 md:h-14 bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
				<svg class="h-6 w-6 md:h-7 md:w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			</div>
			<div class="flex-1">
				<h3 class="text-lg md:text-xl font-bold text-slate-900 mb-3">Future Plans</h3>
				<p class="text-sm md:text-base text-slate-700 leading-relaxed">
					While currently focused on our Under 6s programme, this coaching hub is designed to scale 
					across other age groups within Graig Villa Dinos. We aim to provide comprehensive training 
					management tools for all our youth teams as we continue to grow.
				</p>
			</div>
		</div>
	</div>
</div>
