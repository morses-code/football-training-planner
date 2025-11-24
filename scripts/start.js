#!/usr/bin/env node

/**
 * Startup script that initializes the database before starting the server
 */

import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Football Training Planner...\n');

// Initialize database (creates admin user if needed)
console.log('📦 Checking database...');
const initResult = spawnSync('tsx', [join(__dirname, 'init-db.ts')], {
	stdio: 'inherit',
	shell: true
});

if (initResult.status !== 0) {
	console.error('❌ Database initialization failed');
	process.exit(1);
}

// Start the server
console.log('\n🌐 Starting server...\n');
const serverResult = spawnSync('node', [join(__dirname, '../build/index.js')], {
	stdio: 'inherit',
	shell: true,
	env: { ...process.env }
});

process.exit(serverResult.status || 0);
