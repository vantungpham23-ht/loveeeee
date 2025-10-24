<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase/client';
	import { getCoupleStatus } from '$lib/couple';
	
	let albums: any[] = [];
	let loading = true;
	let error = '';
	let creating = false;
	let newAlbumTitle = '';
	let newAlbumDescription = '';
	let showCreateDialog = false;
	let authLoading = true;
	let user: any = null;
	let coupleStatus: any = null;
	
	onMount(async () => {
		// Check authentication first
		await checkAuthentication();
		
		// Only proceed if user is authenticated and has active couple
		if (!user || !coupleStatus?.isActive) {
			return;
		}
		
		await loadAlbums();
	});
	
	async function checkAuthentication() {
		try {
			authLoading = true;
			const { data: { session }, error } = await supabase.auth.getSession();
			
			if (error || !session || !session.user) {
				goto('/auth');
				return;
			}
			
			user = session.user;
			
			// Check couple status
			coupleStatus = await getCoupleStatus();
			
			// If no couple or couple is pending, redirect to couple setup
			if (!coupleStatus?.hasCouple || coupleStatus?.isPending) {
				goto('/couple');
				return;
			}
			
			// If couple is not active, redirect to couple setup
			if (!coupleStatus?.isActive) {
				goto('/couple');
				return;
			}
			
		} catch (err) {
			console.error('Authentication check failed:', err);
			goto('/auth');
		} finally {
			authLoading = false;
		}
	}
	
	async function loadAlbums() {
		try {
			console.log('Loading albums...');
			
			// Only load albums if we have an active couple
			if (!coupleStatus?.isActive || !coupleStatus?.couple?.id) {
				console.log('No active couple, skipping album load');
				albums = [];
				return;
			}
			
			const { data, error: testError } = await supabase
				.from('albums')
				.select('*')
				.eq('couple_id', coupleStatus.couple.id)
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
					description: newAlbumDescription || null,
					couple_id: coupleStatus.couple.id
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

{#if authLoading}
	<!-- Authentication Loading State -->
	<div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 flex items-center justify-center">
		<div class="text-center">
			<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500 mx-auto mb-6"></div>
			<h2 class="text-2xl font-bold text-gray-700 mb-2">Đang kiểm tra đăng nhập...</h2>
			<p class="text-gray-600">Vui lòng chờ trong giây lát</p>
		</div>
	</div>
{:else if !user || !coupleStatus?.isActive}
	<!-- Redirect to login or couple setup -->
	<div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 flex items-center justify-center">
		<div class="text-center">
			<div class="text-6xl mb-6">🔒</div>
			<h2 class="text-2xl font-bold text-gray-700 mb-2">Chưa đăng nhập hoặc chưa có couple</h2>
			<p class="text-gray-600 mb-6">Vui lòng đăng nhập và setup couple để xem albums</p>
			<a href="/couple" class="inline-block bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
				Setup Couple 💕
			</a>
		</div>
	</div>
{:else}
	<!-- Main Albums Content -->
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
				<div class="text-6xl mb-4">✨</div>
				<h2 class="text-2xl font-semibold text-gray-700 mb-2">No albums yet!</h2>
				<p class="text-gray-500 mb-6">Start by creating your first album.</p>
				<button
					on:click={() => showCreateDialog = true}
					class="btn-primary"
				>
					Create First Album
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each albums as album (album.id)}
					<a href="/albums/{album.id}" class="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden group">
						<div class="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
							{#if album.cover_url}
								<img src={album.cover_url} alt={album.title} class="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-300" />
							{:else}
								<div class="text-6xl text-pink-400">📚</div>
							{/if}
							<div class="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-200"></div>
							<h3 class="relative z-10 text-white text-2xl font-bold text-shadow-md">{album.title}</h3>
						</div>
						<div class="p-4">
							<p class="text-gray-600 text-sm mb-2">{album.description || 'No description'}</p>
							<p class="text-gray-500 text-xs">Created: {new Date(album.created_at).toLocaleDateString()}</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>

	{#if showCreateDialog}
		<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div class="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full">
				<h2 class="text-2xl font-bold text-pink-600 mb-6 text-center">Create New Album</h2>
				<form on:submit|preventDefault={createAlbum} class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
						<input
							bind:value={newAlbumTitle}
							type="text"
							placeholder="e.g., Our First Year"
							required
							class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
						<input
							bind:value={newAlbumDescription}
							type="text"
							placeholder="A brief description of this album"
							class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200"
						/>
					</div>

					<div class="flex justify-end space-x-4 mt-6">
						<button
							type="button"
							on:click={() => showCreateDialog = false}
							class="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors duration-200 font-medium"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={creating}
							class="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
						>
							{creating ? 'Creating...' : 'Create Album'}
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
{/if}