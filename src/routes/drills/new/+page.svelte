<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import PageHeader from '$lib/components/PageHeader.svelte';

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

<div class="w-full">
	<!-- Hero Header -->
	<PageHeader 
		title="Add New Drill"
		subtitle="Create a training drill for your Under 6s sessions"
		gradientFrom="green-600"
		gradientTo="emerald-600"
	>
		{#snippet icon()}
			<svg class="h-12 w-12 md:h-16 md:w-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
			</svg>
		{/snippet}
	</PageHeader>

	{#if error}
		<div class="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
			<svg class="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{error}</span>
		</div>
	{/if}

	<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
		<!-- Basic Information -->
		<div class="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-md border-2 border-slate-200 p-6 mb-6">
			<div class="flex items-center gap-3 mb-6">
				<div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
					<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h2 class="text-xl font-bold text-slate-900">Basic Information</h2>
			</div>

			<div class="mb-4">
				<label for="name" class="block text-sm font-bold text-slate-700 mb-2">
					Drill Name *
				</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					required
					placeholder="e.g., Coach Says"
					class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
				/>
			</div>

			<div class="mb-4">
				<label for="description" class="block text-sm font-bold text-slate-700 mb-2">
					Description *
				</label>
				<textarea
					id="description"
					bind:value={formData.description}
					required
					rows="3"
					placeholder="Brief description of the drill and its objectives..."
					class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
				></textarea>
			</div>

			<div class="grid md:grid-cols-2 gap-4">
				<div>
					<label for="category" class="block text-sm font-bold text-slate-700 mb-2">
						Category *
					</label>
					<select
						id="category"
						bind:value={formData.category}
						required
						class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
					>
						{#each categories as category}
							<option value={category.value}>{category.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="duration" class="block text-sm font-bold text-slate-700 mb-2">
						Duration (minutes) *
					</label>
					<input
						type="number"
						id="duration"
						bind:value={formData.duration}
						required
						min="5"
						max="30"
						class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
					/>
				</div>
			</div>
		</div>

		<!-- Details -->
		<div class="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-md border-2 border-slate-200 p-6 mb-6">
			<div class="flex items-center gap-3 mb-6">
				<div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
					<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
				</div>
				<h2 class="text-xl font-bold text-slate-900">Details</h2>
			</div>

			<div class="mb-4">
				<label for="skillFocus" class="block text-sm font-bold text-slate-700 mb-2">
					Skill Focus
				</label>
				<input
					type="text"
					id="skillFocus"
					bind:value={formData.skillFocus}
					placeholder="e.g., Dribbling, Listening, Ball Control"
					class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
				/>
			</div>

			<div class="mb-4">
				<label for="equipment" class="block text-sm font-bold text-slate-700 mb-2">
					Equipment Needed
				</label>
				<input
					type="text"
					id="equipment"
					bind:value={formData.equipment}
					placeholder="e.g., Cones, Balls, Bibs"
					class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
				/>
			</div>

			<div class="mb-4">
				<label for="instructions" class="block text-sm font-bold text-slate-700 mb-2">
					Instructions
				</label>
				<textarea
					id="instructions"
					bind:value={formData.instructions}
					rows="5"
					placeholder="Step-by-step instructions for setting up and running the drill..."
					class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
				></textarea>
			</div>

			<div class="grid md:grid-cols-2 gap-4">
				<div>
					<label for="minPlayers" class="block text-sm font-bold text-slate-700 mb-2">
						Minimum Players *
					</label>
					<input
						type="number"
						id="minPlayers"
						bind:value={formData.minPlayers}
						required
						min="1"
						max="20"
						class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
					/>
				</div>

				<div>
					<label for="maxPlayers" class="block text-sm font-bold text-slate-700 mb-2">
						Maximum Players *
					</label>
					<input
						type="number"
						id="maxPlayers"
						bind:value={formData.maxPlayers}
						required
						min="1"
						max="20"
						class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
					/>
				</div>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="flex items-center justify-end gap-3 pt-6">
			<a
				href="/drills"
				class="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all font-semibold cursor-pointer"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
				<span>Cancel</span>
			</a>
			<button
				type="submit"
				disabled={isSubmitting}
				class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg text-white rounded-lg transition-all font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
				<span>{isSubmitting ? 'Creating...' : 'Create Drill'}</span>
			</button>
		</div>
	</form>
</div>