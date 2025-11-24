/**
 * Server entry point with database initialization
 */

import { handler } from './build/handler.js';
import express from 'express';
import db from './build/server/chunks/db.js';
import { hashPassword } from './build/server/chunks/auth.js';

const app = express();
const port = process.env.PORT || 3000;

// Initialize database
console.log('🔧 Initializing database...');
try {
	const adminUser = db.prepare('SELECT id FROM users WHERE email = ?').get('system@example.com');
	
	if (!adminUser) {
		const adminId = crypto.randomUUID();
		const passwordHash = hashPassword('Admin123!');
		
		db.prepare(`
			INSERT INTO users (id, email, name, password_hash, avatar, created_at)
			VALUES (?, ?, ?, ?, ?, ?)
		`).run(adminId, 'system@example.com', 'System Admin', passwordHash, 'user-circle', Math.floor(Date.now() / 1000));
		
		console.log('✅ Created admin user');
	} else {
		console.log('✅ Admin user exists');
	}
} catch (error) {
	console.error('❌ Error initializing database:', error);
}

// Use SvelteKit handler
app.use(handler);

app.listen(port, () => {
	console.log(`🌐 Server listening on port ${port}`);
});
