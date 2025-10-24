<script lang="ts">
	import { cn } from '$lib/utils';
	
	export let className = '';
</script>

<div class={cn('rounded-2xl border bg-white text-gray-900 shadow-soft', className)}>
	<slot />
</div>
