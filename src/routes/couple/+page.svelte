<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase/client';
	import { getCoupleStatus, createCouple, joinCouple } from '$lib/couple';
	import type { CoupleWithUsers } from '$lib/couple';
	
	let loading = true;
	let coupleStatus: {
		hasCouple: boolean;
		couple: CoupleWithUsers | null;
		isActive: boolean;
		isPending: boolean;
	} | null = null;
	
	let showCreateForm = false;
	let showJoinForm = false;
	let creating = false;
	let joining = false;
	let error = '';
	let success = '';
	
	// Create couple form
	let coupleName = '';
	let startDate = '';
	
	// Join couple form
	let inviteCode = '';
	
	onMount(async () => {
		await checkCoupleStatus();
	});
	
	async function checkCoupleStatus() {
		try {
			loading = true;
			coupleStatus = await getCoupleStatus();
			
			// If couple is active, redirect to home
			if (coupleStatus?.isActive) {
				goto('/');
				return;
			}
		} catch (err) {
			console.error('Error checking couple status:', err);
			error = 'Failed to check couple status';
		} finally {
			loading = false;
		}
	}
	
	async function handleCreateCouple() {
		if (!coupleName.trim()) {
			error = 'Please enter a couple name';
			return;
		}
		
		try {
			creating = true;
			error = '';
			success = '';
			
			const couple = await createCouple(coupleName.trim(), startDate || undefined);
			
			if (couple) {
				success = `Couple "${coupleName}" created successfully! Share this invite code with your partner: ${couple.invite_code}`;
				showCreateForm = false;
				coupleName = '';
				startDate = '';
				
				// Refresh couple status
				await checkCoupleStatus();
			}
		} catch (err: any) {
			error = err.message || 'Failed to create couple';
		} finally {
			creating = false;
		}
	}
	
	async function handleJoinCouple() {
		if (!inviteCode.trim()) {
			error = 'Please enter an invite code';
			return;
		}
		
		try {
			joining = true;
			error = '';
			success = '';
			
			const couple = await joinCouple(inviteCode.trim().toUpperCase());
			
			if (couple) {
				success = 'Successfully joined the couple! Redirecting to timeline...';
				showJoinForm = false;
				inviteCode = '';
				
				// Redirect to home after successful join
				setTimeout(() => {
					goto('/');
				}, 2000);
			}
		} catch (err: any) {
			error = err.message || 'Failed to join couple';
		} finally {
			joining = false;
		}
	}
	
	function copyInviteCode(code: string) {
		navigator.clipboard.writeText(code);
		success = 'Invite code copied to clipboard!';
	}
</script>

