import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { usersCollection } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user.email !== 'system@example.com') {
		throw redirect(302, '/');
	}

	const snapshot = await usersCollection.orderBy('created_at', 'desc').get();
	const users = snapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	}));

	return {
		user: locals.user,
		users
	};
};
