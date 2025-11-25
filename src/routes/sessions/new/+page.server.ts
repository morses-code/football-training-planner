import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { drillsCollection, usersCollection } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	
	// Load all drills for selection
	const drillsSnapshot = await drillsCollection.orderBy('category').orderBy('name').get();
	const drills = drillsSnapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	}));
	
	// Load all users (potential coaches), excluding system user
	const coachesSnapshot = await usersCollection
		.where('email', '!=', 'system@example.com')
		.orderBy('email')
		.orderBy('name')
		.get();

	const coaches = coachesSnapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	}));
	
	return { drills, coaches };
};
