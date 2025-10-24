<script lang="ts">
	import { page } from '$app/stores';
	
	$: currentPath = $page.url.pathname;
	$: hideNav = currentPath.startsWith('/auth') || currentPath.startsWith('/couple');
</script>

{#if !hideNav}
<nav class="fixed bottom-0 inset-x-0 bg-gradient-to-t from-white/98 to-white/95 backdrop-blur-xl border-t border-rose-200/50 flex justify-around py-2 z-50 shadow-lg">
	<a 
		href="/" 
		data-sveltekit-preload-data="off"
		class="flex flex-col items-center text-xs py-2 px-3 rounded-2xl transition-all duration-300 group {currentPath === '/' ? 'text-rose-600 bg-gradient-to-br from-rose-100 to-pink-100 scale-105 shadow-md' : 'text-gray-600 hover:text-rose-500 hover:scale-105 hover:bg-rose-50/50'}"
	>
		<span class="text-lg mb-1 group-hover:animate-bounce">🏠</span>
		<span class="font-medium">Trang Chủ</span>
	</a>
	<a 
		href="/albums" 
		data-sveltekit-preload-data="off"
		class="flex flex-col items-center text-xs py-2 px-3 rounded-2xl transition-all duration-300 group {currentPath.startsWith('/albums') ? 'text-rose-600 bg-gradient-to-br from-rose-100 to-pink-100 scale-105 shadow-md' : 'text-gray-600 hover:text-rose-500 hover:scale-105 hover:bg-rose-50/50'}"
	>
		<span class="text-lg mb-1 group-hover:animate-bounce">📚</span>
		<span class="font-medium">Album</span>
	</a>
	<a 
		href="/upload" 
		data-sveltekit-preload-data="off"
		class="flex flex-col items-center text-xs py-2 px-3 rounded-2xl transition-all duration-300 group {currentPath === '/upload' ? 'text-rose-600 bg-gradient-to-br from-rose-100 to-pink-100 scale-105 shadow-md' : 'text-gray-600 hover:text-rose-500 hover:scale-105 hover:bg-rose-50/50'}"
	>
		<span class="text-lg mb-1 group-hover:animate-bounce">📸</span>
		<span class="font-medium">Tải Lên</span>
	</a>
	<a 
		href="/settings" 
		data-sveltekit-preload-data="off"
		class="flex flex-col items-center text-xs py-2 px-3 rounded-2xl transition-all duration-300 group {currentPath === '/settings' ? 'text-rose-600 bg-gradient-to-br from-rose-100 to-pink-100 scale-105 shadow-md' : 'text-gray-600 hover:text-rose-500 hover:scale-105 hover:bg-rose-50/50'}"
	>
		<span class="text-lg mb-1 group-hover:animate-bounce">⚙️</span>
		<span class="font-medium">Cài Đặt</span>
	</a>
</nav>
{/if}
