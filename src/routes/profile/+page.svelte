<script lang="ts">
	import { supabase } from '$lib/supabase/client';
	import { onMount } from 'svelte';
	import Button from '../../components/ui/button.svelte';
	
	let user: any = null;
	let loading = true;
	
	onMount(async () => {
		const { data: { session } } = await supabase.auth.getSession();
		user = session?.user;
		loading = false;
	});
	
	async function handleLogout() {
		await supabase.auth.signOut();
		window.location.href = '/auth';
	}
</script>

<svelte:head>
	<title>Profile - Love Timeline</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold text-pink-600 mb-8">👤 Profile</h1>
	
	{#if loading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
		</div>
	{:else if user}
		<div class="max-w-md mx-auto">
			<div class="card text-center">
				<div class="text-6xl mb-4">👤</div>
				<h2 class="text-2xl font-semibold text-gray-800 mb-2">{user.email}</h2>
				<p class="text-gray-600 mb-6">Member since {new Date(user.created_at).toLocaleDateString()}</p>
				
				<Button variant="outline" on:click={handleLogout} class="w-full">
					Sign Out
				</Button>
			</div>
		</div>
	{:else}
		<div class="text-center py-12">
			<div class="text-6xl mb-4">🔒</div>
			<h2 class="text-2xl font-semibold text-gray-700 mb-2">Not signed in</h2>
			<p class="text-gray-500 mb-6">Please sign in to view your profile.</p>
			<a href="/auth" class="btn-primary inline-block">Sign In</a>
		</div>
	{/if}
</div>
