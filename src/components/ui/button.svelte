<script lang="ts">
	import { cn } from '$lib/utils';
	
	export let className = '';
	export let variant: 'default' | 'outline' = 'default';
	export let href: string | undefined = undefined;
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	
	const variants = {
		default: 'bg-pink-500 text-white hover:bg-pink-600',
		outline: 'border border-gray-200 bg-white hover:bg-gray-50'
	};
</script>

{#if href}
	<a 
		{href}
		class={cn(
			'inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:pointer-events-none disabled:opacity-50 px-4 py-2',
			variants[variant],
			className
		)}
	>
		<slot />
	</a>
{:else}
	<button
		{type}
		{disabled}
		class={cn(
			'inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 disabled:pointer-events-none disabled:opacity-50 px-4 py-2',
			variants[variant],
			className
		)}
	>
		<slot />
	</button>
{/if}