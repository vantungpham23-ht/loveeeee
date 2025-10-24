<script lang="ts">
	import { img } from '$lib/img';
	import dayjs from 'dayjs';
	
	export let memory: any;
	
	$: formattedDate = dayjs(memory.created_at).format('DD/MM/YYYY HH:mm');
</script>

<div class="card mb-4">
	<div class="mb-3">
		<img
			src={img(memory.media_url, 720, 70)}
			alt={memory.caption || 'Memory'}
			class="w-full h-64 object-cover rounded-2xl"
			loading="lazy"
		/>
	</div>
	
	{#if memory.caption}
		<p class="text-gray-700 mb-2">{memory.caption}</p>
	{/if}
	
	<div class="text-sm text-gray-500 flex items-center">
		<span class="mr-2">📅</span>
		<span>{formattedDate}</span>
	</div>
</div>