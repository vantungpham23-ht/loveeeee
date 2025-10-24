<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getMemories, getAlbums } from '$lib/upload';
	import TimelineCard from '../../../components/TimelineCard.svelte';
	import dayjs from 'dayjs';
	
	let memories: any[] = [];
	let album: any = null;
	let loading = true;
	
	$: albumId = $page.params.id;
	
	onMount(async () => {
		if (!albumId) return;
		
		try {
			const [memoriesData, albumsData] = await Promise.all([
				getMemories(albumId),
				getAlbums()
			]);
			
			memories = memoriesData;
			album = albumsData.find((a: any) => a.id === albumId);
		} catch (error) {
			console.error('Error loading album:', error);
		} finally {
			loading = false;
		}
	});
	
	// Group memories by month/year
	$: groupedMemories = memories.reduce((groups: any, memory: any) => {
		const date = dayjs(memory.created_at);
		const key = date.format('YYYY-MM');
		if (!groups[key]) {
			groups[key] = [];
		}
		groups[key].push(memory);
		return groups;
	}, {});
	
	$: sortedGroups = Object.entries(groupedMemories).sort(([a], [b]) => b.localeCompare(a));
</script>

<svelte:head>
	<title>{album?.title || 'Album'} - Love Timeline</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	{#if loading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
		</div>
	{:else if !album}
		<div class="text-center py-12">
			<div class="text-6xl mb-4">😞</div>
			<h2 class="text-2xl font-semibold text-gray-700 mb-2">Album not found</h2>
			<p class="text-gray-500 mb-6">The album you're looking for doesn't exist.</p>
			<a href="/albums" class="btn-primary inline-block">Back to Albums</a>
		</div>
	{:else}
		<div class="mb-8">
			<a href="/albums" class="text-pink-600 hover:text-pink-700 mb-4 inline-block">
				← Back to Albums
			</a>
			
			<h1 class="text-3xl font-bold text-pink-600 mb-2">{album.title}</h1>
			{#if album.description}
				<p class="text-gray-600">{album.description}</p>
			{/if}
		</div>
		
		{#if memories.length === 0}
			<div class="text-center py-12">
				<div class="text-6xl mb-4">📸</div>
				<h2 class="text-2xl font-semibold text-gray-700 mb-2">No memories yet</h2>
				<p class="text-gray-500 mb-6">Start adding photos and videos to this album!</p>
				<a href="/upload" class="btn-primary inline-block">Add Memory</a>
			</div>
		{:else}
			{#each sortedGroups as [monthKey, monthMemories]}
				<div class="mb-8">
					<h2 class="text-xl font-semibold text-gray-700 mb-4 sticky top-4 bg-pink-50 py-2 px-4 rounded-2xl">
						{dayjs(monthKey).format('MMMM YYYY')}
					</h2>
					
					<div class="space-y-4">
						{#each monthMemories as memory}
							<TimelineCard {memory} />
						{/each}
					</div>
				</div>
			{/each}
		{/if}
	{/if}
</div>
