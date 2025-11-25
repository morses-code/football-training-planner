import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { drillsCollection } from '$lib/server/db';

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

		const drillId = crypto.randomUUID();

		await drillsCollection.doc(drillId).set({
			name,
			description,
			duration,
			category,
			skill_focus: skillFocus || null,
			equipment: equipment || null,
			instructions: instructions || null,
			min_players: minPlayers || 4,
			max_players: maxPlayers || 12,
			created_by: locals.user.id,
			created_at: Math.floor(Date.now() / 1000)
		});

		return json({
			success: true,
			drillId
		});
	} catch (error) {
		console.error('Error creating drill:', error);
		return json({ error: 'Failed to create drill' }, { status: 500 });
	}
};

export const GET: RequestHandler = async () => {
	try {
		const snapshot = await drillsCollection.orderBy('created_at', 'desc').get();
		const drills = snapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		}));
		return json({ drills });
	} catch (error) {
		console.error('Error fetching drills:', error);
		return json({ error: 'Failed to fetch drills' }, { status: 500 });
	}
};
