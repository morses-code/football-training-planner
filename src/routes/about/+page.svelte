<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<div class="max-w-4xl">
	<h1 class="text-2xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">About Graig Villa Dinos</h1>
	<p class="text-base md:text-lg text-slate-600 mb-4 md:mb-6">
		Under 6s Football Coaching Programme
	</p>

	<div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 md:p-6 mb-4 md:mb-6 border border-green-200">
		<h2 class="text-xl md:text-2xl font-semibold text-slate-800 mb-2 md:mb-3">⚽ Our Mission</h2>
		<p class="text-sm md:text-base text-slate-700 mb-3 md:mb-4">
			At Graig Villa Dinos (GVD), we're dedicated to developing young footballers through 
			fun, engaging, and age-appropriate training sessions. Our Under 6s programme focuses on 
			building fundamental skills, fostering teamwork, and instilling a love for the game.
		</p>
		<p class="text-sm md:text-base text-slate-700">
			We train every Tuesday evening, delivering structured 60-minute sessions that balance 
			skill development with enjoyment. This coaching hub helps our team plan sessions, 
			manage drills, and coordinate coaching assignments efficiently.
		</p>
	</div>

	<div class="bg-white rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
		<h2 class="text-xl md:text-2xl font-semibold text-slate-800 mb-3 md:mb-4">👥 Our Coaching Team</h2>
		<p class="text-sm md:text-base text-slate-600 mb-3 md:mb-4">
			Our registered coaches work together to deliver quality training sessions:
		</p>
		{#if data.coaches && data.coaches.length > 0}
			<div class="grid gap-3 md:gap-4 md:grid-cols-2">
				{#each data.coaches as coach}
					<div class="flex items-center gap-3 md:gap-4 bg-slate-50 rounded-lg p-3 md:p-4">
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

	<div class="grid gap-3 md:gap-4 md:grid-cols-2">
		<div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 md:p-6">
			<h3 class="text-lg md:text-xl font-semibold text-slate-800 mb-2 md:mb-3">📅 Training Details</h3>
			<ul class="text-sm md:text-base text-slate-700 space-y-1.5 md:space-y-2">
				<li><strong>Day:</strong> Tuesday Evenings</li>
				<li><strong>Time:</strong> 5:30 PM</li>
				<li><strong>Duration:</strong> 60 minutes</li>
				<li><strong>Age Group:</strong> Under 6s</li>
				<li><strong>Focus:</strong> Fun & Development</li>
			</ul>
		</div>
		<div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 md:p-6">
			<h3 class="text-lg md:text-xl font-semibold text-slate-800 mb-2 md:mb-3">🎯 Programme Goals</h3>
			<ul class="text-sm md:text-base text-slate-700 space-y-1.5 md:space-y-2">
				<li>• Develop basic ball skills</li>
				<li>• Build confidence & teamwork</li>
				<li>• Encourage active participation</li>
				<li>• Foster love for football</li>
				<li>• Create positive experiences</li>
			</ul>
		</div>
	</div>

	<div class="mt-4 md:mt-6 bg-slate-50 rounded-lg p-4 md:p-6">
		<h3 class="text-base md:text-lg font-semibold text-slate-800 mb-2">🚀 Future Plans</h3>
		<p class="text-sm md:text-base text-slate-700">
			While currently focused on our Under 6s programme, this coaching hub is designed to scale 
			across other age groups within Graig Villa Dinos. We aim to provide comprehensive training 
			management tools for all our youth teams as we continue to grow.
		</p>
	</div>
</div>
