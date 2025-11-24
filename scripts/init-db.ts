/**
 * Database initialization script for production deployment
 * Creates admin user and example drills
 */

import db from '../src/lib/server/db.js';
import { hashPassword } from '../src/lib/server/auth.js';

console.log('🔧 Initializing database...\n');

try {
	// Check if admin user exists
	const adminUser = db.prepare('SELECT id FROM users WHERE email = ?').get('system@example.com') as { id: string } | undefined;
	
	if (!adminUser) {
		const adminId = crypto.randomUUID();
		const passwordHash = hashPassword('Admin123!');
		
		db.prepare(`
			INSERT INTO users (id, email, name, password_hash, avatar, created_at)
			VALUES (?, ?, ?, ?, ?, ?)
		`).run(adminId, 'system@example.com', 'System Admin', passwordHash, 'user-circle', Math.floor(Date.now() / 1000));
		
		console.log('✅ Created admin user: system@example.com / Admin123!\n');
	} else {
		console.log('✅ Admin user already exists\n');
	}
	
	console.log('✨ Database initialized successfully!\n');
	
} catch (error) {
	console.error('❌ Error initializing database:', error);
	process.exit(1);
}
