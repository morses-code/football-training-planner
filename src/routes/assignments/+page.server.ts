import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { coachAssignmentsCollection, trainingSessions, sessionSlotsCollection, drillsCollection } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Get all assignments for this coach
	const assignmentsSnapshot = await coachAssignmentsCollection
		.where('coach_id', '==', locals.user.id)
		.get();

	// Get unique session IDs
	const sessionIds = [...new Set(assignmentsSnapshot.docs.map(doc => doc.data().session_id))];

	// Fetch details for each session
	const sessionsData = await Promise.all(
		sessionIds.map(async (sessionId) => {
			const sessionDoc = await trainingSessions.doc(sessionId).get();
			if (!sessionDoc.exists) return null;

			const sessionData = sessionDoc.data()!;

			// Get all assignments for this coach in this session
			const sessionAssignments = assignmentsSnapshot.docs
				.filter(doc => doc.data().session_id === sessionId)
				.map(doc => doc.data());

			// Build slots array
			const slots = await Promise.all(
				sessionAssignments.map(async (assignment) => {
					// Setup tasks (no slot_id)
					if (assignment.task_type === 'setup') {
						return {
							id: 'setup',
							type: 'setup',
							order: 0,
							drillName: null,
							drillCategory: null,
							role: assignment.role,
							taskType: assignment.task_type
						};
					}

					// Regular slot assignments
					if (assignment.slot_id) {
						const slotDoc = await sessionSlotsCollection.doc(assignment.slot_id).get();
						if (!slotDoc.exists) return null;

						const slotData = slotDoc.data()!;
						let drillName = null;
						let drillCategory = null;

						if (slotData.drill_id) {
							const drillDoc = await drillsCollection.doc(slotData.drill_id).get();
							if (drillDoc.exists) {
								const drillData = drillDoc.data()!;
								drillName = drillData.name;
								drillCategory = drillData.category;
							}
						}

						return {
							id: assignment.slot_id,
							type: slotData.slot_type,
							order: slotData.slot_order,
							drillName,
							drillCategory,
							role: assignment.role,
							taskType: assignment.task_type
						};
					}

					return null;
				})
			);

			// Filter out null slots
			const validSlots = slots.filter((s): s is NonNullable<typeof s> => s !== null);

			return {
				id: sessionId,
				date: sessionData.session_date,
				startTime: sessionData.start_time,
				duration: sessionData.duration,
				notes: sessionData.notes,
				slots: validSlots
			};
		})
	);

	// Filter out null sessions and sort by date
	const sessions = sessionsData
		.filter((s): s is NonNullable<typeof s> => s !== null)
		.sort((a, b) => {
			// Sort by date descending, then start time descending
			const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
			if (dateCompare !== 0) return dateCompare;
			return b.startTime.localeCompare(a.startTime);
		});

	return {
		user: locals.user,
		sessions
	};
};

