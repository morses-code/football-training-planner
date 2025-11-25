import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { usersCollection } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const snapshot = await usersCollection
		.where('email', '!=', 'system@example.com')
		.orderBy('email')
		.orderBy('name', 'asc')
		.get();

	const coaches = snapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	}));

	return {
		coaches
	};
};
