import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Fetch all drills from database
	const drills = db.prepare('SELECT * FROM drills ORDER BY created_at DESC').all();
	
	return {
		user: locals.user,
		drills
	};
};
