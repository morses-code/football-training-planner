import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';
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
		const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
		if (existingUser) {
			return json({ error: 'User with this email already exists' }, { status: 400 });
		}

		// Create user
		const passwordHash = hashPassword(password);
		const userId = crypto.randomUUID();
		
		db.prepare(`
			INSERT INTO users (id, email, password_hash, name, avatar, must_change_password, created_at)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`).run(userId, email, passwordHash, name, avatar || 'user', mustChangePassword ? 1 : 0, Math.floor(Date.now() / 1000));

		return json({ 
			success: true, 
			userId: userId
		});
	} catch (error) {
		console.error('Error creating user:', error);
		return json({ error: 'Failed to create user' }, { status: 500 });
	}
};
