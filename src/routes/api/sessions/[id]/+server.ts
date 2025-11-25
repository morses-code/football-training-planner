import { json } from '@sveltejs/kit';
import type { RequestHandler} from './$types';
import { trainingSessions, sessionSlotsCollection, coachAssignmentsCollection } from '$lib/server/db';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const sessionId = params.id;

	try {
		// Check if session exists
		const sessionDoc = await trainingSessions.doc(sessionId).get();
		
		if (!sessionDoc.exists) {
			return json({ error: 'Session not found' }, { status: 404 });
		}

		// Delete session slots
		const slotsSnapshot = await sessionSlotsCollection.where('session_id', '==', sessionId).get();
		await Promise.all(slotsSnapshot.docs.map(doc => doc.ref.delete()));

		// Delete coach assignments
		const assignmentsSnapshot = await coachAssignmentsCollection.where('session_id', '==', sessionId).get();
		await Promise.all(assignmentsSnapshot.docs.map(doc => doc.ref.delete()));

		// Delete session
		await trainingSessions.doc(sessionId).delete();

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting session:', error);
		return json({ error: 'Failed to delete session' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const sessionId = params.id;

	try {
		const data = await request.json();
		const { sessionDate, startTime, duration, notes, slots, coaches } = data;

		// Check if session exists
		const sessionDoc = await trainingSessions.doc(sessionId).get();
		
		if (!sessionDoc.exists) {
			return json({ error: 'Session not found' }, { status: 404 });
		}

		// Check if another session already exists on this date (excluding current session)
		const existingSessionSnapshot = await trainingSessions
			.where('session_date', '==', sessionDate)
			.get();

		const otherSession = existingSessionSnapshot.docs.find(doc => doc.id !== sessionId);
		if (otherSession) {
			return json({ error: 'A session already exists on this date. Only one session per day is allowed.' }, { status: 400 });
		}

		// Update training session
		await trainingSessions.doc(sessionId).update({
			session_date: sessionDate,
			start_time: startTime,
			duration: duration || 60,
			notes: notes || null
		});

		// Delete existing slots and coach assignments
		const existingSlotsSnapshot = await sessionSlotsCollection.where('session_id', '==', sessionId).get();
		await Promise.all(existingSlotsSnapshot.docs.map(doc => doc.ref.delete()));

		const existingAssignmentsSnapshot = await coachAssignmentsCollection.where('session_id', '==', sessionId).get();
		await Promise.all(existingAssignmentsSnapshot.docs.map(doc => doc.ref.delete()));

		// Insert new session slots
		const slotIds: string[] = [];
		if (slots && Array.isArray(slots)) {
			const slotPromises = slots.map(async (slot: any, index: number) => {
				const slotId = crypto.randomUUID();
				slotIds.push(slotId);
				return sessionSlotsCollection.doc(slotId).set({
					session_id: sessionId,
					slot_type: slot.type,
					slot_order: index + 1,
					drill_id: slot.drillId || null,
					duration: slot.duration,
					notes: slot.notes || null
				});
			});
			await Promise.all(slotPromises);
		}

		// Insert new coach assignments
		if (coaches && Array.isArray(coaches)) {
			const coachPromises = coaches.map((assignment: any) => {
				const slotId = assignment.slotIndex !== undefined ? slotIds[assignment.slotIndex] : null;
				
				return coachAssignmentsCollection.doc(crypto.randomUUID()).set({
					session_id: sessionId,
					slot_id: slotId,
					coach_id: assignment.coachId,
					role: assignment.role || 'assistant',
					task_type: assignment.taskType || null
				});
			});
			await Promise.all(coachPromises);
		}

		return json({ success: true, sessionId });
	} catch (error) {
		console.error('Error updating session:', error);
		return json({ error: 'Failed to update session' }, { status: 500 });
	}
};
