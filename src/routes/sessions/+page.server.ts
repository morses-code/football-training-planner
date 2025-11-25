import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { trainingSessions, sessionSlotsCollection, drillsCollection } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Get today's date at midnight (start of today)
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

	// Fetch upcoming sessions (including today)
	const sessionsSnapshot = await trainingSessions
		.where('session_date', '>=', todayString)
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

	// Get past sessions count (before today)
	const pastSessionsSnapshot = await trainingSessions
		.where('session_date', '<', todayString)
		.get();
	const pastSessionsCount = pastSessionsSnapshot.size;

	return {
		user: locals.user,
		sessions,
		drillCount,
		pastSessionsCount
	};
};
