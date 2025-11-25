import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { trainingSessions, sessionSlotsCollection, drillsCollection } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Fetch upcoming sessions
	const now = Math.floor(Date.now() / 1000);
	const sessionsSnapshot = await trainingSessions
		.where('session_date', '>=', now)
		.orderBy('session_date', 'asc')
		.limit(20)
		.get();

	// For each session, get slot and drill counts
	const sessions = await Promise.all(
		sessionsSnapshot.docs.map(async (doc) => {
			const sessionData = doc.data();
			const slotsSnapshot = await sessionSlotsCollection.where('session_id', '==', doc.id).get();
			
			const drillsAssigned = slotsSnapshot.docs.filter(slotDoc => slotDoc.data().drill_id !== null).length;
			
			return {
				id: doc.id,
				...sessionData,
				slot_count: slotsSnapshot.size,
				drills_assigned: drillsAssigned
			};
		})
	);

	// Get total drills count
	const drillsSnapshot = await drillsCollection.get();
	const drillCount = drillsSnapshot.size;

	// Get past sessions count
	const pastSessionsSnapshot = await trainingSessions
		.where('session_date', '<', now)
		.get();
	const pastSessionsCount = pastSessionsSnapshot.size;

	return {
		user: locals.user,
		sessions,
		drillCount,
		pastSessionsCount
	};
};
