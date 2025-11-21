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

const db = new Database(join(process.cwd(), 'app.db'));

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
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
`);

export default db;
