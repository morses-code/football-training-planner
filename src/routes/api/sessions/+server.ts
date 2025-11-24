import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';

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
		const existingSession = db.prepare(`
			SELECT id FROM training_sessions WHERE session_date = ?
		`).get(sessionDate);

		if (existingSession) {
			return json({ error: 'A session already exists on this date. Only one session per day is allowed.' }, { status: 400 });
		}

		// Start transaction
		db.prepare('BEGIN TRANSACTION').run();

		try {
			// Generate session ID
			const sessionId = crypto.randomUUID();
			
			// Insert training session
			const sessionStmt = db.prepare(`
				INSERT INTO training_sessions (id, session_date, start_time, duration, notes, created_by)
				VALUES (?, ?, ?, ?, ?, ?)
			`);

			const sessionNotes = [notes, setupNotes ? `Setup: ${setupNotes}` : null]
				.filter(Boolean)
				.join('\n\n');

			sessionStmt.run(
				sessionId,
				sessionDate,
				startTime,
				duration || 60,
				sessionNotes || null,
				locals.user.id
			);

			// Insert session slots if provided and collect slot IDs
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

			// Insert coach assignments if provided
			if (coaches && Array.isArray(coaches)) {
				const coachStmt = db.prepare(`
					INSERT INTO coach_assignments (id, session_id, slot_id, coach_id, role, task_type)
					VALUES (?, ?, ?, ?, ?, ?)
				`);

				coaches.forEach((assignment: any) => {
					// Map slotIndex to actual slot ID
					// -1 indicates setup task (no slot)
					const slotId = assignment.slotIndex === -1 
						? null 
						: (assignment.slotIndex !== undefined ? slotIds[assignment.slotIndex] : null);
					
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

			return json({
				success: true,
				sessionId: sessionId
			});
		} catch (error) {
			// Rollback on error
			db.prepare('ROLLBACK').run();
			throw error;
		}
	} catch (error) {
		console.error('Error creating session:', error);
		return json({ error: 'Failed to create session' }, { status: 500 });
	}
};

export const GET: RequestHandler = async () => {
	try {
		const sessions = db.prepare(`
			SELECT 
				ts.*,
				COUNT(DISTINCT ss.id) as slot_count,
				GROUP_CONCAT(DISTINCT ss.slot_type) as slot_types
			FROM training_sessions ts
			LEFT JOIN session_slots ss ON ts.id = ss.session_id
			GROUP BY ts.id
			ORDER BY ts.session_date DESC, ts.start_time DESC
		`).all();

		return json({ sessions });
	} catch (error) {
		console.error('Error fetching sessions:', error);
		return json({ error: 'Failed to fetch sessions' }, { status: 500 });
	}
};
