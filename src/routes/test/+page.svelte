<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase/client';
	
	let status = 'Testing...';
	let error = '';
	let albumsCount = 0;
	
	onMount(async () => {
		try {
			console.log('Testing Supabase connection...');
			
			// Test 1: Basic connection
			const { data, error: testError } = await supabase
				.from('albums')
				.select('count', { count: 'exact', head: true });
			
			if (testError) {
				status = 'Error';
				error = testError.message;
				console.error('Supabase error:', testError);
			} else {
				status = 'Success';
				albumsCount = data?.length || 0;
				console.log('Connection successful, albums count:', albumsCount);
			}
		} catch (err) {
			status = 'Failed';
			error = err instanceof Error ? err.message : 'Unknown error';
			console.error('Connection error:', err);
		}
	});
</script>

<svelte:head>
	<title>Supabase Test</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-2xl font-bold text-pink-600 mb-4">Supabase Connection Test</h1>
	
	<div class="card">
		<p><strong>Status:</strong> {status}</p>
		{#if error}
			<p class="text-red-600"><strong>Error:</strong> {error}</p>
		{/if}
		{#if status === 'Success'}
			<p class="text-green-600">✅ Connected to Supabase!</p>
			<p>Albums count: {albumsCount}</p>
		{/if}
	</div>
	
	<div class="mt-4">
		<a href="/" class="btn-primary">Back to Home</a>
	</div>
</div>