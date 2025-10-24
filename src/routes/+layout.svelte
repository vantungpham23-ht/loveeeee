<script lang="ts">
	import '../app.css';
	import NavbarTabs from '../components/NavbarTabs.svelte';
</script>

<svelte:head>
	<title>Love Timeline</title>
	<meta name="description" content="Share your love memories" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
	<slot />
</main>

<NavbarTabs />