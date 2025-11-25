import type { Handle } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');

	if (!token) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);

	if (session) {
		// Refresh the cookie expiration
		event.cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			expires: session.expiresAt
		});
	}

	event.locals.session = session;
	event.locals.user = user;

	const response = await resolve(event);
	
	// Add cache-control headers to all pages to ensure fresh data on back/forward navigation
	response.headers.set('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
	response.headers.set('pragma', 'no-cache');
	response.headers.set('expires', '0');
	
	return response;
};
