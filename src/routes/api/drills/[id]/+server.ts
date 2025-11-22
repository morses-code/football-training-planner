import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';

// Update drill
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const body = await request.json();
	const {
		name,
		description,
		category,
		duration,
		minPlayers,
		maxPlayers,
		equipment,
		skillFocus,
		coachingPoints
	} = body;

	try {
		db.prepare(
			`UPDATE drills 
			 SET name = ?, description = ?, category = ?, duration = ?, 
			     min_players = ?, max_players = ?, equipment = ?, 
			     skill_focus = ?, coaching_points = ?
			 WHERE id = ?`
		).run(
			name,
			description,
			category,
			duration,
			minPlayers,
			maxPlayers,
			equipment,
			skillFocus,
			coachingPoints,
			params.id
		);

		return json({ success: true });
	} catch (e) {
		console.error('Error updating drill:', e);
		return json({ error: 'Failed to update drill' }, { status: 500 });
	}
};

// Delete drill
export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	try {
		// Check if drill exists
		const drill = db.prepare('SELECT id FROM drills WHERE id = ?').get(params.id);

		if (!drill) {
			return json({ error: 'Drill not found' }, { status: 404 });
		}

		// Delete the drill (CASCADE will handle session_slots references)
		db.prepare('DELETE FROM drills WHERE id = ?').run(params.id);

		return json({ success: true });
	} catch (e) {
		console.error('Error deleting drill:', e);
		return json({ error: 'Failed to delete drill' }, { status: 500 });
	}
};
