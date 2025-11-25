import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { trainingSessions, sessionSlotsCollection, coachAssignmentsCollection } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	try {
		const data = await request.json();
		
		const { sessionDate, startTime, duration, notes, setupNotes, slots, coaches } = data;

		// Validate required fields
		if (!sessionDate || !startTime) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Check if a session already exists on this date
		const existingSessionSnapshot = await trainingSessions.where('session_date', '==', sessionDate).limit(1).get();

		if (!existingSessionSnapshot.empty) {
			return json({ error: 'A session already exists on this date. Only one session per day is allowed.' }, { status: 400 });
		}

		// Generate session ID
		const sessionId = crypto.randomUUID();
		
		// Insert training session
		const sessionNotes = [notes, setupNotes ? `Setup: ${setupNotes}` : null]
			.filter(Boolean)
			.join('\n\n');

		await trainingSessions.doc(sessionId).set({
			session_date: sessionDate,
			start_time: startTime,
			duration: duration || 60,
			notes: sessionNotes || null,
			created_by: locals.user.id,
			created_at: Math.floor(Date.now() / 1000)
		});

		// Insert session slots if provided and collect slot IDs
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

		// Insert coach assignments if provided
		if (coaches && Array.isArray(coaches)) {
			const coachPromises = coaches.map((assignment: any) => {
				// Map slotIndex to actual slot ID
				// -1 indicates setup task (no slot)
				const slotId = assignment.slotIndex === -1 
					? null 
					: (assignment.slotIndex !== undefined ? slotIds[assignment.slotIndex] : null);
				
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

		return json({
			success: true,
			sessionId: sessionId
		});
	} catch (error) {
		console.error('Error creating session:', error);
		return json({ error: 'Failed to create session' }, { status: 500 });
	}
};

export const GET: RequestHandler = async () => {
	try {
		const sessionsSnapshot = await trainingSessions.orderBy('session_date', 'desc').get();
		
		// For each session, get slot count and types
		const sessionsWithDetails = await Promise.all(
			sessionsSnapshot.docs.map(async (doc) => {
				const sessionData = doc.data();
				const slotsSnapshot = await sessionSlotsCollection.where('session_id', '==', doc.id).get();
				
				const slotTypes = [...new Set(slotsSnapshot.docs.map(slotDoc => slotDoc.data().slot_type))];
				
				return {
					id: doc.id,
					...sessionData,
					slot_count: slotsSnapshot.size,
					slot_types: slotTypes.join(',')
				};
			})
		);

		return json({ sessions: sessionsWithDetails });
	} catch (error) {
		console.error('Error fetching sessions:', error);
		return json({ error: 'Failed to fetch sessions' }, { status: 500 });
	}
};
