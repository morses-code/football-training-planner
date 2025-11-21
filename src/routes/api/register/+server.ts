import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';
import { hashPassword, generateSessionToken, createSession } from '$lib/server/auth';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { email, name, avatar, password } = await request.json();

	// Validate input
	if (!email || !name || !password) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	if (password.length < 6) {
		return json({ error: 'Password must be at least 6 characters' }, { status: 400 });
	}

	// Check if user already exists
	const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
	if (existingUser) {
		return json({ error: 'Email already registered' }, { status: 400 });
	}

	// Generate user ID
	const userId = encodeBase32LowerCaseNoPadding(crypto.getRandomValues(new Uint8Array(15)));

	// Hash password and create user
	const passwordHash = hashPassword(password);

	try {
		db.prepare(
			`
			INSERT INTO users (id, email, name, password_hash, avatar)
			VALUES (?, ?, ?, ?, ?)
		`
		).run(userId, email, name, passwordHash, avatar || 'user-circle');

		// Create session
		const token = generateSessionToken();
		const session = createSession(token, userId);

		// Set cookie
		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			expires: session.expiresAt
		});

		return json({ success: true, user: { id: userId, email, name, avatar: avatar || 'user-circle' } });
	} catch (error) {
		console.error('Registration error:', error);
		return json({ error: 'Failed to create account' }, { status: 500 });
	}
};
