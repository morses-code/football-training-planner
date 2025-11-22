<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let formData = $state({
		name: data.drill.name,
		description: data.drill.description,
		category: data.drill.category,
		duration: data.drill.duration,
		minPlayers: data.drill.min_players,
		maxPlayers: data.drill.max_players,
		equipment: data.drill.equipment || '',
		skillFocus: data.drill.skill_focus || '',
		coachingPoints: data.drill.coaching_points || ''
	});

	let isSubmitting = $state(false);
	let error = $state<string | null>(null);
	let gleamingItem = $state<string | null>(null);

	function triggerGleam(item: string) {
		gleamingItem = item;
		setTimeout(() => {
			gleamingItem = null;
		}, 600);
	}

	async function handleSubmit() {
		isSubmitting = true;
		error = null;

		try {
			const res = await fetch(`/api/drills/${data.drill.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formData.name,
					description: formData.description,
					category: formData.category,
					duration: formData.duration,
					minPlayers: formData.minPlayers,
					maxPlayers: formData.maxPlayers,
					equipment: formData.equipment,
					skillFocus: formData.skillFocus,
					coachingPoints: formData.coachingPoints
				})
			});

			const responseData = await res.json();

			if (!res.ok) {
				error = responseData.error || 'Failed to update drill';
				return;
			}

			await invalidateAll();
			goto(`/drills/${data.drill.id}`);
		} catch (e) {
			error = 'An error occurred. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="max-w-4xl">
	<div class="mb-6">
		<h1 class="text-4xl font-bold text-slate-900 mb-2">Edit Drill</h1>
		<p class="text-lg text-slate-600">
			Update drill information for your library
		</p>
	</div>

	{#if error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
			{error}
		</div>
	{/if}

	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
		<!-- Basic Information -->
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h2 class="text-xl font-semibold text-slate-800 mb-4">Basic Information</h2>
			
			<div class="mb-4">
				<label for="name" class="block text-sm font-semibold text-slate-700 mb-2">
					Drill Name
				</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					required
					class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
				/>
			</div>

			<div class="mb-4">
				<label for="category" class="block text-sm font-semibold text-slate-700 mb-2">
					Category
				</label>
				<select
					id="category"
					bind:value={formData.category}
					required
					class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
				>
					<option value="warmup">Warm-up</option>
					<option value="dribbling">Dribbling</option>
					<option value="shooting">Shooting</option>
					<option value="passing">Passing</option>
					<option value="small_sided">Small Sided</option>
					<option value="other">Other</option>
				</select>
			</div>

			<div class="grid md:grid-cols-3 gap-4 mb-4">
				<div>
					<label for="duration" class="block text-sm font-semibold text-slate-700 mb-2">
						Duration (mins)
					</label>
					<input
						type="number"
						id="duration"
						bind:value={formData.duration}
						min="1"
						max="60"
						required
						class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					/>
				</div>
				<div>
					<label for="minPlayers" class="block text-sm font-semibold text-slate-700 mb-2">
						Min Players
					</label>
					<input
						type="number"
						id="minPlayers"
						bind:value={formData.minPlayers}
						min="1"
						required
						class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					/>
				</div>
				<div>
					<label for="maxPlayers" class="block text-sm font-semibold text-slate-700 mb-2">
						Max Players
					</label>
					<input
						type="number"
						id="maxPlayers"
						bind:value={formData.maxPlayers}
						min="1"
						required
						class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					/>
				</div>
			</div>

			<div class="mb-4">
				<label for="description" class="block text-sm font-semibold text-slate-700 mb-2">
					Description
				</label>
				<textarea
					id="description"
					bind:value={formData.description}
					rows="4"
					required
					class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
				></textarea>
			</div>
		</div>

		<!-- Additional Details -->
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h2 class="text-xl font-semibold text-slate-800 mb-4">Additional Details</h2>

			<div class="mb-4">
				<label for="equipment" class="block text-sm font-semibold text-slate-700 mb-2">
					Equipment Needed
				</label>
				<textarea
					id="equipment"
					bind:value={formData.equipment}
					rows="2"
					placeholder="e.g., 10 cones, 4 footballs, 2 goals"
					class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
				></textarea>
			</div>

			<div class="mb-4">
				<label for="skillFocus" class="block text-sm font-semibold text-slate-700 mb-2">
					Skills Focus
				</label>
				<input
					type="text"
					id="skillFocus"
					bind:value={formData.skillFocus}
					placeholder="e.g., Ball control, Coordination, Dribbling"
					class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
				/>
			</div>

			<div class="mb-4">
				<label for="coachingPoints" class="block text-sm font-semibold text-slate-700 mb-2">
					Coaching Points
				</label>
				<textarea
					id="coachingPoints"
					bind:value={formData.coachingPoints}
					rows="4"
					placeholder="Key points to emphasize during the drill..."
					class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
				></textarea>
			</div>
		</div>
	</form>
</div>

<!-- Sticky Action Bar -->
<div class="fixed bottom-0 left-16 right-0 bg-slate-800 border-t border-slate-700 print:hidden z-40">
	<div class="px-4 py-4">
		<div class="flex items-center gap-2">
			<a
				href="/drills/{data.drill.id}"
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
				onclick={(e) => { if (!isSubmitting) triggerGleam('save'); handleSubmit(); }}
				class="inline-flex items-center gap-1.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 relative overflow-hidden"
			>
				{#if gleamingItem === 'save'}
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
				{/if}
				<svg class="h-4 w-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
				<span class="relative z-10">{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
			</button>
		</div>
	</div>
</div>

<!-- Spacer to prevent content from being hidden behind sticky bar -->
<div class="h-20 print:hidden"></div>
