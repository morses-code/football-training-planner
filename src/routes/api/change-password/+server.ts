import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';
import { verifyPassword, hashPassword } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	try {
		const { currentPassword, newPassword } = await request.json();

		if (!currentPassword || !newPassword) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		if (newPassword.length < 6) {
			return json({ error: 'Password must be at least 6 characters' }, { status: 400 });
		}

		// Get current user
		const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(locals.user.id) as 
			{ password_hash: string } | undefined;

		if (!user) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		// Verify current password
		if (!verifyPassword(currentPassword, user.password_hash)) {
			return json({ error: 'Current password is incorrect' }, { status: 400 });
		}

		// Update password and clear must_change_password flag
		const newPasswordHash = hashPassword(newPassword);
		db.prepare(`
			UPDATE users 
			SET password_hash = ?, must_change_password = 0 
			WHERE id = ?
		`).run(newPasswordHash, locals.user.id);

		return json({ success: true });
	} catch (error) {
		console.error('Error changing password:', error);
		return json({ error: 'Failed to change password' }, { status: 500 });
	}
};
