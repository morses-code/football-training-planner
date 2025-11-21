import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/server/db';
import { verifyPassword, generateSessionToken, createSession } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { email, password } = await request.json();

	// Validate input
	if (!email || !password) {
		return json({ error: 'Missing email or password' }, { status: 400 });
	}

	// Find user
	const user = db
		.prepare(
			`
		SELECT id, email, name, password_hash, avatar
		FROM users
		WHERE email = ?
	`
		)
		.get(email) as
		| { id: string; email: string; name: string; password_hash: string; avatar: string }
		| undefined;

	if (!user) {
		return json({ error: 'Invalid email or password' }, { status: 400 });
	}

	// Verify password
	if (!verifyPassword(password, user.password_hash)) {
		return json({ error: 'Invalid email or password' }, { status: 400 });
	}

	// Create session
	const token = generateSessionToken();
	const session = createSession(token, user.id);

	// Set cookie
	cookies.set('session', token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		expires: session.expiresAt
	});

	return json({
		success: true,
		user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar }
	});
};
