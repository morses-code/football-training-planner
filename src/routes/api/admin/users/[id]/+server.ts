import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { usersCollection, sessionsCollection, drillsCollection, trainingSessions, sessionSlotsCollection, coachAssignmentsCollection } from '$lib/server/db';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	// Only allow system@example.com to delete users
	if (!locals.user || locals.user.email !== 'system@example.com') {
		return json({ error: 'Unauthorized' }, { status: 403 });
	}

	const userId = params.id;

	// Prevent deleting the admin user
	const userDoc = await usersCollection.doc(userId).get();
	
	if (!userDoc.exists) {
		return json({ error: 'User not found' }, { status: 404 });
	}

	const userData = userDoc.data()!;
	if (userData.email === 'system@example.com') {
		return json({ error: 'Cannot delete admin user' }, { status: 403 });
	}

	try {
		// Delete in correct order to respect foreign key constraints
		
		// 1. Delete coach assignments (references user as coach_id)
		const coachAssignmentsSnapshot = await coachAssignmentsCollection.where('coach_id', '==', userId).get();
		const coachDeletePromises = coachAssignmentsSnapshot.docs.map(doc => doc.ref.delete());
		await Promise.all(coachDeletePromises);
		
		// 2. Delete training sessions created by this user (and their related data)
		const sessionsSnapshot = await trainingSessions.where('created_by', '==', userId).get();
		for (const sessionDoc of sessionsSnapshot.docs) {
			// Delete session slots for this session
			const slotsSnapshot = await sessionSlotsCollection.where('session_id', '==', sessionDoc.id).get();
			await Promise.all(slotsSnapshot.docs.map(doc => doc.ref.delete()));
			
			// Delete coach assignments for this session
			const assignmentsSnapshot = await coachAssignmentsCollection.where('session_id', '==', sessionDoc.id).get();
			await Promise.all(assignmentsSnapshot.docs.map(doc => doc.ref.delete()));
			
			// Delete the session itself
			await sessionDoc.ref.delete();
		}
		
		// 3. Delete drills created by this user
		const drillsSnapshot = await drillsCollection.where('created_by', '==', userId).get();
		await Promise.all(drillsSnapshot.docs.map(doc => doc.ref.delete()));
		
		// 4. Delete user's sessions
		const userSessionsSnapshot = await sessionsCollection.where('user_id', '==', userId).get();
		await Promise.all(userSessionsSnapshot.docs.map(doc => doc.ref.delete()));
		
		// 5. Finally delete the user
		await usersCollection.doc(userId).delete();

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting user:', error);
		return json({ error: 'Failed to delete user' }, { status: 500 });
	}
};
