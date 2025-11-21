import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const { name, avatar } = await request.json();

	if (!name || !avatar) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	try {
		db.prepare(
			`
			UPDATE users
			SET name = ?, avatar = ?
			WHERE id = ?
		`
		).run(name, avatar, locals.user.id);

		return json({ success: true, user: { ...locals.user, name, avatar } });
	} catch (error) {
		console.error('Profile update error:', error);
		return json({ error: 'Failed to update profile' }, { status: 500 });
	}
};
