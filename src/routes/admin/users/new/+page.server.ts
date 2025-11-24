import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user.email !== 'system@example.com') {
		throw redirect(302, '/');
	}

	return {
		user: locals.user
	};
};
