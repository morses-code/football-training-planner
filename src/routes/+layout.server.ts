import type { LayoutServerLoad } from './$types';
import { coachAssignmentsCollection, trainingSessions } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals }) => {
	let assignmentCount = 0;
	
	if (locals.user) {
		// Get today's date at midnight
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
		
		// Get the next upcoming session (including today)
		const upcomingSessionsSnapshot = await trainingSessions
			.where('session_date', '>=', todayString)
			.orderBy('session_date', 'asc')
			.limit(1)
			.get();
		
		if (!upcomingSessionsSnapshot.empty) {
			const nextSession = upcomingSessionsSnapshot.docs[0];
			
			// Count assignments for this user in that session
			const assignmentsSnapshot = await coachAssignmentsCollection
				.where('coach_id', '==', locals.user.id)
				.where('session_id', '==', nextSession.id)
				.get();
			
			assignmentCount = assignmentsSnapshot.size;
		}
	}
	
	return {
		user: locals.user,
		assignmentCount
	};
};
