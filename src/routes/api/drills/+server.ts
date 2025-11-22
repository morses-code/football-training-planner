import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	try {
		const data = await request.json();
		
		const { name, description, duration, category, skillFocus, equipment, instructions, minPlayers, maxPlayers } = data;

		// Validate required fields
		if (!name || !description || !duration || !category) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Insert drill into database
		const stmt = db.prepare(`
			INSERT INTO drills (
				name, description, duration, category, skill_focus, 
				equipment, instructions, min_players, max_players, created_by
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);

		const result = stmt.run(
			name,
			description,
			duration,
			category,
			skillFocus || null,
			equipment || null,
			instructions || null,
			minPlayers || 4,
			maxPlayers || 12,
			locals.user.id
		);

		return json({
			success: true,
			drillId: result.lastInsertRowid
		});
	} catch (error) {
		console.error('Error creating drill:', error);
		return json({ error: 'Failed to create drill' }, { status: 500 });
	}
};

export const GET: RequestHandler = async () => {
	try {
		const drills = db.prepare('SELECT * FROM drills ORDER BY created_at DESC').all();
		return json({ drills });
	} catch (error) {
		console.error('Error fetching drills:', error);
		return json({ error: 'Failed to fetch drills' }, { status: 500 });
	}
};
