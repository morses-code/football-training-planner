/**
 * Seed script to populate database with example drills for Under 6s football training
 * Run with: node --loader ts-node/esm scripts/seed.ts
 */

import db from '../src/lib/server/db';

const exampleDrills = [
	// Warm-up drills
	{
		name: 'Coach Says',
		description: 'Players dribble around an area while listening to commands from the coach. Great for listening skills and ball control.',
		duration: 10,
		category: 'warmup',
		skillFocus: 'Dribbling, Listening, Ball Control',
		equipment: 'Balls, Cones (for area)',
		instructions: `1. Set up a 20x20 yard area with cones
2. Each player has a ball
3. Players dribble around the area
4. Coach calls out commands: "Stop" (freeze with foot on ball), "Go" (start dribbling), "Left foot" (dribble with left), "Right foot" (dribble with right), "Turn" (turn 180 degrees)
5. Players must listen carefully and follow commands
6. Keep heads up while dribbling`,
		minPlayers: 4,
		maxPlayers: 12
	},
	{
		name: 'Red Light Green Light',
		description: 'Classic game adapted for football - players dribble towards a goal line when coach says green light, freeze on red light.',
		duration: 10,
		category: 'warmup',
		skillFocus: 'Dribbling, Ball Control, Stopping',
		equipment: 'Balls, Cones',
		instructions: `1. Create a start line and finish line 20 yards apart
2. Players line up at start line with a ball each
3. When coach says "Green Light", players dribble forward
4. When coach says "Red Light", players must stop with foot on ball
5. Anyone still moving goes back to start
6. First to finish line wins`,
		minPlayers: 4,
		maxPlayers: 12
	},

	// Dribbling drills
	{
		name: 'Cone Weave',
		description: 'Players dribble through a line of cones in a zig-zag pattern. Develops close control and turning.',
		duration: 15,
		category: 'dribbling',
		skillFocus: 'Close Control, Turning, Both Feet',
		equipment: 'Balls, 6-8 Cones per line',
		instructions: `1. Set up 6-8 cones in a straight line, 2 yards apart
2. Players line up at start cone with a ball
3. Dribble in and out of cones using both feet
4. At end, turn and dribble back through
5. Next player starts when previous player reaches 3rd cone
6. Progress: Add speed, use weaker foot only, add competition`,
		minPlayers: 4,
		maxPlayers: 12
	},
	{
		name: 'Sharks and Minnows',
		description: 'Players (minnows) dribble across area while 2-3 sharks try to kick balls out. Last minnow wins.',
		duration: 15,
		category: 'dribbling',
		skillFocus: 'Dribbling Under Pressure, Shielding, Awareness',
		equipment: 'Balls, Cones, Bibs for sharks',
		instructions: `1. Set up 25x25 yard area
2. Select 2-3 sharks (wear bibs, no ball)
3. All other players are minnows (each with ball)
4. Minnows try to dribble from one side to other
5. Sharks try to kick minnows' balls out of area
6. If ball kicked out, that player becomes a shark
7. Last minnow remaining wins`,
		minPlayers: 6,
		maxPlayers: 12
	},

	// Shooting drills
	{
		name: 'Gate Shooting',
		description: 'Players dribble through a gate then shoot at goal. Teaches approach and striking technique.',
		duration: 15,
		category: 'shooting',
		skillFocus: 'Shooting, Accuracy, Approach',
		equipment: 'Balls, 2 Cones for gate, Goal',
		instructions: `1. Place 2 cones 3 yards apart, 10 yards from goal (the gate)
2. Players line up with balls
3. Dribble through the gate
4. After passing through gate, take a shot at goal
5. Retrieve ball and join back of line
6. Progress: Narrow the gate, move gate further out, add defenders`,
		minPlayers: 4,
		maxPlayers: 10
	},
	{
		name: 'Musical Goals',
		description: 'Multiple small goals around area. Players dribble and shoot at any goal when music stops.',
		duration: 15,
		category: 'shooting',
		skillFocus: 'Shooting, Quick Decision Making, Accuracy',
		equipment: 'Balls, 4-6 Small Goals or Cone Goals, Music/Whistle',
		instructions: `1. Set up 4-6 small goals around edge of area
2. Each player has a ball
3. When music plays (or coach says go), players dribble around
4. When music stops (or whistle), players shoot at nearest goal
5. 1 point for scoring
6. First to 5 points wins`,
		minPlayers: 4,
		maxPlayers: 12
	},

	// Passing drills
	{
		name: 'Pass and Follow',
		description: 'Players pass to opposite line and follow their pass. Develops passing accuracy and movement.',
		duration: 15,
		category: 'passing',
		skillFocus: 'Passing, First Touch, Movement',
		equipment: 'Balls, 4 Cones',
		instructions: `1. Set up two lines 10 yards apart with cones
2. Split players into two groups, one at each cone
3. First group has the balls
4. Player with ball passes to player opposite
5. Receiving player controls ball and passes back
6. Both players follow their pass to opposite line
7. Next players go when ball reaches opposite side`,
		minPlayers: 4,
		maxPlayers: 12
	},

	// Small-sided games
	{
		name: '4v4 Game',
		description: 'Small-sided game with small goals. Maximum touches, lots of action, perfect for Under 6s.',
		duration: 20,
		category: 'small_sided',
		skillFocus: 'Game Understanding, All Skills, Decision Making',
		equipment: 'Balls, 2 Small Goals, Bibs, Cones for area',
		instructions: `1. Set up 30x20 yard area with small goals at each end
2. Split into two teams of 4 (use bibs)
3. Play normal football rules simplified for Under 6s
4. No offsides
5. Goal kicks and throw-ins
6. Rotate players every 5 minutes to keep energy high
7. Focus on fun and touches on the ball`,
		minPlayers: 8,
		maxPlayers: 8
	},
	{
		name: '3v3 Game',
		description: 'Even smaller sided game for more touches. Great when player numbers are lower.',
		duration: 20,
		category: 'small_sided',
		skillFocus: 'Game Understanding, All Skills, Teamwork',
		equipment: 'Balls, 2 Small Goals or Cones, Bibs',
		instructions: `1. Set up 25x20 yard area with small goals
2. Teams of 3 players
3. Play normal football - simplified rules
4. No goalkeeper
5. No offsides
6. Encourage passing and movement
7. Stop for coaching points when needed`,
		minPlayers: 6,
		maxPlayers: 6
	},
	{
		name: '2v2 Challenge',
		description: 'Pairs play against each other in small areas. Develops partnerships and quick play.',
		duration: 15,
		category: 'small_sided',
		skillFocus: 'Partnership, Quick Play, Support',
		equipment: 'Balls, Small Goals, Cones, Bibs',
		instructions: `1. Set up multiple 15x15 yard areas with small goals
2. Pairs play 2v2 in each area
3. First to 3 goals wins
4. Winners move up a field, losers move down
5. Emphasize quick passing between partners
6. Celebrate good teamwork`,
		minPlayers: 8,
		maxPlayers: 12
	}
];

