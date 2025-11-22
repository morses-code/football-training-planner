import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
	const drill = db
		.prepare(
			`SELECT id, name, description, category, duration, min_players, max_players, 
			        equipment, skill_focus, coaching_points
			 FROM drills 
			 WHERE id = ?`
		)
		.get(params.id) as any;

	if (!drill) {
		throw error(404, 'Drill not found');
	}

	return {
		drill
	};
};
