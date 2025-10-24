<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase/client';
	
	let albums: any[] = [];
	let loading = true;
	let error = '';
	let creating = false;
	let newAlbumTitle = '';
	let newAlbumDescription = '';
	let showCreateDialog = false;
	
	onMount(async () => {
		await loadAlbums();
	});
	
	async function loadAlbums() {
		try {
			console.log('Loading albums...');
			const { data, error: testError } = await supabase
				.from('albums')
				.select('*')
				.order('created_at', { ascending: false });
			
			if (testError) {
				console.error('Supabase error:', testError);
				error = `Database Error: ${testError.message}`;
			} else {
				console.log('Success! Albums:', data);
				albums = data || [];
			}
		} catch (err) {
			console.error('Connection error:', err);
			error = `Connection Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
		} finally {
			loading = false;
		}
	}
	
	async function createAlbum() {
		if (!newAlbumTitle.trim()) return;
		
		creating = true;
		try {
			const { data, error: insertError } = await supabase
				.from('albums')
				.insert({
					title: newAlbumTitle,
					description: newAlbumDescription || null
				})
				.select()
				.single();
			
			if (insertError) {
				console.error('Insert error:', insertError);
				error = `Insert Error: ${insertError.message}`;
			} else {
				console.log('Album created:', data);
				albums = [data, ...albums];
				showCreateDialog = false;
				newAlbumTitle = '';
				newAlbumDescription = '';
				error = '';
			}
		} catch (err) {
			console.error('Create error:', err);
			error = `Create Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
		} finally {
			creating = false;
		}
	}
</script>

<svelte:head>
	<title>Albums - Love Timeline</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-3xl font-bold text-pink-600">📚 Albums</h1>
		<button 
			on:click={() => showCreateDialog = true}
			class="btn-primary"
		>
			Create Album
		</button>
	</div>
	
	{#if loading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
			<span class="ml-3 text-gray-600">Loading albums...</span>
		</div>
	{:else if error}
		<div class="text-center py-12">
			<div class="text-6xl mb-4">⚠️</div>
			<h2 class="text-2xl font-semibold text-gray-700 mb-2">Error</h2>
			<p class="text-red-600 mb-4">{error}</p>
			<button 
				on:click={loadAlbums}
				class="btn-primary"
			>
				Retry
			</button>
		</div>
	{:else if albums.length === 0}
		<div class="text-center py-12">
			<div class="text-6xl mb-4">📸</div>
			<h2 class="text-2xl font-semibold text-gray-700 mb-2">No albums yet</h2>
			<p class="text-gray-500 mb-6">Create your first album to get started!</p>
			<button 
				on:click={() => showCreateDialog = true}
				class="btn-primary"
			>
				Create Your First Album
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each albums as album}
				<a href="/albums/{album.id}" class="block">
					<div class="card hover:shadow-lg transition-shadow duration-200">
						<h3 class="text-xl font-semibold text-gray-800 mb-2">{album.title}</h3>
						{#if album.description}
							<p class="text-gray-600 text-sm">{album.description}</p>
						{/if}
						<p class="text-xs text-gray-500 mt-2">Created: {new Date(album.created_at).toLocaleDateString()}</p>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<!-- Create Album Dialog -->
{#if showCreateDialog}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-2xl p-6 w-full max-w-md">
			<h2 class="text-2xl font-bold text-gray-800 mb-4">Create New Album</h2>
			
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
					<input
						bind:value={newAlbumTitle}
						placeholder="Enter album title"
						type="text"
						class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200"
					/>
				</div>
				
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
					<input
						bind:value={newAlbumDescription}
						placeholder="Enter album description"
						type="text"
						class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200"
					/>
				</div>
			</div>
			
			<div class="flex gap-3 mt-6">
				<button
					on:click={() => showCreateDialog = false}
					class="flex-1 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-2xl transition-colors duration-200"
				>
					Cancel
				</button>
				<button
					on:click={createAlbum}
					disabled={creating || !newAlbumTitle.trim()}
					class="flex-1 btn-primary disabled:opacity-50"
				>
					{creating ? 'Creating...' : 'Create'}
				</button>
			</div>
		</div>
	</div>
{/if}