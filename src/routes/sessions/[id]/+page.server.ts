import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw error(401, 'Not authenticated');
	}

	const sessionId = params.id;

	// Fetch session details
	const session = db.prepare(`
		SELECT * FROM training_sessions WHERE id = ?
	`).get(sessionId);

	if (!session) {
		throw error(404, 'Session not found');
	}

	// Fetch session slots with drill details
	const slots = db.prepare(`
		SELECT 
			ss.*,
			d.name as drill_name,
			d.description as drill_description,
			d.category as drill_category,
			d.skill_focus as drill_skill_focus,
			d.equipment as drill_equipment,
			d.instructions as drill_instructions,
			d.min_players as drill_min_players,
			d.max_players as drill_max_players,
			d.duration as drill_duration
		FROM session_slots ss
		LEFT JOIN drills d ON ss.drill_id = d.id
		WHERE ss.session_id = ?
		ORDER BY ss.slot_order
	`).all(sessionId);

	// Fetch coach assignments for this session
	const coachAssignments = db.prepare(`
		SELECT 
			ca.*,
			u.name as coach_name,
			u.email as coach_email,
			u.avatar as coach_avatar,
			ss.slot_order
		FROM coach_assignments ca
		JOIN users u ON ca.coach_id = u.id
		LEFT JOIN session_slots ss ON ca.slot_id = ss.id
		WHERE ca.session_id = ?
		ORDER BY ss.slot_order
	`).all(sessionId);

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
