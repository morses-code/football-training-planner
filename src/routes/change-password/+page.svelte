<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';

	let formData = $state({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});

	let error = $state('');
	let isSubmitting = $state(false);

	async function handleSubmit() {
		error = '';

		// Validate passwords match
		if (formData.newPassword !== formData.confirmPassword) {
			error = 'New passwords do not match';
			return;
		}

		// Validate password length
		if (formData.newPassword.length < 6) {
			error = 'Password must be at least 6 characters';
			return;
		}

		isSubmitting = true;

		try {
			const res = await fetch('/api/change-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

			const data = await res.json();

			if (res.ok) {
				await invalidateAll();
				goto('/');
			} else {
				error = data.error || 'Failed to change password';
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
	<div class="mb-6 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl md:text-5xl font-bold mb-2">Change Password</h1>
				<p class="text-lg md:text-xl text-orange-100">
					Please update your password to continue
				</p>
			</div>
			<div class="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30">
				<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
				</svg>
			</div>
		</div>
	</div>

	<!-- Notice -->
	<div class="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
		<div class="flex gap-3">
			<svg class="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
			<div>
				<p class="font-semibold text-orange-900">Password Change Required</p>
				<p class="text-sm text-orange-700 mt-1">
					Your administrator has requested that you change your password on first login. 
					Please choose a secure password that you haven't used before.
				</p>
			</div>
		</div>
	</div>

	<!-- Form -->
	<div class="max-w-md mx-auto">
		<div class="bg-white rounded-xl shadow-lg border-2 border-slate-200 p-6">
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
				{#if error}
					<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
						{error}
					</div>
				{/if}

				<div class="space-y-4">
					<!-- Current Password -->
					<div>
						<label for="currentPassword" class="block text-sm font-semibold text-slate-700 mb-2">
							Current Password
						</label>
						<input
							id="currentPassword"
							type="password"
							bind:value={formData.currentPassword}
							required
							class="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
							placeholder="Enter current password"
						/>
					</div>

					<!-- New Password -->
					<div>
						<label for="newPassword" class="block text-sm font-semibold text-slate-700 mb-2">
							New Password
						</label>
						<input
							id="newPassword"
							type="password"
							bind:value={formData.newPassword}
							required
							minlength="6"
							class="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
							placeholder="Minimum 6 characters"
						/>
					</div>

					<!-- Confirm Password -->
					<div>
						<label for="confirmPassword" class="block text-sm font-semibold text-slate-700 mb-2">
							Confirm New Password
						</label>
						<input
							id="confirmPassword"
							type="password"
							bind:value={formData.confirmPassword}
							required
							minlength="6"
							class="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
							placeholder="Re-enter new password"
						/>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="pt-6">
					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? 'Changing Password...' : 'Change Password'}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
