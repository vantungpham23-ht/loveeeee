import { supabase } from './supabase/client';

export interface Couple {
	id: string;
	user1_id: string;
	user2_id: string | null;
	couple_name: string | null;
	start_date: string | null;
	invite_code: string;
	status: 'pending' | 'active' | 'inactive';
	created_at: string;
	updated_at: string;
}

export interface CoupleWithUsers extends Couple {
	user1: {
		id: string;
		email: string;
	};
	user2?: {
		id: string;
		email: string;
	} | null;
}

/**
 * Generate a random invite code
 */
function generateInviteCode(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < 8; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

/**
 * Get current user's couple information
 */
export async function getCurrentCouple(): Promise<CoupleWithUsers | null> {
	try {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return null;

		// Try to find couple where user is user1 (without .single() to avoid 406 error)
		let { data: couples, error } = await supabase
			.from('couples')
			.select('*')
			.eq('user1_id', user.id);

		let data = couples?.[0] || null;

		// If not found as user1, try as user2
		if (!data) {
			const { data: couples2, error: error2 } = await supabase
				.from('couples')
				.select('*')
				.eq('user2_id', user.id);
			
			data = couples2?.[0] || null;
			error = error2;
		}

		if (error) {
			throw error;
		}

		if (!data) {
			// No couple found
			return null;
		}

		return data as CoupleWithUsers;
	} catch (error) {
		console.error('Error getting current couple:', error);
		return null;
	}
}

/**
 * Create a new couple
 */
export async function createCouple(coupleName?: string, startDate?: string): Promise<Couple | null> {
	try {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error('User not authenticated');

		// Check if user already has a couple
		const existingCouple = await getCurrentCouple();
		if (existingCouple) {
			throw new Error('User already has a couple');
		}

		const inviteCode = generateInviteCode();
		console.log('Creating couple with invite code:', inviteCode);
		
		const { data, error } = await supabase
			.from('couples')
			.insert({
				user1_id: user.id,
				couple_name: coupleName,
				start_date: startDate,
				invite_code: inviteCode,
				status: 'pending'
			})
			.select()
			.single();

		console.log('Couple creation result:', { data, error });

		if (error) throw error;

		return data as Couple;
	} catch (error) {
		console.error('Error creating couple:', error);
		throw error;
	}
}

/**
 * Join a couple using invite code
 */
export async function joinCouple(inviteCode: string): Promise<Couple | null> {
	try {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error('User not authenticated');

		// Check if user already has a couple
		const existingCouple = await getCurrentCouple();
		console.log('Existing couple check:', { existingCouple, userId: user.id });
		if (existingCouple) {
			throw new Error('User already has a couple');
		}

		// Debug: Check all couples in database
		console.log('Debug: Checking all couples in database...');
		const { data: allCouples, error: allCouplesError } = await supabase
			.from('couples')
			.select('*');
		console.log('All couples:', { allCouples, allCouplesError });

		// Find couple by invite code (case insensitive)
		console.log('Searching for invite code:', inviteCode);
		
		// Try exact match first (without .single() to avoid 406 error)
		let { data: couples, error: findError } = await supabase
			.from('couples')
			.select('*')
			.eq('invite_code', inviteCode)
			.eq('status', 'pending');

		let couple = couples?.[0] || null;

		// If not found, try case insensitive
		if (!couple) {
			const { data: data2, error: error2 } = await supabase
				.from('couples')
				.select('*')
				.ilike('invite_code', inviteCode)
				.eq('status', 'pending');
			
			couple = data2?.[0] || null;
			findError = error2;
		}

		console.log('Couple search result:', { couple, findError });

		if (findError) {
			throw findError;
		}

		if (!couple) {
			throw new Error('Invalid invite code');
		}

		// Check if user is trying to join their own couple
		if (couple.user1_id === user.id) {
			throw new Error('Cannot join your own couple');
		}

		// Update couple with user2_id and activate
		const { data, error } = await supabase
			.from('couples')
			.update({
				user2_id: user.id,
				status: 'active'
			})
			.eq('id', couple.id)
			.select()
			.single();

		if (error) throw error;

		return data as Couple;
	} catch (error) {
		console.error('Error joining couple:', error);
		throw error;
	}
}

/**
 * Update couple information
 */
export async function updateCouple(coupleId: string, updates: Partial<Couple>): Promise<Couple | null> {
	try {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error('User not authenticated');

		// Verify user is part of this couple
		const couple = await getCurrentCouple();
		if (!couple || couple.id !== coupleId) {
			throw new Error('Unauthorized to update this couple');
		}

		const { data, error } = await supabase
			.from('couples')
			.update(updates)
			.eq('id', coupleId)
			.select()
			.single();

		if (error) throw error;

		return data as Couple;
	} catch (error) {
		console.error('Error updating couple:', error);
		throw error;
	}
}

/**
 * Leave couple (deactivate)
 */
export async function leaveCouple(): Promise<boolean> {
	try {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error('User not authenticated');

		const couple = await getCurrentCouple();
		if (!couple) {
			throw new Error('No couple found');
		}

		// Update couple status to inactive
		const { error } = await supabase
			.from('couples')
			.update({ status: 'inactive' })
			.eq('id', couple.id);

		if (error) throw error;

		return true;
	} catch (error) {
		console.error('Error leaving couple:', error);
		throw error;
	}
}

/**
 * Get couple status for current user
 */
export async function getCoupleStatus(): Promise<{
	hasCouple: boolean;
	couple: CoupleWithUsers | null;
	isActive: boolean;
	isPending: boolean;
}> {
	try {
		const couple = await getCurrentCouple();
		
		if (!couple) {
			return {
				hasCouple: false,
				couple: null,
				isActive: false,
				isPending: false
			};
		}

		return {
			hasCouple: true,
			couple,
			isActive: couple.status === 'active',
			isPending: couple.status === 'pending'
		};
	} catch (error) {
		console.error('Error getting couple status:', error);
		return {
			hasCouple: false,
			couple: null,
			isActive: false,
			isPending: false
		};
	}
}
