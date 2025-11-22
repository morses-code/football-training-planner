import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	// Fetch sessions with drill counts
	const sessions = db.prepare(`
		SELECT 
			ts.*,
			COUNT(DISTINCT ss.id) as slot_count,
			COUNT(DISTINCT CASE WHEN ss.drill_id IS NOT NULL THEN ss.id END) as drills_assigned
		FROM training_sessions ts
		LEFT JOIN session_slots ss ON ts.id = ss.session_id
		GROUP BY ts.id
		ORDER BY ts.session_date DESC, ts.start_time DESC
		LIMIT 20
	`).all();

	// Get total drills count
	const drillCount = db.prepare('SELECT COUNT(*) as count FROM drills').get() as { count: number };

	return {
		user: locals.user,
		sessions,
		drillCount: drillCount.count
	};
};
