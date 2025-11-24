import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Get all sessions where this coach is assigned
	const assignments = db.prepare(`
		SELECT DISTINCT
			ts.id as session_id,
			ts.session_date,
			ts.start_time,
			ts.duration,
			ts.notes,
			ca.role,
			ca.task_type,
			ss.id as slot_id,
			ss.slot_type,
			ss.slot_order,
			d.name as drill_name,
			d.category as drill_category,
			CASE 
				WHEN ca.task_type = 'setup' THEN 'setup'
				ELSE ss.slot_type
			END as display_type
		FROM coach_assignments ca
		JOIN training_sessions ts ON ca.session_id = ts.id
		LEFT JOIN session_slots ss ON ca.slot_id = ss.id
		LEFT JOIN drills d ON ss.drill_id = d.id
		WHERE ca.coach_id = ?
		ORDER BY ts.session_date DESC, ts.start_time DESC, 
		         CASE WHEN ca.task_type = 'setup' THEN 0 ELSE ss.slot_order END ASC
	`).all(locals.user.id);

	// Group assignments by session
	const sessionMap = new Map();
	
	for (const assignment of assignments as any[]) {
		if (!sessionMap.has(assignment.session_id)) {
			sessionMap.set(assignment.session_id, {
				id: assignment.session_id,
				date: assignment.session_date,
				startTime: assignment.start_time,
				duration: assignment.duration,
				notes: assignment.notes,
				slots: []
			});
		}
		
		const session = sessionMap.get(assignment.session_id);
		
		// Add setup tasks (no slot_id) or regular slot assignments
		if (assignment.task_type === 'setup') {
			session.slots.push({
				id: assignment.slot_id || 'setup',
				type: 'setup',
				order: 0,
				drillName: null,
				drillCategory: null,
				role: assignment.role,
				taskType: assignment.task_type
			});
		} else if (assignment.slot_id) {
			session.slots.push({
				id: assignment.slot_id,
				type: assignment.slot_type,
				order: assignment.slot_order,
				drillName: assignment.drill_name,
				drillCategory: assignment.drill_category,
				role: assignment.role,
				taskType: assignment.task_type
			});
		}
	}

	const sessions = Array.from(sessionMap.values());

	return {
		user: locals.user,
		sessions
	};
};
