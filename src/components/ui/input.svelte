<script lang="ts">
	export let className = '';
	export let placeholder = '';
	export let value = '';
	export let disabled = false;
	export let required = false;
	export let type = 'text';
</script>

<input
	type={type}
	{placeholder}
	bind:value
	{disabled}
	{required}
	class="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200 {className}"
/>
