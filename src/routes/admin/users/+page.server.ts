import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user.email !== 'system@example.com') {
		throw redirect(302, '/');
	}

	const users = db.prepare(`
		SELECT id, email, name, avatar, created_at
		FROM users
		ORDER BY created_at DESC
	`).all();

	return {
		user: locals.user,
		users
	};
};
