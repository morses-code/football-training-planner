<script lang="ts">
	import NavIcon from '$lib/components/NavIcon.svelte';
	import type { PageData } from './$types';
	import { invalidateAll, goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	const avatarOptions = [
		{ id: 'user-circle', name: 'User', path: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
		{ id: 'star', name: 'Star', path: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
		{ id: 'lightning', name: 'Lightning', path: 'M13 10V3L4 14h7v7l9-11h-7z' },
		{ id: 'fire', name: 'Fire', path: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' },
		{ id: 'heart', name: 'Heart', path: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
		{ id: 'trophy', name: 'Trophy', path: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
		{ id: 'rocket', name: 'Rocket', path: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122' },
		{ id: 'shield', name: 'Shield', path: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
		{ id: 'academic', name: 'Academic', path: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
		{ id: 'chart', name: 'Chart', path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
		{ id: 'flag', name: 'Flag', path: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' },
		{ id: 'puzzle', name: 'Puzzle', path: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' }
	];

	let isEditing = $state(false);
	let editData = $state({
		name: data.user?.name || '',
		avatar: data.user?.avatar || 'user-circle'
	});
	let showBanner = $state(false);
	let isSubmitting = $state(false);
	let isLoggingOut = $state(false);

	function startEditing() {
		editData = {
			name: data.user?.name || '',
			avatar: data.user?.avatar || 'user-circle'
		};
		isEditing = true;
	}

	function cancelEditing() {
		isEditing = false;
	}

	async function saveChanges() {
		isSubmitting = true;

		try {
			const res = await fetch('/api/profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(editData)
			});
			
			const responseData = await res.json();
			
			if (responseData.success) {
				// Refresh all server data to update user store and navigation
				await invalidateAll();
				
				isEditing = false;
				showBanner = true;
				setTimeout(() => {
					showBanner = false;
				}, 3000);
			}
		} catch (error) {
			console.error('Failed to update profile:', error);
		} finally {
			isSubmitting = false;
		}
	}

	async function handleLogout() {
		isLoggingOut = true;
		try {
			await fetch('/api/logout', { method: 'POST' });
			await invalidateAll();
			goto('/');
		} catch (error) {
			console.error('Logout failed:', error);
			isLoggingOut = false;
		}
	}
</script>

{#if data.user}
	<!-- Gradient Hero Section -->
	<div class="relative mb-8 rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 shadow-lg">
		<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0wIDIwYzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2di0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
		<div class="relative px-8 py-12">
			<div class="flex items-center gap-4 mb-3">
				<div class="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
					<NavIcon
						path={avatarOptions.find((a) => a.id === data.user?.avatar)?.path || avatarOptions[0].path}
						class="h-10 w-10 text-white"
					/>
				</div>
				<div>
					<h1 class="text-4xl font-bold text-white mb-1">My Profile</h1>
					<p class="text-blue-100">Manage your account settings and preferences</p>
				</div>
			</div>
		</div>
	</div>

	<div class="grid lg:grid-cols-3 gap-6">
		<!-- Main Profile Card -->
		<div class="lg:col-span-2">
			<div class="bg-white rounded-xl shadow-lg border-2 border-slate-100 p-8">
				{#if isEditing}
					<!-- Edit Mode -->
					<div class="flex items-center gap-3 mb-6">
						<div class="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
							</svg>
						</div>
						<h2 class="text-2xl font-bold text-slate-800">Edit Profile</h2>
					</div>

					<div class="flex flex-col mb-6">
						<label for="name" class="text-sm font-semibold text-slate-700 mb-2">Display Name</label>
						<input
							type="text"
							id="name"
							bind:value={editData.name}
							placeholder="Enter your name"
							class="px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
						/>
					</div>

					<div class="flex flex-col mb-8">
						<p class="text-sm font-semibold text-slate-700 mb-3">Choose Avatar</p>
						<div class="grid grid-cols-4 sm:grid-cols-6 gap-3">
							{#each avatarOptions as avatar}
								<button
									type="button"
									onclick={() => (editData.avatar = avatar.id)}
									class="flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105"
									class:border-blue-500={editData.avatar === avatar.id}
									class:bg-gradient-to-br={editData.avatar === avatar.id}
									class:from-blue-50={editData.avatar === avatar.id}
									class:to-indigo-50={editData.avatar === avatar.id}
									class:border-slate-200={editData.avatar !== avatar.id}
									class:hover:border-slate-300={editData.avatar !== avatar.id}
								>
									<NavIcon
										path={avatar.path}
										class={`h-8 w-8 ${editData.avatar === avatar.id ? 'text-blue-600' : 'text-slate-500'}`}
									/>
									<span class="text-xs font-medium text-slate-600">{avatar.name}</span>
								</button>
							{/each}
						</div>
					</div>

					<div class="flex gap-3">
						<button
							onclick={saveChanges}
							disabled={isSubmitting}
							class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? 'Saving...' : 'Save Changes'}
						</button>
						<button
							onclick={cancelEditing}
							disabled={isSubmitting}
							class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
						>
							Cancel
						</button>
					</div>
				{:else}
					<!-- View Mode -->
					<div class="flex items-center gap-6 mb-8">
						<div class="h-24 w-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
							<NavIcon
								path={avatarOptions.find((a) => a.id === data.user?.avatar)?.path || avatarOptions[0].path}
								class="h-16 w-16 text-white"
							/>
						</div>
						<div class="flex-1">
							<h2 class="text-3xl font-bold text-slate-800 mb-1">{data.user.name}</h2>
							<p class="text-slate-600 text-lg mb-4">{data.user.email}</p>
							<button
								onclick={startEditing}
								class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
								</svg>
								Edit Profile
							</button>
						</div>
					</div>

					<div class="grid sm:grid-cols-2 gap-4 pt-6 border-t-2 border-slate-100">
						<div class="bg-slate-50 rounded-lg p-4">
							<p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email Address</p>
							<p class="text-slate-800 font-medium">{data.user.email}</p>
						</div>
						<div class="bg-slate-50 rounded-lg p-4">
							<p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Account Status</p>
							<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
								<span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
								Active
							</span>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Quick Actions -->
			<div class="bg-white rounded-xl shadow-lg border-2 border-slate-100 p-6">
				<div class="flex items-center gap-3 mb-4">
					<div class="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
						</svg>
					</div>
					<h2 class="text-xl font-bold text-slate-800">Quick Actions</h2>
				</div>
				<div class="space-y-3">
					<a
						href="/change-password"
						class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
					>
						<div class="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
							<svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
							</svg>
						</div>
						<span class="font-medium text-slate-700">Change Password</span>
					</a>
					<button
						onclick={handleLogout}
						disabled={isLoggingOut}
						class="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-red-50 transition-colors group disabled:opacity-50"
					>
						<div class="h-8 w-8 bg-slate-200 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
							<svg class="w-5 h-5 text-slate-600 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
							</svg>
						</div>
						<span class="font-medium text-slate-700 group-hover:text-red-600 transition-colors">
							{isLoggingOut ? 'Signing out...' : 'Sign Out'}
						</span>
					</button>
				</div>
			</div>

			<!-- Account Info -->
			<div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg border-2 border-slate-200 p-6">
				<div class="flex items-center gap-3 mb-4">
					<div class="h-10 w-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					<h2 class="text-xl font-bold text-slate-800">Account Info</h2>
				</div>
				<div class="space-y-3">
					<div class="bg-white rounded-lg p-3 border border-slate-200">
						<p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Member Since</p>
						<p class="text-slate-700 font-medium">
							{new Date(data.user.created_at * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
						</p>
					</div>
					<div class="bg-white rounded-lg p-3 border border-slate-200">
						<p class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">User ID</p>
						<p class="text-slate-700 font-mono text-xs truncate">{data.user.id}</p>
					</div>
				</div>
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
			<div class="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-96 border-2 border-green-400">
				<div class="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						></path>
					</svg>
				</div>
				<div class="flex-1">
					<p class="font-bold">Profile Updated!</p>
					<p class="text-sm text-green-50">Your changes have been saved successfully.</p>
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
{/if}
