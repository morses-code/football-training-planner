import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	
	// Load all drills for selection
	const drills = db.prepare('SELECT * FROM drills ORDER BY category, name').all();
	
	// Load all users (potential coaches)
	const coaches = db.prepare('SELECT id, name, email, avatar FROM users ORDER BY name').all();
	
	return { drills, coaches };
};
