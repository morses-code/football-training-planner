import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const sessionId = params.id;

	// Fetch session details
	const session = db.prepare('SELECT * FROM training_sessions WHERE id = ?').get(sessionId);

	if (!session) {
		throw redirect(302, '/sessions');
	}

	// Fetch session slots with drill details
	const slots = db.prepare(`
		SELECT 
			ss.*,
			d.id as drill_id,
			d.name as drill_name,
			d.category as drill_category
		FROM session_slots ss
		LEFT JOIN drills d ON ss.drill_id = d.id
		WHERE ss.session_id = ?
		ORDER BY ss.slot_order
	`).all(sessionId);

	// Fetch coach assignments
	const coachAssignments = db.prepare(`
		SELECT 
			ca.*,
			u.name as coach_name,
			u.email as coach_email,
			ss.slot_order
		FROM coach_assignments ca
		JOIN users u ON ca.coach_id = u.id
		LEFT JOIN session_slots ss ON ca.slot_id = ss.id
		WHERE ca.session_id = ?
		ORDER BY ss.slot_order
	`).all(sessionId);

	// Load all drills for selection
	const drills = db.prepare('SELECT * FROM drills ORDER BY category, name').all();
	
	// Load all users (potential coaches), excluding system user
	const coaches = db.prepare(`
		SELECT id, name, email, avatar 
		FROM users 
		WHERE email != 'system@example.com'
		ORDER BY name
	`).all();

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
