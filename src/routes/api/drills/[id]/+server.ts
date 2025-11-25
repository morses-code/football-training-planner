import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { drillsCollection } from '$lib/server/db';

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
		await drillsCollection.doc(params.id).update({
			name,
			description,
			category,
			duration,
			min_players: minPlayers,
			max_players: maxPlayers,
			equipment,
			skill_focus: skillFocus,
			coaching_points: coachingPoints
		});

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
		const drillDoc = await drillsCollection.doc(params.id).get();

		if (!drillDoc.exists) {
			return json({ error: 'Drill not found' }, { status: 404 });
		}

		// Delete the drill
		await drillsCollection.doc(params.id).delete();

		return json({ success: true });
	} catch (e) {
		console.error('Error deleting drill:', e);
		return json({ error: 'Failed to delete drill' }, { status: 500 });
	}
};
