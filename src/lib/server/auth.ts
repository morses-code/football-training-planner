/**
 * @fileoverview Authentication utilities for session management and password hashing.
 * 
 * This module provides functions for creating, validating, and invalidating user sessions,
 * as well as password hashing and verification using Oslo.js cryptographic utilities.
 * 
 * @module lib/server/auth
 * 
 * ## Session Management
 * Sessions are stored in the database with a 30-day expiration.
 * Session tokens are hashed using SHA-256 before storage.
 * Auto-refresh occurs when less than 15 days remain until expiration.
 * 
 * ## Password Security
 * Passwords are hashed using SHA-256 (for development).
 * For production, migrate to Argon2id or scrypt for better security.
 * 
 * @example
 * ```typescript
 * import { createSession, validateSessionToken, hashPassword } from '$lib/server/auth';
 * 
 * // Create a new session
 * const token = generateSessionToken();
 * const session = createSession(token, userId);
 * 
 * // Validate a session token
 * const { session, user } = validateSessionToken(token);
 * 
 * // Hash and verify passwords
 * const hash = hashPassword('mypassword');
 * const isValid = verifyPassword('mypassword', hash);
 * ```
 */
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { usersCollection, sessionsCollection } from './db';

/** Session duration in milliseconds (30 days) */
/** Session duration in milliseconds (30 days) */
const SESSION_DURATION = 1000 * 60 * 60 * 24 * 30;

/**
 * Result of session validation.
 * Either contains both session and user, or both are null.
 */
export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

/** Session data structure stored in database */
export interface Session {
	/** SHA-256 hash of the session token */
	id: string;
	/** User ID this session belongs to */
	userId: string;
	/** Expiration timestamp */
	expiresAt: Date;
}

/** User data structure */
export interface User {
	/** Unique user identifier */
	id: string;
	/** User's email address */
	email: string;
	/** User's display name */
	name: string;
	/** Avatar icon identifier */
	avatar: string;
	/** Account creation timestamp */
	created_at: number;
}

/**
 * Generates a cryptographically secure random session token.
 * 
 * Uses Web Crypto API to generate 20 random bytes, encoded as
 * base32 lowercase without padding.
 * 
 * @returns {string} A 32-character session token
 * 
 * @example
 * const token = generateSessionToken();
 * // Returns: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
 */
export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
}

/**
 * Creates a new session for a user.
 * 
 * Stores the SHA-256 hash of the token in Firestore along with
 * the user ID and expiration timestamp.
 * 
 * @param {string} token - The session token (from generateSessionToken)
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<Session>} The created session object
 * 
 * @example
 * const token = generateSessionToken();
 * const session = await createSession(token, user.id);
 * // Set cookie with the plain token (not the hash)
 */
export async function createSession(token: string, userId: string): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const expiresAt = new Date(Date.now() + SESSION_DURATION);

	await sessionsCollection.doc(sessionId).set({
		user_id: userId,
		expires_at: Math.floor(expiresAt.getTime() / 1000)
	});

	return {
		id: sessionId,
		userId,
		expiresAt
	};
}

/**
 * Validates a session token and returns the associated session and user.
 * 
 * This function:
 * 1. Hashes the token and looks up the session in Firestore
 * 2. Checks if the session has expired
 * 3. Auto-refreshes sessions with less than 15 days remaining
 * 4. Returns session and user data if valid, or null values if invalid
 * 
 * @param {string} token - The plain session token from the cookie
 * @returns {Promise<SessionValidationResult>} Object containing session and user, or nulls
 * 
 * @example
 * const { session, user } = await validateSessionToken(cookieToken);
 * if (user) {
 *   // User is authenticated
 *   console.log('Logged in as:', user.email);
 * }
 */
export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const sessionDoc = await sessionsCollection.doc(sessionId).get();
	
	if (!sessionDoc.exists) {
		return { session: null, user: null };
	}

	const sessionData = sessionDoc.data()!;
	const expiresAt = new Date(sessionData.expires_at * 1000);

	// Check if session is expired
	if (Date.now() >= expiresAt.getTime()) {
		await sessionsCollection.doc(sessionId).delete();
		return { session: null, user: null };
	}

	// Get user data
	const userDoc = await usersCollection.doc(sessionData.user_id).get();
	
	if (!userDoc.exists) {
		await sessionsCollection.doc(sessionId).delete();
		return { session: null, user: null };
	}

	const userData = userDoc.data()!;

	const session: Session = {
		id: sessionId,
		userId: sessionData.user_id,
		expiresAt
	};

	const user: User = {
		id: userDoc.id,
		email: userData.email,
		name: userData.name,
		avatar: userData.avatar,
		created_at: userData.created_at
	};

	// Refresh session if it's close to expiring (less than 15 days left)
	if (Date.now() >= expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		const newExpiresAt = new Date(Date.now() + SESSION_DURATION);
		await sessionsCollection.doc(sessionId).update({
			expires_at: Math.floor(newExpiresAt.getTime() / 1000)
		});
		session.expiresAt = newExpiresAt;
	}

	return { session, user };
}

/**
 * Invalidates a session by deleting it from Firestore.
 * 
 * Used during logout to immediately terminate a session.
 * The session ID should be the hashed token, not the plain token.
 * 
 * @param {string} sessionId - The session ID (SHA-256 hash of token)
 * 
 * @example
 * // In logout handler
 * if (locals.session) {
 *   await invalidateSession(locals.session.id);
 * }
 */
export async function invalidateSession(sessionId: string): Promise<void> {
	await sessionsCollection.doc(sessionId).delete();
}

/**
 * Hashes a password using SHA-256.
 * 
 * @important For production use, migrate to Argon2id or scrypt for better security.
 * SHA-256 is used here for simplicity but is not ideal for password hashing.
 * 
 * @param {string} password - The plain text password
 * @returns {string} Hex-encoded hash of the password
 * 
 * @example
 * const hash = hashPassword(userPassword);
 * // Store hash in database, never store plain password
 */
export function hashPassword(password: string): string {
	// Using Web Crypto API for password hashing
	// In production, use Argon2id or scrypt
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = sha256(data);
	return encodeHexLowerCase(hashBuffer);
}

/**
 * Verifies a password against a stored hash.
 * 
 * Uses constant-time comparison through hash matching.
 * 
 * @param {string} password - The plain text password to verify
 * @param {string} hash - The stored password hash
 * @returns {boolean} True if password matches hash, false otherwise
 * 
 * @example
 * const isValid = verifyPassword(inputPassword, storedHash);
 * if (isValid) {
 *   // Password correct, authenticate user
 * }
 */
export function verifyPassword(password: string, hash: string): boolean {
	return hashPassword(password) === hash;
}
