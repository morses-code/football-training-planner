<script lang="ts">
	import type { PageData } from './$types';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props<{ data: PageData }>();

	let showDeleteModal = $state(false);
	let deleteUserId = $state<string | null>(null);
	let deleteUserName = $state<string>('');

	const avatarIcons: Record<string, string> = {
		user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
		star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
		lightning: 'M13 10V3L4 14h7v7l9-11h-7z',
		fire: 'M12 2c1.646 0 3.226.444 4.565 1.283a9 9 0 013.152 3.152A8.955 8.955 0 0121 11c0 2.6-1.6 4.9-3.9 6.4-.6.4-1.3.7-2 .9-.4.1-.8.2-1.2.2-.2 0-.4 0-.6-.1-.4-.1-.7-.2-1-.4-.5-.3-.9-.7-1.2-1.2-.3-.5-.5-1-.5-1.6 0-.5.1-1 .4-1.5.3-.5.7-.9 1.2-1.2.5-.3 1-.5 1.6-.5.3 0 .6.1.9.2.3.1.5.3.7.5.2.2.4.5.5.7.1.3.2.6.2.9 0 .2 0 .4-.1.6-.1.2-.2.4-.3.5-.2.2-.4.3-.6.4-.2.1-.5.1-.7.1-.2 0-.4 0-.6-.1-.2-.1-.3-.2-.5-.3-.1-.1-.2-.3-.3-.5-.1-.2-.1-.4-.1-.6 0-.4.2-.8.5-1 .3-.2.7-.4 1.1-.4.5 0 .9.2 1.3.5s.5.8.5 1.3c0 .4-.1.7-.3 1-.2.3-.5.6-.8.8-.3.2-.7.3-1.1.3-.5 0-1-.2-1.4-.5-.4-.3-.7-.8-.9-1.3-.2-.5-.3-1.1-.3-1.7 0-.8.2-1.5.6-2.2.4-.6 1-1.2 1.7-1.6.7-.4 1.5-.6 2.3-.6 1 0 1.9.3 2.7.9.8.6 1.4 1.4 1.8 2.3.4.9.6 1.9.6 2.9 0 1.3-.3 2.6-1 3.7-.6 1.1-1.5 2-2.6 2.6-1.1.6-2.3 1-3.6 1-1.1 0-2.2-.3-3.2-.8-1-.5-1.8-1.3-2.4-2.2-.6-.9-.9-2-.9-3.1 0-1 .2-1.9.7-2.8.5-.9 1.1-1.6 1.9-2.2C10.1 2.3 11 2 12 2z',
		heart: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
		trophy: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
		rocket: 'M11.5 2.75a.75.75 0 01.75-.75h4.5a.75.75 0 01.53 1.28l-1.5 1.5 1.5 1.5a.75.75 0 01-.53 1.28h-4.5a.75.75 0 01-.75-.75v-4.5zm-2.5 17a.75.75 0 01.75-.75h6.5a.75.75 0 01.53 1.28l-1.5 1.5 1.5 1.5a.75.75 0 01-.53 1.28h-6.5a.75.75 0 01-.75-.75v-4.5zM20.314 11.954l-3.182-3.182a.75.75 0 010-1.06l1.06-1.061a.75.75 0 011.061 0l3.182 3.182a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 01-1.061 0z',
		shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
		academic: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l-9-5v7a2 2 0 002 2h14a2 2 0 002-2v-7l-9 5z',
		chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
		flag: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9',
		puzzle: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
	};

	function confirmDelete(userId: string, userName: string) {
		deleteUserId = userId;
		deleteUserName = userName;
		showDeleteModal = true;
	}

	async function handleDelete() {
		if (!deleteUserId) return;

		try {
			const res = await fetch(`/api/admin/users/${deleteUserId}`, {
				method: 'DELETE'
			});

			if (res.ok) {
				await invalidateAll();
			} else {
				alert('Failed to delete user');
			}
		} catch (error) {
			console.error('Error deleting user:', error);
			alert('Failed to delete user');
		} finally {
			deleteUserId = null;
			deleteUserName = '';
		}
	}
</script>

<div class="w-full">
	<!-- Hero Header -->
	<div class="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl md:text-5xl font-bold mb-2">User Management</h1>
				<p class="text-lg md:text-xl text-purple-100">
					Manage coaches and system users
				</p>
			</div>
			<div class="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30">
				<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
				</svg>
			</div>
		</div>
	</div>

	<!-- Users List -->
	<div class="bg-white rounded-xl shadow-lg border-2 border-slate-200">
		<div class="p-6">
			<h2 class="text-xl font-bold text-slate-800 mb-4">All Users</h2>
			<div class="space-y-3">
				<!-- Create New User Template Card -->
				<a 
					href="/admin/users/new"
					class="block bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-dashed border-purple-300 rounded-xl p-6 hover:border-purple-500 hover:shadow-lg hover:from-purple-100 hover:to-pink-100 transition-all group"
				>
					<div class="flex items-center justify-center gap-4">
						<div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
							<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
							</svg>
						</div>
						<div class="text-center">
							<h3 class="text-xl font-bold text-slate-900 mb-1">Create New User</h3>
							<p class="text-sm text-slate-600">Click to add a new coach</p>
						</div>
					</div>
				</a>

				{#each data.users as user}
					<div class="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white border-2 border-slate-200 rounded-xl hover:border-purple-400 transition-all">
						<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-md">
							<svg class="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
								<path d={avatarIcons[user.avatar] || avatarIcons.user} />
							</svg>
						</div>
						<div class="flex-1">
							<h3 class="font-bold text-slate-900">{user.name}</h3>
							<p class="text-sm text-slate-600">{user.email}</p>
							<p class="text-xs text-slate-500 mt-1">
								Created: {new Date(user.created_at).toLocaleDateString()}
							</p>
						</div>
						{#if user.email === 'system@example.com'}
							<span class="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg border border-purple-200">
								Admin
							</span>
						{:else}
							<button
								onclick={() => confirmDelete(user.id, user.name)}
								class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-sm"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
								<span>Delete</span>
							</button>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<ConfirmModal
	bind:isOpen={showDeleteModal}
	title="Delete User"
	message="Are you sure you want to delete {deleteUserName}? This action cannot be undone."
	confirmText="Delete"
	cancelText="Cancel"
	danger={true}
	onConfirm={handleDelete}
	onCancel={() => {
		deleteUserId = null;
		deleteUserName = '';
	}}
/>
