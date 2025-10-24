<script lang="ts">
	import { img } from '$lib/img';
	import dayjs from 'dayjs';
	
	export let memory: any;
	
	$: formattedDate = dayjs(memory.created_at).format('DD/MM/YYYY HH:mm');
	$: imageUrl = memory.media_url ? img(memory.media_url, 720, 70) : null;
</script>

<div class="card mb-4">
	{#if imageUrl}
		<div class="mb-3">
			<img
				src={imageUrl}
				alt={memory.caption || 'Memory'}
				class="w-full h-64 object-cover rounded-2xl"
				loading="lazy"
				on:error={(e) => {
					console.log('Image failed to load:', imageUrl);
					const target = e.target;
					if (target instanceof HTMLImageElement) {
						target.style.display = 'none';
					}
				}}
			/>
		</div>
	{/if}
	
	<div class="text-center mb-3">
		<h3 class="font-bold text-gray-800 text-lg mb-2">{memory.albums?.title || 'Kỷ niệm'}</h3>
		<span class="text-sm text-gray-500 bg-white/60 px-3 py-1 rounded-full font-medium">
			{dayjs(memory.created_at).format('DD/MM/YYYY')}
		</span>
	</div>
	
	{#if memory.caption}
		<p class="text-gray-700 mb-2 text-center">{memory.caption}</p>
	{/if}
</div>