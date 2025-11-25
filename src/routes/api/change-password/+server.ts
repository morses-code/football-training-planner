import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { usersCollection } from '$lib/server/db';
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
		const userDoc = await usersCollection.doc(locals.user.id).get();

		if (!userDoc.exists) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		const userData = userDoc.data()!;

		// Verify current password
		if (!verifyPassword(currentPassword, userData.password_hash)) {
			return json({ error: 'Current password is incorrect' }, { status: 400 });
		}

		// Update password and clear must_change_password flag
		const newPasswordHash = hashPassword(newPassword);
		await usersCollection.doc(locals.user.id).update({
			password_hash: newPasswordHash,
			must_change_password: 0
		});

		return json({ success: true });
	} catch (error) {
		console.error('Error changing password:', error);
		return json({ error: 'Failed to change password' }, { status: 500 });
	}
};
