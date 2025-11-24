/**
 * @fileoverview SQLite database initialization and schema setup.
 * 
 * This module creates and configures a SQLite database for user authentication.
 * Uses better-sqlite3 for synchronous database operations.
 * 
 * @module lib/server/db
 * 
 * ## Database Schema
 * 
 * ### users table
 * - id: TEXT PRIMARY KEY - Unique user identifier
 * - email: TEXT UNIQUE NOT NULL - User's email address
 * - name: TEXT NOT NULL - User's display name
 * - password_hash: TEXT NOT NULL - SHA-256 hashed password
 * - avatar: TEXT NOT NULL - Avatar icon identifier (default: 'user-circle')
 * - created_at: INTEGER NOT NULL - Unix timestamp of account creation
 * 
 * ### sessions table
 * - id: TEXT PRIMARY KEY - Session token hash (SHA-256)
 * - user_id: TEXT NOT NULL - Foreign key to users.id
 * - expires_at: INTEGER NOT NULL - Unix timestamp of session expiration
 * 
 * ## Configuration
 * - WAL mode enabled for better concurrency
 * - Foreign keys enforced (CASCADE on user deletion)
 * - Indexes on user_id and expires_at for session queries
 * 
 * ## Database Location
 * Database file is stored at project root: `app.db`
 * 
 * @example
 * import db from '$lib/server/db';
 * 
 * // Query users
 * const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
 */
import Database from 'better-sqlite3';
import { join } from 'path';

// Use environment variable for database path, fallback to local path
const dbPath = process.env.DATABASE_PATH || join(process.cwd(), 'app.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    avatar TEXT NOT NULL DEFAULT 'user-circle',
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    must_change_password INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

  -- Drills table
  CREATE TABLE IF NOT EXISTS drills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL,
    category TEXT NOT NULL,
    skill_focus TEXT NOT NULL,
    equipment TEXT,
    instructions TEXT,
    min_players INTEGER,
    max_players INTEGER,
    created_by TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Training sessions table
  CREATE TABLE IF NOT EXISTS training_sessions (
    id TEXT PRIMARY KEY,
    session_date INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60,
    notes TEXT,
    created_by TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  -- Session slots table (warmup, drills, small sided games)
  CREATE TABLE IF NOT EXISTS session_slots (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    slot_type TEXT NOT NULL,
    slot_order INTEGER NOT NULL,
    drill_id TEXT,
    duration INTEGER NOT NULL,
    notes TEXT,
    FOREIGN KEY (session_id) REFERENCES training_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (drill_id) REFERENCES drills(id) ON DELETE SET NULL
  );

  -- Coach assignments table
  CREATE TABLE IF NOT EXISTS coach_assignments (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    slot_id TEXT,
    coach_id TEXT NOT NULL,
    role TEXT NOT NULL,
    task_type TEXT,
    FOREIGN KEY (session_id) REFERENCES training_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES session_slots(id) ON DELETE CASCADE,
    FOREIGN KEY (coach_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_drills_category ON drills(category);
  CREATE INDEX IF NOT EXISTS idx_training_sessions_date ON training_sessions(session_date);
  CREATE INDEX IF NOT EXISTS idx_session_slots_session ON session_slots(session_id);
  CREATE INDEX IF NOT EXISTS idx_coach_assignments_session ON coach_assignments(session_id);
  CREATE INDEX IF NOT EXISTS idx_coach_assignments_coach ON coach_assignments(coach_id);
`);

// Initialize admin user if it doesn't exist (for production deployments)
try {
	const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('system@example.com');
	if (!adminExists) {
		// Inline hash function to avoid circular dependency
		const { sha256 } = require('@oslojs/crypto/sha2');
		const { encodeHexLowerCase } = require('@oslojs/encoding');
		const hashPassword = (password: string) => {
			const encoder = new TextEncoder();
			const data = encoder.encode(password);
			const hashBuffer = sha256(data);
			return encodeHexLowerCase(hashBuffer);
		};
		
		const adminId = crypto.randomUUID();
		const passwordHash = hashPassword('Admin123!');
		
		db.prepare(`
			INSERT INTO users (id, email, name, password_hash, avatar, created_at)
			VALUES (?, ?, ?, ?, ?, ?)
		`).run(adminId, 'system@example.com', 'System Admin', passwordHash, 'user-circle', Math.floor(Date.now() / 1000));
		
		console.log('✅ Created admin user: system@example.com');
	}
} catch (error) {
	console.error('Note: Admin user initialization skipped:', error);
}

export default db;
