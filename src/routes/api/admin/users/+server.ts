import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { usersCollection } from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Only allow system@example.com to create users
	if (!locals.user || locals.user.email !== 'system@example.com') {
		return json({ error: 'Unauthorized' }, { status: 403 });
	}

	try {
		const { email, password, name, avatar, mustChangePassword } = await request.json();

		// Validate input
		if (!email || !password || !name) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		if (password.length < 6) {
			return json({ error: 'Password must be at least 6 characters' }, { status: 400 });
		}

		// Check if user already exists
		const existingUserSnapshot = await usersCollection.where('email', '==', email).limit(1).get();
		if (!existingUserSnapshot.empty) {
			return json({ error: 'User with this email already exists' }, { status: 400 });
		}

		// Create user
		const passwordHash = hashPassword(password);
		const userId = crypto.randomUUID();
		
		await usersCollection.doc(userId).set({
			email,
			password_hash: passwordHash,
			name,
			avatar: avatar || 'user',
			must_change_password: mustChangePassword ? 1 : 0,
			created_at: Math.floor(Date.now() / 1000)
		});

		return json({ 
			success: true, 
			userId: userId
		});
	} catch (error) {
		console.error('Error creating user:', error);
		return json({ error: 'Failed to create user' }, { status: 500 });
	}
};