function seedDatabase() {
	console.log('🌱 Starting database seed...\n');

	try {
		// Check if drills already exist
		const existingDrills = db.prepare('SELECT COUNT(*) as count FROM drills').get() as { count: number };
		
		if (existingDrills.count > 0) {
			console.log(`⚠️  Database already contains ${existingDrills.count} drills.`);
			console.log('   Clear the database first if you want to re-seed.\n');
			return;
		}

		// Create a system user for seed data if it doesn't exist
		const systemUser = db.prepare('SELECT id FROM users WHERE email = ?').get('system@example.com') as { id: string } | undefined;
		
		let systemUserId: string;
		if (!systemUser) {
			systemUserId = crypto.randomUUID();
			db.prepare(`
				INSERT INTO users (id, email, name, password_hash, avatar)
				VALUES (?, ?, ?, ?, ?)
			`).run(systemUserId, 'system@example.com', 'System', 'none', 'sparkles');
			console.log('✅ Created system user for seed data\n');
		} else {
			systemUserId = systemUser.id;
		}

		// Insert example drills
		const stmt = db.prepare(`
			INSERT INTO drills (
				id, name, description, duration, category, skill_focus,
				equipment, instructions, min_players, max_players, created_by
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`);

		let insertedCount = 0;
		for (const drill of exampleDrills) {
			stmt.run(
				crypto.randomUUID(),
				drill.name,
				drill.description,
				drill.duration,
				drill.category,
				drill.skillFocus,
				drill.equipment,
				drill.instructions,
				drill.minPlayers,
				drill.maxPlayers,
				systemUserId
			);
			insertedCount++;
			console.log(`✅ Added: ${drill.name} (${drill.category})`);
		}

		console.log(`\n🎉 Successfully seeded ${insertedCount} drills!\n`);
		console.log('Breakdown:');
		
		const categories = db.prepare(`
			SELECT category, COUNT(*) as count 
			FROM drills 
			GROUP BY category
		`).all() as Array<{ category: string; count: number }>;

		categories.forEach(cat => {
			console.log(`   ${cat.category}: ${cat.count} drills`);
		});

		console.log('\n✨ Database ready for use!\n');

	} catch (error) {
		console.error('❌ Error seeding database:', error);
		process.exit(1);
	}
}

// Run the seed function
seedDatabase();
