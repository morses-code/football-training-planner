import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { trainingSessions, sessionSlotsCollection, drillsCollection, coachAssignmentsCollection, usersCollection } from '$lib/server/db';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const sessionId = params.id;

	// Fetch session details
	const sessionDoc = await trainingSessions.doc(sessionId).get();

	if (!sessionDoc.exists) {
		throw redirect(302, '/sessions');
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
			let drillInfo: any = {
				drill_id: slotData.drill_id,
				drill_name: null,
				drill_category: null
			};

			if (slotData.drill_id) {
				const drillDoc = await drillsCollection.doc(slotData.drill_id).get();
				if (drillDoc.exists) {
					const drillData = drillDoc.data()!;
					drillInfo = {
						drill_id: slotData.drill_id,
						drill_name: drillData.name,
						drill_category: drillData.category
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

	// Fetch coach assignments
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
				slot_order: slotOrder
			};
		})
	);

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

	// Group coaches by slot
	const slotCoaches: Record<string, any[]> = {};
	coachAssignments.forEach((assignment: any) => {
		const slotId = assignment.slot_id;
		if (slotId) {
			if (!slotCoaches[slotId]) {
				slotCoaches[slotId] = [];
			}
			slotCoaches[slotId].push({
				id: assignment.coach_id,
				name: assignment.coach_name,
				email: assignment.coach_email,
				role: assignment.role
			});
		}
	});

	return {
		session,
		slots,
		slotCoaches,
		drills,
		coaches
	};
};
