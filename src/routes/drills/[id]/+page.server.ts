import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { drillsCollection } from '$lib/server/db';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const drillDoc = await drillsCollection.doc(params.id).get();

	if (!drillDoc.exists) {
		throw error(404, 'Drill not found');
	}

	const drill = {
		id: drillDoc.id,
		...drillDoc.data()
	};

	return {
		drill
	};
};
