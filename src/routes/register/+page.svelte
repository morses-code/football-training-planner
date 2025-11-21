<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import NavIcon from '$lib/components/NavIcon.svelte';

	let formData = $state({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		avatar: 'user-circle'
	});

	let showBanner = $state(false);
	let errorMessage = $state('');
	let isSubmitting = $state(false);

	const avatarOptions = [
		{ id: 'user-circle', name: 'Default User', path: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
		{ id: 'star', name: 'Star', path: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
		{ id: 'heart', name: 'Heart', path: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
		{ id: 'lightning', name: 'Lightning', path: 'M13 10V3L4 14h7v7l9-11h-7z' },
		{ id: 'fire', name: 'Fire', path: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
		{ id: 'moon', name: 'Moon', path: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
		{ id: 'sun', name: 'Sun', path: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
		{ id: 'music', name: 'Music', path: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' }
	];

	function handleSubmit(event: Event) {
		event.preventDefault();
		errorMessage = '';

		// Validate passwords match
		if (formData.password !== formData.confirmPassword) {
			errorMessage = 'Passwords do not match';
			return;
		}

		isSubmitting = true;

		fetch('/api/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData)
		})
			.then((res) => res.json())
			.then(async (data) => {
				if (data.error) {
					errorMessage = data.error;
					isSubmitting = false;
				} else {
					showBanner = true;
					// Invalidate all data to refresh user state
					await invalidateAll();
					setTimeout(() => {
						goto('/');
					}, 1500);
				}
			})
			.catch(() => {
				errorMessage = 'Something went wrong. Please try again.';
				isSubmitting = false;
			});
	}
</script>

<div class="max-w-4xl">
	<h1 class="text-4xl font-bold text-slate-900 mb-4">Create Account</h1>
	<p class="text-lg text-slate-600 mb-6">
		Join us today! Just a few details to get started.
	</p>

	<div class="max-w-2xl">
		<form onsubmit={handleSubmit} class="bg-white rounded-lg shadow p-6">
			{#if errorMessage}
				<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
					<p class="text-red-700 text-sm">{errorMessage}</p>
				</div>
			{/if}

			<div class="flex flex-col mb-6">
				<label for="name" class="text-sm font-semibold text-slate-700 mb-2">
					Name <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					required
					class="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					placeholder="John Doe"
				/>
			</div>

			<div class="flex flex-col mb-6">
				<label for="email" class="text-sm font-semibold text-slate-700 mb-2">
					Email <span class="text-red-500">*</span>
				</label>
				<input
					type="email"
					id="email"
					bind:value={formData.email}
					required
					class="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					placeholder="john@example.com"
				/>
			</div>

			<div class="flex flex-col mb-6">
				<label for="password" class="text-sm font-semibold text-slate-700 mb-2">
					Password <span class="text-red-500">*</span>
				</label>
				<input
					type="password"
					id="password"
					bind:value={formData.password}
					required
					minlength="6"
					class="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					placeholder="At least 6 characters"
				/>
			</div>

			<div class="flex flex-col mb-6">
				<label for="confirmPassword" class="text-sm font-semibold text-slate-700 mb-2">
					Confirm Password <span class="text-red-500">*</span>
				</label>
				<input
					type="password"
					id="confirmPassword"
					bind:value={formData.confirmPassword}
					required
					minlength="6"
					class="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					placeholder="Re-enter your password"
				/>
			</div>

			<div class="flex flex-col mb-6">
				<p class="text-sm font-semibold text-slate-700 mb-3">
					Choose your avatar
				</p>
				<div class="grid grid-cols-4 gap-3">
					{#each avatarOptions as avatar}
						<button
							type="button"
							onclick={() => (formData.avatar = avatar.id)}
							class="flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 hover:bg-slate-50"
							class:border-blue-500={formData.avatar === avatar.id}
							class:bg-blue-50={formData.avatar === avatar.id}
							class:border-slate-300={formData.avatar !== avatar.id}
						>
							<NavIcon
								path={avatar.path}
								class={`h-8 w-8 ${formData.avatar === avatar.id ? 'text-blue-600' : 'text-slate-600'}`}
							/>
							<span class="text-xs font-medium text-slate-700">{avatar.name}</span>
						</button>
					{/each}
				</div>
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isSubmitting ? 'Creating Account...' : 'Create Account'}
			</button>

			<p class="text-sm text-slate-600 text-center mt-4">
				Already have an account?
				<a href="/login" class="text-blue-600 hover:underline font-semibold">Sign in</a>
			</p>
		</form>
	</div>
</div>

<!-- Success Banner -->
{#if showBanner}
	<div
		class="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down"
		role="alert"
		aria-live="polite"
	>
		<div class="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-96">
			<svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<div class="flex-1">
				<p class="font-semibold">Account created successfully!</p>
				<p class="text-sm opacity-90">Redirecting you to the home page...</p>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes slide-down {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.animate-slide-down {
		animation: slide-down 0.3s ease-out;
	}
</style>
