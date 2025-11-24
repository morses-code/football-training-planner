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
						// Redirect based on user status
						if (data.mustChangePassword) {
							goto('/change-password');
						} else if (data.hasAssignments) {
							goto('/assignments');
						} else {
							goto('/');
						}
					}, 1500);
				}
			})
			.catch(() => {
				errorMessage = 'Something went wrong. Please try again.';
				isSubmitting = false;
			});
	}
</script>

<div class="w-full">
	<!-- Hero Header with Gradient -->
	<div class="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl md:text-5xl font-bold mb-2">Welcome Back</h1>
				<p class="text-lg md:text-xl text-blue-100">
					Sign in to your account to continue
				</p>
			</div>
			<div class="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30">
				<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
				</svg>
			</div>
		</div>
	</div>

	<!-- Login Form -->
	<div class="max-w-md mx-auto">
		<div class="bg-white rounded-xl shadow-lg border-2 border-slate-200 p-6">
			<form onsubmit={handleSubmit}>
				{#if errorMessage}
					<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
						{errorMessage}
					</div>
				{/if}

				<div class="space-y-4">
					<!-- Email -->
					<div>
						<label for="email" class="block text-sm font-semibold text-slate-700 mb-2">
							Email Address
						</label>
						<input
							type="email"
							id="email"
							bind:value={formData.email}
							required
							class="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
							placeholder="coach@example.com"
						/>
					</div>

					<!-- Password -->
					<div>
						<label for="password" class="block text-sm font-semibold text-slate-700 mb-2">
							Password
						</label>
						<input
							type="password"
							id="password"
							bind:value={formData.password}
							required
							class="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
							placeholder="Enter your password"
						/>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="pt-6">
					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? 'Signing In...' : 'Sign In'}
					</button>
				</div>
			</form>
		</div>
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
