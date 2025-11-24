import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const sessionId = params.id;

	try {
		// Check if session exists and user owns it
		const session = db.prepare('SELECT created_by FROM training_sessions WHERE id = ?').get(sessionId) as { created_by: string } | undefined;
		
		if (!session) {
			return json({ error: 'Session not found' }, { status: 404 });
		}

		// Delete session (CASCADE will delete slots and coach assignments)
		db.prepare('DELETE FROM training_sessions WHERE id = ?').run(sessionId);

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
		const session = db.prepare('SELECT id FROM training_sessions WHERE id = ?').get(sessionId);
		
		if (!session) {
			return json({ error: 'Session not found' }, { status: 404 });
		}

		// Check if another session already exists on this date (excluding current session)
		const existingSession = db.prepare(`
			SELECT id FROM training_sessions 
			WHERE session_date = ? AND id != ?
		`).get(sessionDate, sessionId);

		if (existingSession) {
			return json({ error: 'A session already exists on this date. Only one session per day is allowed.' }, { status: 400 });
		}

		// Start transaction
		db.prepare('BEGIN TRANSACTION').run();

		try {
			// Update training session
			db.prepare(`
				UPDATE training_sessions 
				SET session_date = ?, start_time = ?, duration = ?, notes = ?
				WHERE id = ?
			`).run(sessionDate, startTime, duration || 60, notes || null, sessionId);

			// Delete existing slots and coach assignments (CASCADE)
			db.prepare('DELETE FROM session_slots WHERE session_id = ?').run(sessionId);
			db.prepare('DELETE FROM coach_assignments WHERE session_id = ?').run(sessionId);

			// Insert new session slots
			const slotIds: string[] = [];
			if (slots && Array.isArray(slots)) {
				const slotStmt = db.prepare(`
					INSERT INTO session_slots (id, session_id, slot_type, slot_order, drill_id, duration, notes)
					VALUES (?, ?, ?, ?, ?, ?, ?)
				`);

				slots.forEach((slot: any, index: number) => {
					const slotId = crypto.randomUUID();
					slotIds.push(slotId);
					slotStmt.run(
						slotId,
						sessionId,
						slot.type,
						index + 1,
						slot.drillId || null,
						slot.duration,
						slot.notes || null
					);
				});
			}

			// Insert new coach assignments
			if (coaches && Array.isArray(coaches)) {
				const coachStmt = db.prepare(`
					INSERT INTO coach_assignments (id, session_id, slot_id, coach_id, role, task_type)
					VALUES (?, ?, ?, ?, ?, ?)
				`);

				coaches.forEach((assignment: any) => {
					const slotId = assignment.slotIndex !== undefined ? slotIds[assignment.slotIndex] : null;
					
					coachStmt.run(
						crypto.randomUUID(),
						sessionId,
						slotId,
						assignment.coachId,
						assignment.role || 'assistant',
						assignment.taskType || null
					);
				});
			}

			// Commit transaction
			db.prepare('COMMIT').run();

			return json({ success: true, sessionId });
		} catch (error) {
			db.prepare('ROLLBACK').run();
			throw error;
		}
	} catch (error) {
		console.error('Error updating session:', error);
		return json({ error: 'Failed to update session' }, { status: 500 });
	}
};
