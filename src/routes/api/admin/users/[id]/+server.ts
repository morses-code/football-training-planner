import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	// Only allow system@example.com to delete users
	if (!locals.user || locals.user.email !== 'system@example.com') {
		return json({ error: 'Unauthorized' }, { status: 403 });
	}

	const userId = params.id;

	// Prevent deleting the admin user
	const user = db.prepare('SELECT email FROM users WHERE id = ?').get(userId) as { email: string } | undefined;
	
	if (!user) {
		return json({ error: 'User not found' }, { status: 404 });
	}

	if (user.email === 'system@example.com') {
		return json({ error: 'Cannot delete admin user' }, { status: 403 });
	}

	try {
		// Delete in correct order to respect foreign key constraints
		
		// 1. Delete coach assignments (references user as coach_id)
		db.prepare('DELETE FROM coach_assignments WHERE coach_id = ?').run(userId);
		
		// 2. Delete training sessions created by this user (and cascade will delete slots and assignments)
		db.prepare('DELETE FROM training_sessions WHERE created_by = ?').run(userId);
		
		// 3. Delete drills created by this user
		db.prepare('DELETE FROM drills WHERE created_by = ?').run(userId);
		
		// 4. Delete user's sessions
		db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
		
		// 5. Finally delete the user
		db.prepare('DELETE FROM users WHERE id = ?').run(userId);

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting user:', error);
		return json({ error: 'Failed to delete user' }, { status: 500 });
	}
};
