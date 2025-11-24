<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';

	let formData = $state({
		email: '',
		password: '',
		name: '',
		avatar: 'user'
	});

	let error = $state('');
	let isSubmitting = $state(false);

	const avatars = [
		{ name: 'user', path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
		{ name: 'star', path: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
		{ name: 'lightning', path: 'M13 10V3L4 14h7v7l9-11h-7z' },
		{ name: 'fire', path: 'M12 2c1.646 0 3.226.444 4.565 1.283a9 9 0 013.152 3.152A8.955 8.955 0 0121 11c0 2.6-1.6 4.9-3.9 6.4-.6.4-1.3.7-2 .9-.4.1-.8.2-1.2.2-.2 0-.4 0-.6-.1-.4-.1-.7-.2-1-.4-.5-.3-.9-.7-1.2-1.2-.3-.5-.5-1-.5-1.6 0-.5.1-1 .4-1.5.3-.5.7-.9 1.2-1.2.5-.3 1-.5 1.6-.5.3 0 .6.1.9.2.3.1.5.3.7.5.2.2.4.5.5.7.1.3.2.6.2.9 0 .2 0 .4-.1.6-.1.2-.2.4-.3.5-.2.2-.4.3-.6.4-.2.1-.5.1-.7.1-.2 0-.4 0-.6-.1-.2-.1-.3-.2-.5-.3-.1-.1-.2-.3-.3-.5-.1-.2-.1-.4-.1-.6 0-.4.2-.8.5-1 .3-.2.7-.4 1.1-.4.5 0 .9.2 1.3.5s.5.8.5 1.3c0 .4-.1.7-.3 1-.2.3-.5.6-.8.8-.3.2-.7.3-1.1.3-.5 0-1-.2-1.4-.5-.4-.3-.7-.8-.9-1.3-.2-.5-.3-1.1-.3-1.7 0-.8.2-1.5.6-2.2.4-.6 1-1.2 1.7-1.6.7-.4 1.5-.6 2.3-.6 1 0 1.9.3 2.7.9.8.6 1.4 1.4 1.8 2.3.4.9.6 1.9.6 2.9 0 1.3-.3 2.6-1 3.7-.6 1.1-1.5 2-2.6 2.6-1.1.6-2.3 1-3.6 1-1.1 0-2.2-.3-3.2-.8-1-.5-1.8-1.3-2.4-2.2-.6-.9-.9-2-.9-3.1 0-1 .2-1.9.7-2.8.5-.9 1.1-1.6 1.9-2.2C10.1 2.3 11 2 12 2z' },
		{ name: 'heart', path: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
		{ name: 'trophy', path: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
		{ name: 'rocket', path: 'M11.5 2.75a.75.75 0 01.75-.75h4.5a.75.75 0 01.53 1.28l-1.5 1.5 1.5 1.5a.75.75 0 01-.53 1.28h-4.5a.75.75 0 01-.75-.75v-4.5zm-2.5 17a.75.75 0 01.75-.75h6.5a.75.75 0 01.53 1.28l-1.5 1.5 1.5 1.5a.75.75 0 01-.53 1.28h-6.5a.75.75 0 01-.75-.75v-4.5zM20.314 11.954l-3.182-3.182a.75.75 0 010-1.06l1.06-1.061a.75.75 0 011.061 0l3.182 3.182a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 01-1.061 0z' },
		{ name: 'shield', path: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
		{ name: 'academic', path: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l-9-5v7a2 2 0 002 2h14a2 2 0 002-2v-7l-9 5z' },
		{ name: 'chart', path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
		{ name: 'flag', path: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' },
		{ name: 'puzzle', path: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' }
	];

	async function handleSubmit() {
		error = '';
		isSubmitting = true;

		try {
			const res = await fetch('/api/admin/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

			const data = await res.json();

			if (res.ok) {
				await invalidateAll();
				goto('/admin/users');
			} else {
				error = data.error || 'Failed to create user';
			}
		} catch (err) {
			error = 'An error occurred. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="w-full">
	<!-- Hero Header -->
	<div class="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl md:text-5xl font-bold mb-2">Create User</h1>
				<p class="text-lg md:text-xl text-purple-100">
					Add a new coach to the system
				</p>
			</div>
			<div class="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30">
				<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
				</svg>
			</div>
		</div>
	</div>

	<!-- Form -->
	<div class="bg-white rounded-xl shadow-lg border-2 border-slate-200 p-6">
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
			{#if error}
				<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
					{error}
				</div>
			{/if}

			<div class="space-y-4">
				<!-- Email -->
				<div>
					<label for="email" class="block text-sm font-semibold text-slate-700 mb-2">
						Email Address
					</label>
					<input
						id="email"
						type="email"
						bind:value={formData.email}
						required
						class="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
						placeholder="coach@example.com"
					/>
				</div>

				<!-- Password -->
				<div>
					<label for="password" class="block text-sm font-semibold text-slate-700 mb-2">
						Password
					</label>
					<input
						id="password"
						type="password"
						bind:value={formData.password}
						required
						minlength="6"
						class="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
						placeholder="Minimum 6 characters"
					/>
				</div>

				<!-- Name -->
				<div>
					<label for="name" class="block text-sm font-semibold text-slate-700 mb-2">
						Full Name
					</label>
					<input
						id="name"
						type="text"
						bind:value={formData.name}
						required
						class="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
						placeholder="John Smith"
					/>
				</div>

				<!-- Avatar Selection -->
				<div>
					<label class="block text-sm font-semibold text-slate-700 mb-2">
						Choose Avatar Icon
					</label>
					<div class="grid grid-cols-4 gap-2">
						{#each avatars as avatar}
							<button
								type="button"
								onclick={() => formData.avatar = avatar.name}
								class="aspect-square p-3 flex items-center justify-center rounded-lg border-2 transition-all hover:scale-105"
								class:border-purple-500={formData.avatar === avatar.name}
								class:bg-purple-50={formData.avatar === avatar.name}
								class:border-slate-300={formData.avatar !== avatar.name}
								class:bg-slate-50={formData.avatar !== avatar.name}
							>
								<svg class="h-8 w-8" class:text-purple-600={formData.avatar === avatar.name} class:text-slate-600={formData.avatar !== avatar.name} fill="currentColor" viewBox="0 0 24 24">
									<path d={avatar.path} />
								</svg>
							</button>
						{/each}
					</div>
				</div>
			</div>

			<!-- Form Actions -->
			<div class="flex gap-3 justify-end pt-6">
				<a
					href="/admin/users"
					class="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors"
				>
					Cancel
				</a>
				<button
					type="submit"
					disabled={isSubmitting}
					class="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isSubmitting ? 'Creating...' : 'Create User'}
				</button>
			</div>
		</form>
	</div>
</div>
