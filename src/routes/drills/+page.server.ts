import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { drillsCollection } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Fetch all drills from Firestore
	const snapshot = await drillsCollection.orderBy('created_at', 'desc').get();
	const drills = snapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	}));
	
	return {
		user: locals.user,
		drills
	};
};
