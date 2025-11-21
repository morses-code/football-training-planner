import { writable } from 'svelte/store';

export type User = {
	id: string;
	name: string;
	email: string;
	avatar: string;
} | null;

function createUserStore() {
	const { subscribe, set } = writable<User>(null);

	return {
		subscribe,
		set,
		logout: async () => {
			await fetch('/api/logout', { method: 'POST' });
			set(null);
		}
	};
}

export const user = createUserStore();
