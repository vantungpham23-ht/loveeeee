<script lang="ts">
	import { img } from '$lib/img';
	
	export let path: string;
	export let alt = '';
	export let width = 720;
	export let quality = 70;
</script>

<img
	src={img(path, width, quality)}
	srcset={`${img(path, 360, quality)} 360w, ${img(path, 720, quality)} 720w, ${img(path, 1080, quality)} 1080w`}
	sizes="(max-width:768px) 90vw, 33vw"
	{alt}
	class="rounded-2xl"
	loading="lazy"
	decoding="async"
/>
