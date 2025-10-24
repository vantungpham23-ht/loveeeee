<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	
	onMount(async () => {
		// The auth callback is now handled server-side in hooks.server.ts
		// Just redirect to home
		setTimeout(() => {
			goto('/');
		}, 1000);
	});
</script>

<svelte:head>
	<title>Signing in... - Love Timeline</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-pink-50">
	<div class="text-center">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
		<h2 class="text-xl font-semibold text-gray-700">Signing you in...</h2>
		<p class="text-gray-500 mt-2">Please wait while we complete your login.</p>
	</div>
</div>