<svelte:head>
	<title>Couple Setup - Love Timeline</title>
	<meta name="description" content="Create or join a couple to start sharing memories" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 flex items-center justify-center px-4">
	<div class="max-w-md w-full">
		{#if loading}
			<!-- Loading State -->
			<div class="text-center">
				<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500 mx-auto mb-6"></div>
				<h2 class="text-2xl font-bold text-gray-700 mb-2">Checking couple status...</h2>
				<p class="text-gray-600">Please wait while we check your couple information</p>
			</div>
		{:else if coupleStatus?.isActive}
			<!-- Active Couple - Should redirect but show fallback -->
			<div class="text-center">
				<div class="text-6xl mb-6">💕</div>
				<h2 class="text-2xl font-bold text-gray-700 mb-2">Couple Active!</h2>
				<p class="text-gray-600 mb-6">Redirecting to your timeline...</p>
				<a href="/" class="inline-block bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
					Go to Timeline 💕
				</a>
			</div>
		{:else if coupleStatus?.isPending}
			<!-- Pending Couple -->
			<div class="bg-white rounded-3xl shadow-lg p-8">
				<div class="text-center mb-6">
					<div class="text-6xl mb-4">⏳</div>
					<h2 class="text-2xl font-bold text-gray-700 mb-2">Waiting for Partner</h2>
					<p class="text-gray-600">Your couple "{coupleStatus.couple?.couple_name}" is waiting for your partner to join</p>
				</div>
				
				{#if coupleStatus.couple?.invite_code}
					<div class="bg-rose-50 rounded-2xl p-4 mb-6">
						<h3 class="font-semibold text-gray-700 mb-2">Share this invite code:</h3>
						<div class="flex items-center justify-between bg-white rounded-xl p-3 border border-rose-200">
							<code class="text-lg font-mono font-bold text-rose-600">{coupleStatus.couple.invite_code}</code>
							<button
								on:click={() => copyInviteCode(coupleStatus.couple!.invite_code)}
								class="text-rose-500 hover:text-rose-600 transition-colors"
							>
								📋
							</button>
						</div>
					</div>
				{/if}
				
				<div class="text-center">
					<p class="text-sm text-gray-500 mb-4">Your partner needs to enter this code to join your couple</p>
					<button
						on:click={() => goto('/')}
						class="text-gray-500 hover:text-gray-700 transition-colors"
					>
						← Back to Timeline
					</button>
				</div>
			</div>
		{:else}
			<!-- No Couple - Show Setup Options -->
			<div class="text-center mb-8">
				<div class="text-6xl mb-4">💖</div>
				<h1 class="text-3xl font-bold text-pink-600 mb-2">Welcome to Love Timeline</h1>
				<p class="text-gray-600">Create or join a couple to start sharing your memories together</p>
			</div>
			
			<div class="space-y-4">
				<!-- Create Couple Button -->
				<button
					on:click={() => { showCreateForm = true; showJoinForm = false; error = ''; success = ''; }}
					class="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
				>
					Create New Couple 💕
				</button>
				
				<!-- Join Couple Button -->
				<button
					on:click={() => { showJoinForm = true; showCreateForm = false; error = ''; success = ''; }}
					class="w-full bg-white border-2 border-rose-300 text-rose-600 hover:bg-rose-50 px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
				>
					Join Existing Couple 💖
				</button>
			</div>
			
			<!-- Create Couple Form -->
			{#if showCreateForm}
				<div class="mt-8 bg-white rounded-3xl shadow-lg p-6">
					<h3 class="text-xl font-bold text-gray-700 mb-4">Create New Couple</h3>
					<form on:submit|preventDefault={handleCreateCouple} class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Couple Name</label>
							<input
								bind:value={coupleName}
								type="text"
								placeholder="e.g., John & Jane"
								required
								class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-colors duration-200"
							/>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Start Date (Optional)</label>
							<input
								bind:value={startDate}
								type="date"
								class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-colors duration-200"
							/>
						</div>
						
						<div class="flex space-x-3">
							<button
								type="button"
								on:click={() => { showCreateForm = false; coupleName = ''; startDate = ''; error = ''; success = ''; }}
								class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={creating}
								class="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
							>
								{creating ? 'Creating...' : 'Create Couple'}
							</button>
						</div>
					</form>
				</div>
			{/if}
			
			<!-- Join Couple Form -->
			{#if showJoinForm}
				<div class="mt-8 bg-white rounded-3xl shadow-lg p-6">
					<h3 class="text-xl font-bold text-gray-700 mb-4">Join Existing Couple</h3>
					<form on:submit|preventDefault={handleJoinCouple} class="space-y-4">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Invite Code</label>
							<input
								bind:value={inviteCode}
								type="text"
								placeholder="Enter 8-character code"
								required
								maxlength="8"
								class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-colors duration-200 text-center font-mono text-lg"
							/>
							<p class="text-sm text-gray-500 mt-2">Ask your partner for the invite code</p>
						</div>
						
						<div class="flex space-x-3">
							<button
								type="button"
								on:click={() => { showJoinForm = false; inviteCode = ''; error = ''; success = ''; }}
								class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={joining}
								class="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
							>
								{joining ? 'Joining...' : 'Join Couple'}
							</button>
						</div>
					</form>
				</div>
			{/if}
		{/if}
		
		<!-- Error/Success Messages -->
		{#if error}
			<div class="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
				<p class="text-red-700 text-sm">⚠️ {error}</p>
			</div>
		{/if}
		
		{#if success}
			<div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
				<p class="text-green-700 text-sm">✅ {success}</p>
			</div>
		{/if}
	</div>
</div>
