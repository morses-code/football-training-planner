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

<div class="max-w-4xl">
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

	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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

		<!-- Actions -->
		<div class="flex gap-3">
			<button
				type="submit"
				disabled={isSubmitting}
				class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
			>
				{isSubmitting ? 'Creating...' : 'Create Drill'}
			</button>
			<a
				href="/drills"
				class="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-colors text-center"
			>
				Cancel
			</a>
		</div>
	</form>
</div>
