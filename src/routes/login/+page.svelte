<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';

	let formData = $state({ email: '', password: '' });
	let showBanner = $state(false);
	let errorMessage = $state('');
	let isSubmitting = $state(false);

	function handleSubmit(event: Event) {
		event.preventDefault();
		errorMessage = '';
		isSubmitting = true;

		fetch('/api/login', {
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
	<h1 class="text-4xl font-bold text-slate-900 mb-4">Welcome Back</h1>
	<p class="text-lg text-slate-600 mb-6">
		Sign in to your account to continue.
	</p>

	<div class="max-w-md">
		<form onsubmit={handleSubmit} class="bg-white rounded-lg shadow p-6">
			{#if errorMessage}
				<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
					<p class="text-red-700 text-sm">{errorMessage}</p>
				</div>
			{/if}

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
					class="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
					placeholder="Enter your password"
				/>
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isSubmitting ? 'Signing In...' : 'Sign In'}
			</button>

			<p class="text-sm text-slate-600 text-center mt-4">
				Don't have an account?
				<a href="/register" class="text-blue-600 hover:underline font-semibold">Create one</a>
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
				<p class="font-semibold">Logged in successfully!</p>
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
