import type { PageServerLoad } from './$types';
import db from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const coaches = db
		.prepare(
			`SELECT id, name, email, avatar, created_at 
			 FROM users 
			 WHERE email != 'system@example.com'
			 ORDER BY name ASC`
		)
		.all() as any[];

	return {
		coaches
	};
};
