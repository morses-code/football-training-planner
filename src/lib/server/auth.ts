import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import db from './db';

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 30; // 30 days

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export interface Session {
	id: string;
	userId: string;
	expiresAt: Date;
}

export interface User {
	id: string;
	email: string;
	name: string;
	avatar: string;
}

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
}

export function createSession(token: string, userId: string): Session {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const expiresAt = new Date(Date.now() + SESSION_DURATION);

	const stmt = db.prepare(`
		INSERT INTO sessions (id, user_id, expires_at)
		VALUES (?, ?, ?)
	`);

	stmt.run(sessionId, userId, Math.floor(expiresAt.getTime() / 1000));

	return {
		id: sessionId,
		userId,
		expiresAt
	};
}

export function validateSessionToken(token: string): SessionValidationResult {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const row = db
		.prepare(
			`
		SELECT sessions.id, sessions.user_id, sessions.expires_at,
		       users.id as user_id, users.email, users.name, users.avatar
		FROM sessions
		INNER JOIN users ON sessions.user_id = users.id
		WHERE sessions.id = ?
	`
		)
		.get(sessionId) as
		| {
				id: string;
				user_id: string;
				expires_at: number;
				email: string;
				name: string;
				avatar: string;
		  }
		| undefined;

	if (!row) {
		return { session: null, user: null };
	}

	const session: Session = {
		id: row.id,
		userId: row.user_id,
		expiresAt: new Date(row.expires_at * 1000)
	};

	const user: User = {
		id: row.user_id,
		email: row.email,
		name: row.name,
		avatar: row.avatar
	};

	// Check if session is expired
	if (Date.now() >= session.expiresAt.getTime()) {
		db.prepare('DELETE FROM sessions WHERE id = ?').run(session.id);
		return { session: null, user: null };
	}

	// Refresh session if it's close to expiring (less than 15 days left)
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + SESSION_DURATION);
		db.prepare('UPDATE sessions SET expires_at = ? WHERE id = ?').run(
			Math.floor(session.expiresAt.getTime() / 1000),
			session.id
		);
	}

	return { session, user };
}

export function invalidateSession(sessionId: string): void {
	db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
}

export function hashPassword(password: string): string {
	// Using Web Crypto API for password hashing
	// In production, use Argon2id or scrypt
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = sha256(data);
	return encodeHexLowerCase(hashBuffer);
}

export function verifyPassword(password: string, hash: string): boolean {
	return hashPassword(password) === hash;
}
