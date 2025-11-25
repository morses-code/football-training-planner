/**
 * @fileoverview Firestore database initialization and configuration.
 * 
 * This module creates and configures a Firestore client for persistent data storage.
 * Uses @google-cloud/firestore for document-based operations.
 * 
 * @module lib/server/db
 * 
 * ## Collections
 * 
 * ### users
 * - id: string - Unique user identifier (document ID)
 * - email: string - User's email address (unique)
 * - name: string - User's display name
 * - password_hash: string - SHA-256 hashed password
 * - avatar: string - Avatar icon identifier (default: 'user-circle')
 * - created_at: number - Unix timestamp of account creation
 * - must_change_password: number - 0 or 1 flag
 * 
 * ### sessions
 * - id: string - Session token hash (document ID)
 * - user_id: string - Reference to users document
 * - expires_at: number - Unix timestamp of session expiration
 * 
 * ### drills
 * - id: string - Unique drill identifier (document ID)
 * - name: string - Drill name
 * - description: string - Drill description
 * - duration: number - Duration in minutes
 * - category: string - Drill category
 * - skill_focus: string - Primary skill focus
 * - equipment: string - Required equipment
 * - instructions: string - Detailed instructions
 * - min_players: number - Minimum players
 * - max_players: number - Maximum players
 * - created_by: string - User ID who created drill
 * - created_at: number - Unix timestamp
 * 
 * ### training_sessions
 * - id: string - Unique session identifier (document ID)
 * - session_date: number - Unix timestamp of session date
 * - start_time: string - Session start time
 * - duration: number - Duration in minutes
 * - notes: string - Session notes
 * - created_by: string - User ID who created session
 * - created_at: number - Unix timestamp
 * 
 * ### session_slots
 * - id: string - Unique slot identifier (document ID)
 * - session_id: string - Reference to training_sessions
 * - slot_type: string - Type of slot (warmup, drill, game)
 * - slot_order: number - Order in session
 * - drill_id: string - Reference to drills (optional)
 * - duration: number - Slot duration in minutes
 * - notes: string - Slot notes
 * 
 * ### coach_assignments
 * - id: string - Unique assignment identifier (document ID)
 * - session_id: string - Reference to training_sessions
 * - slot_id: string - Reference to session_slots (optional)
 * - coach_id: string - Reference to users
 * - role: string - Coach role
 * - task_type: string - Task type
 * 
 * @example
 * import { db, usersCollection } from '$lib/server/db';
 * 
 * // Query users
 * const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
 */
import { Firestore } from '@google-cloud/firestore';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

// Initialize Firestore
const db = new Firestore({
	projectId: process.env.GCP_PROJECT || 'football-training-planner',
	// In Cloud Run, credentials are automatically provided
	// For local development, use GOOGLE_APPLICATION_CREDENTIALS env var
});

// Collection references
export const usersCollection = db.collection('users');
export const sessionsCollection = db.collection('sessions');
export const drillsCollection = db.collection('drills');
export const trainingSessions = db.collection('training_sessions');
export const sessionSlotsCollection = db.collection('session_slots');
export const coachAssignmentsCollection = db.collection('coach_assignments');

// Initialize admin user if it doesn't exist (for production deployments)
async function initializeAdminUser() {
	try {
		const adminSnapshot = await usersCollection.where('email', '==', 'system@example.com').limit(1).get();
		
		if (adminSnapshot.empty) {
			const adminPassword = process.env.ADMIN_PASSWORD;
			if (!adminPassword) {
				console.error('⚠️ ADMIN_PASSWORD environment variable not set - skipping admin user creation');
			} else {
				// Hash password
				const hashPassword = (password: string) => {
					const encoder = new TextEncoder();
					const data = encoder.encode(password);
					const hashBuffer = sha256(data);
					return encodeHexLowerCase(hashBuffer);
				};
				
				const adminId = crypto.randomUUID();
				const passwordHash = hashPassword(adminPassword);
				
				await usersCollection.doc(adminId).set({
					email: 'system@example.com',
					name: 'System Admin',
					password_hash: passwordHash,
					avatar: 'user-circle',
					created_at: Math.floor(Date.now() / 1000),
					must_change_password: 0
				});
				
				console.log('✅ Created admin user: system@example.com');
			}
		}
	} catch (error) {
		console.error('⚠️ Admin user initialization error:', error);
	}
}

// Initialize admin user (non-blocking)
initializeAdminUser();

export { db };
