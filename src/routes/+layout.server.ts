import type { LayoutServerLoad } from './$types';
import db from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals }) => {
	let assignmentCount = 0;
	
	if (locals.user) {
		const result = db.prepare(`
			SELECT COUNT(*) as count
			FROM coach_assignments ca
			JOIN training_sessions ts ON ca.session_id = ts.id
			WHERE ca.coach_id = ?
			AND ts.id = (
				SELECT id FROM training_sessions
				WHERE date(session_date || ' ' || start_time) >= datetime('now', 'localtime')
				ORDER BY session_date ASC, start_time ASC
				LIMIT 1
			)
		`).get(locals.user.id) as { count: number } | undefined;
		
		assignmentCount = result?.count || 0;
	}
	
	return {
		user: locals.user,
		assignmentCount
	};
};
