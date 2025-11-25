import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { trainingSessions, sessionSlotsCollection, drillsCollection, coachAssignmentsCollection, usersCollection } from '$lib/server/db';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw error(401, 'Not authenticated');
	}

	const sessionId = params.id;

	// Fetch session details
	const sessionDoc = await trainingSessions.doc(sessionId).get();

	if (!sessionDoc.exists) {
		throw error(404, 'Session not found');
	}

	const session = {
		id: sessionDoc.id,
		...sessionDoc.data()
	};

	// Fetch session slots
	const slotsSnapshot = await sessionSlotsCollection
		.where('session_id', '==', sessionId)
		.orderBy('slot_order')
		.get();

	// For each slot, get drill details if drill_id exists
	const slots = await Promise.all(
		slotsSnapshot.docs.map(async (slotDoc) => {
			const slotData = slotDoc.data();
			let drillInfo = {};

			if (slotData.drill_id) {
				const drillDoc = await drillsCollection.doc(slotData.drill_id).get();
				if (drillDoc.exists) {
					const drillData = drillDoc.data()!;
					drillInfo = {
						drill_name: drillData.name,
						drill_description: drillData.description,
						drill_category: drillData.category,
						drill_skill_focus: drillData.skill_focus,
						drill_equipment: drillData.equipment,
						drill_instructions: drillData.instructions,
						drill_min_players: drillData.min_players,
						drill_max_players: drillData.max_players,
						drill_duration: drillData.duration
					};
				}
			}

			return {
				id: slotDoc.id,
				...slotData,
				...drillInfo
			};
		})
	);

	// Fetch coach assignments for this session
	const assignmentsSnapshot = await coachAssignmentsCollection
		.where('session_id', '==', sessionId)
		.get();

	// Get coach details for each assignment
	const coachAssignments = await Promise.all(
		assignmentsSnapshot.docs.map(async (assignmentDoc) => {
			const assignmentData = assignmentDoc.data();
			const userDoc = await usersCollection.doc(assignmentData.coach_id).get();
			const userData = userDoc.data()!;

			// Get slot order if slot_id exists
			let slotOrder = null;
			if (assignmentData.slot_id) {
				const slotDoc = await sessionSlotsCollection.doc(assignmentData.slot_id).get();
				if (slotDoc.exists) {
					slotOrder = slotDoc.data()!.slot_order;
				}
			}

			return {
				...assignmentData,
				coach_name: userData.name,
				coach_email: userData.email,
				coach_avatar: userData.avatar,
				slot_order: slotOrder
			};
		})
	);

	// Group coaches by slot
	const slotCoaches: Record<string, any[]> = {};
	coachAssignments.forEach((assignment: any) => {
		const slotId = assignment.slot_id || 'session';
		if (!slotCoaches[slotId]) {
			slotCoaches[slotId] = [];
		}
		slotCoaches[slotId].push({
			id: assignment.coach_id,
			name: assignment.coach_name,
			email: assignment.coach_email,
			avatar: assignment.coach_avatar,
			role: assignment.role,
			taskType: assignment.task_type
		});
	});

	return {
		session,
		slots,
		slotCoaches
	};
};
