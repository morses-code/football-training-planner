import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Fetch sessions with drill counts
	const sessions = db.prepare(`
		SELECT 
			ts.*,
			COUNT(DISTINCT ss.id) as slot_count,
			COUNT(DISTINCT CASE WHEN ss.drill_id IS NOT NULL THEN ss.id END) as drills_assigned
		FROM training_sessions ts
		LEFT JOIN session_slots ss ON ts.id = ss.session_id
		WHERE datetime(ts.session_date || ' ' || ts.start_time) >= datetime('now', 'localtime')
		GROUP BY ts.id
		ORDER BY ts.session_date ASC, ts.start_time ASC
		LIMIT 20
	`).all();

	// Get total drills count
	const drillCount = db.prepare('SELECT COUNT(*) as count FROM drills').get() as { count: number };

	// Get past sessions count
	const pastSessionsCount = db.prepare(`
		SELECT COUNT(*) as count 
		FROM training_sessions 
		WHERE datetime(session_date || ' ' || start_time) < datetime('now', 'localtime')
	`).get() as { count: number };

	return {
		user: locals.user,
		sessions,
		drillCount: drillCount.count,
		pastSessionsCount: pastSessionsCount.count
	};
};
