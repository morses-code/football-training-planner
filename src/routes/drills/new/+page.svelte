<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';

	let formData = $state({
		name: '',
		description: '',
		duration: 10,
		category: 'warmup',
		skillFocus: '',
		equipment: '',
		instructions: '',
		minPlayers: 4,
		maxPlayers: 12
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

	const categories = [
		{ value: 'warmup', label: 'Warm-up' },
		{ value: 'dribbling', label: 'Dribbling' },
		{ value: 'shooting', label: 'Shooting' },
		{ value: 'passing', label: 'Passing' },
		{ value: 'small_sided', label: 'Small Sided Game' },
		{ value: 'other', label: 'Other' }
	];

	async function handleSubmit() {
		isSubmitting = true;
		error = null;

		try {
			const res = await fetch('/api/drills', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

			const data = await res.json();

			if (!res.ok) {
				error = data.error || 'Failed to create drill';
				return;
			}

			await invalidateAll();
			goto('/drills');
		} catch (e) {
			error = 'An error occurred. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="w-full">
	<div class="mb-6">
		<h1 class="text-4xl font-bold text-slate-900 mb-2">Add New Drill</h1>
		<p class="text-lg text-slate-600">
			Create a training drill for your Under 6s sessions
		</p>
	</div>

	{#if error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
			{error}
		</div>
	{/if}

	<form id="drill-form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
		<!-- Basic Information -->
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h2 class="text-xl font-semibold text-slate-800 mb-4">Basic Information</h2>

			<div class="mb-4">
				<label for="name" class="block text-sm font-semibold text-slate-700 mb-2">
					Drill Name *
				</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					required
					placeholder="e.g., Coach Says"
					class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
				/>
			</div>

			<div class="mb-4">
				<label for="description" class="block text-sm font-semibold text-slate-700 mb-2">
					Description *
				</label>
				<textarea
					id="description"
					bind:value={formData.description}
					required
					rows="3"
					placeholder="Brief description of the drill and its objectives..."
					class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
				></textarea>
			</div>

			<div class="grid md:grid-cols-2 gap-4">
				<div>
					<label for="category" class="block text-sm font-semibold text-slate-700 mb-2">
						Category *
					</label>
					<select
						id="category"
						bind:value={formData.category}
						required
						class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					>
						{#each categories as category}
							<option value={category.value}>{category.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="duration" class="block text-sm font-semibold text-slate-700 mb-2">
						Duration (minutes) *
					</label>
					<input
						type="number"
						id="duration"
						bind:value={formData.duration}
						required
						min="5"
						max="30"
						class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					/>
				</div>
			</div>
		</div>

		<!-- Details -->
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h2 class="text-xl font-semibold text-slate-800 mb-4">Details</h2>

			<div class="mb-4">
				<label for="skillFocus" class="block text-sm font-semibold text-slate-700 mb-2">
					Skill Focus
				</label>
				<input
					type="text"
					id="skillFocus"
					bind:value={formData.skillFocus}
					placeholder="e.g., Dribbling, Listening, Ball Control"
					class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
				/>
			</div>

			<div class="mb-4">
				<label for="equipment" class="block text-sm font-semibold text-slate-700 mb-2">
					Equipment Needed
				</label>
				<input
					type="text"
					id="equipment"
					bind:value={formData.equipment}
					placeholder="e.g., Cones, Balls, Bibs"
					class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
				/>
			</div>

			<div class="mb-4">
				<label for="instructions" class="block text-sm font-semibold text-slate-700 mb-2">
					Instructions
				</label>
				<textarea
					id="instructions"
					bind:value={formData.instructions}
					rows="5"
					placeholder="Step-by-step instructions for setting up and running the drill..."
					class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
				></textarea>
			</div>

			<div class="grid md:grid-cols-2 gap-4">
				<div>
					<label for="minPlayers" class="block text-sm font-semibold text-slate-700 mb-2">
						Minimum Players *
					</label>
					<input
						type="number"
						id="minPlayers"
						bind:value={formData.minPlayers}
						required
						min="1"
						max="20"
						class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					/>
				</div>

				<div>
					<label for="maxPlayers" class="block text-sm font-semibold text-slate-700 mb-2">
						Maximum Players *
					</label>
					<input
						type="number"
						id="maxPlayers"
						bind:value={formData.maxPlayers}
						required
						min="1"
						max="20"
						class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					/>
				</div>
			</div>
		</div>
	</form>
</div>

<!-- Bottom Action Bar -->
<div class="h-12 md:h-16"></div>
<div class="fixed bottom-0 left-12 md:left-16 right-0 bg-white border-t border-slate-200 shadow-lg z-40">
	<div class="px-3 md:px-4 py-2 md:py-3">
		<div class="flex items-center gap-2">
			<a
				href="/drills"
				onclick={(e) => { triggerGleam('cancel'); }}
				class="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium relative overflow-hidden"
			>
				{#if gleamingItem === 'cancel'}
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
				{/if}
				← Cancel
			</a>
			<div class="flex-1"></div>
			<button
				type="submit"
				form="drill-form"
				disabled={isSubmitting}
				onclick={(e) => { if (!isSubmitting) triggerGleam('create'); }}
				class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
			>
				{#if gleamingItem === 'create'}
					<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gleam"></div>
				{/if}
				<svg class="h-4 w-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				<span class="relative z-10">{isSubmitting ? 'Creating...' : 'Create Drill'}</span>
			</button>
		</div>
	</div>
</div>

