<script lang="ts">
	import { onMount } from 'svelte';
	import { uploadFile, getAlbums } from '$lib/upload';
	
	let albums: any[] = [];
	let selectedAlbum = '';
	let caption = '';
	let selectedFile: File | null = null;
	let previewUrl = '';
	let uploading = false;
	let uploadMessage = '';
	let uploadError = '';
	
	onMount(async () => {
		try {
			albums = await getAlbums();
			if (albums.length > 0) {
				selectedAlbum = albums[0].id;
			}
		} catch (error) {
			console.error('Error loading albums:', error);
			uploadError = 'Failed to load albums. Please try again.';
		}
	});
	
	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			selectedFile = file;
			previewUrl = URL.createObjectURL(file);
			uploadError = '';
		}
	}
	
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		const file = event.dataTransfer?.files[0];
		if (file) {
			selectedFile = file;
			previewUrl = URL.createObjectURL(file);
			uploadError = '';
		}
	}
	
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}
	
	async function handleUpload() {
		if (!selectedFile || !selectedAlbum) {
			uploadError = 'Please select a file and an album.';
			return;
		}
		
		uploading = true;
		uploadMessage = '';
		uploadError = '';
		
		try {
			await uploadFile(selectedFile, selectedAlbum, caption || undefined);
			uploadMessage = 'Upload successful!';
			
			// Add to timeline with base64 image
			const reader = new FileReader();
			reader.onload = (e) => {
				const newMemory = {
					id: Date.now(),
					media_url: e.target?.result as string, // Base64 data URL
					caption: caption || '',
					created_at: new Date().toISOString(),
					albums: { title: albums.find(a => a.id === selectedAlbum)?.title || 'New Album' }
				};
				
				// Save to localStorage
				const savedAlbums = localStorage.getItem('uploadedAlbums');
				const timelineAlbums = savedAlbums ? JSON.parse(savedAlbums) : [];
				timelineAlbums.unshift(newMemory);
				localStorage.setItem('uploadedAlbums', JSON.stringify(timelineAlbums));
				
				// Refresh timeline on home page
				if (typeof window !== 'undefined' && (window as any).refreshTimeline) {
					setTimeout(() => {
						(window as any).refreshTimeline();
					}, 1000);
				}
			};
			reader.readAsDataURL(selectedFile);
			
			selectedFile = null;
			previewUrl = '';
			caption = '';
			
			// Refresh timeline on home page
			if (typeof window !== 'undefined' && (window as any).refreshTimeline) {
				setTimeout(() => {
					(window as any).refreshTimeline();
				}, 1000);
			}
		} catch (error) {
			console.error('Upload error:', error);
			uploadError = error instanceof Error ? error.message : 'Failed to upload file.';
		} finally {
			uploading = false;
		}
	}
</script>

<svelte:head>
	<title>Upload - Love Timeline</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="text-center mb-8">
		<h1 class="text-3xl font-bold text-pink-600 mb-2">📸 Upload New Memory</h1>
		<p class="text-gray-600">Share your special moments with your loved one.</p>
	</div>

	<div class="max-w-2xl mx-auto bg-white/90 backdrop-blur rounded-3xl shadow-lg p-8">
		<form on:submit|preventDefault={handleUpload} class="space-y-6">
			<!-- File Dropzone -->
			<div
				class="border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-400 transition-colors duration-200"
				on:drop={handleDrop}
				on:dragover={handleDragOver}
				on:click={() => document.getElementById('fileInput')?.click()}
				role="button"
				tabindex="0"
			>
				<input type="file" id="fileInput" class="hidden" on:change={handleFileSelect} accept="image/*,video/*" />
				{#if previewUrl}
					<img src={previewUrl} alt="Preview" class="max-h-64 object-contain mx-auto mb-4 rounded-lg" />
					<p class="text-gray-700 font-medium">{selectedFile?.name}</p>
				{:else}
					<div class="text-6xl mb-4">⬆️</div>
					<p class="text-gray-700 font-medium mb-2">Drag & drop your photo/video here</p>
					<p class="text-gray-500 text-sm">or click to browse</p>
				{/if}
			</div>

			<!-- Album Selection -->
			<div>
				<label for="albumSelect" class="block text-sm font-medium text-gray-700 mb-2">Select Album</label>
				<select
					id="albumSelect"
					bind:value={selectedAlbum}
					class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200 bg-white/80 backdrop-blur"
					required
				>
					{#each albums as album}
						<option value={album.id}>{album.title}</option>
					{/each}
				</select>
			</div>

			<!-- Caption -->
			<div>
				<label for="captionInput" class="block text-sm font-medium text-gray-700 mb-2">Caption (Optional)</label>
				<input
					id="captionInput"
					bind:value={caption}
					placeholder="Add a sweet caption..."
					type="text"
					class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200 bg-white/80 backdrop-blur"
				/>
			</div>

			{#if uploadError}
				<div class="p-3 bg-red-50 border border-red-200 rounded-2xl">
					<p class="text-red-700 text-sm">⚠️ {uploadError}</p>
				</div>
			{/if}

			{#if uploadMessage}
				<div class="p-3 bg-green-50 border border-green-200 rounded-2xl">
					<p class="text-green-700 text-sm">✅ {uploadMessage}</p>
				</div>
			{/if}

			<button
				type="submit"
				disabled={uploading || !selectedFile || !selectedAlbum}
				class="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{uploading ? 'Uploading...' : 'Upload Memory'}
			</button>
		</form>
	</div>
</div>