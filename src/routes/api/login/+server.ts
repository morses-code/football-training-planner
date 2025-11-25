import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { usersCollection, coachAssignmentsCollection } from '$lib/server/db';
import { verifyPassword, generateSessionToken, createSession } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { email, password } = await request.json();

	// Validate input
	if (!email || !password) {
		return json({ error: 'Missing email or password' }, { status: 400 });
	}

	// Find user
	const userSnapshot = await usersCollection.where('email', '==', email).limit(1).get();
	
	if (userSnapshot.empty) {
		return json({ error: 'Invalid email or password' }, { status: 400 });
	}

	const userDoc = userSnapshot.docs[0];
	const userData = userDoc.data();
	
	const user = {
		id: userDoc.id,
		email: userData.email,
		name: userData.name,
		password_hash: userData.password_hash,
		avatar: userData.avatar,
		must_change_password: userData.must_change_password || 0
	};

	// Verify password
	if (!verifyPassword(password, user.password_hash)) {
		return json({ error: 'Invalid email or password' }, { status: 400 });
	}

	// Create session
	const token = generateSessionToken();
	const session = await createSession(token, user.id);

	// Set cookie
	cookies.set('session', token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		expires: session.expiresAt
	});

	// Check if user has any assignments
	const assignmentSnapshot = await coachAssignmentsCollection.where('coach_id', '==', user.id).limit(1).get();

	return json({
		success: true,
		user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
		hasAssignments: !assignmentSnapshot.empty,
		mustChangePassword: user.must_change_password === 1
	});
};
