<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	
	export let startDate: string;
	
	let daysCount = 0;
	let hoursCount = 0;
	let minutesCount = 0;
	let secondsCount = 0;
	let timerInterval: NodeJS.Timeout;
	
	onMount(() => {
		if (startDate) {
			startLoveTimer();
		}
	});
	
	onDestroy(() => {
		if (timerInterval) {
			clearInterval(timerInterval);
		}
	});
	
	function parseDate(dateStr: string): Date {
		// Handle DD/MM/YYYY format
		if (dateStr.includes('/')) {
			const parts = dateStr.split('/');
			if (parts.length === 3) {
				const day = parseInt(parts[0]);
				const month = parseInt(parts[1]) - 1; // JavaScript months are 0-indexed
				const year = parseInt(parts[2]);
				return new Date(year, month, day);
			}
		}
		// Handle YYYY-MM-DD format
		return new Date(dateStr);
	}
	
	function startLoveTimer() {
		console.log('Start date received:', startDate);
		const parsedStartDate = parseDate(startDate);
		console.log('Parsed start date:', parsedStartDate);
		console.log('Current date:', new Date());
		
		timerInterval = setInterval(() => {
			const now = new Date();
			const start = parseDate(startDate);
			const diffMs = now.getTime() - start.getTime();
			
			console.log('Time difference in ms:', diffMs);
			console.log('Time difference in days:', Math.floor(diffMs / (1000 * 60 * 60 * 24)));
			
			// Calculate time units
			const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
			
			// Update reactive variables
			daysCount = days;
			hoursCount = hours;
			minutesCount = minutes;
			secondsCount = seconds;
		}, 1000);
		
		// Initial calculation
		const now = new Date();
		const start = parseDate(startDate);
		const diffMs = now.getTime() - start.getTime();
		
		daysCount = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		hoursCount = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		minutesCount = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
		secondsCount = Math.floor((diffMs % (1000 * 60)) / 1000);
	}
</script>

<div class="relative bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 overflow-hidden">
	<!-- Header -->
	<div class="text-center mb-4">
		<h3 class="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
			⏰ Thời Gian Yêu Nhau
		</h3>
		<p class="text-gray-600 font-medium">Từ ngày bắt đầu đến hiện tại</p>
	</div>
	
	<!-- Timer Display -->
	<div class="flex items-center justify-center space-x-3 mb-4">
		<div class="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 min-w-[80px] shadow-lg border border-rose-100/50">
			<span class="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent block transition-all duration-300">{daysCount.toString().padStart(3, '0')}</span>
			<span class="text-xs font-semibold text-gray-600 mt-1">Ngày</span>
		</div>
		<div class="text-lg font-bold text-rose-400 animate-pulse mx-1">:</div>
		<div class="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 min-w-[70px] shadow-lg border border-rose-100/50">
			<span class="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent block transition-all duration-300">{hoursCount.toString().padStart(2, '0')}</span>
			<span class="text-xs font-semibold text-gray-600 mt-1">Giờ</span>
		</div>
		<div class="text-lg font-bold text-rose-400 animate-pulse mx-1">:</div>
		<div class="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 min-w-[70px] shadow-lg border border-rose-100/50">
			<span class="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent block transition-all duration-300">{minutesCount.toString().padStart(2, '0')}</span>
			<span class="text-xs font-semibold text-gray-600 mt-1">Phút</span>
		</div>
		<div class="text-lg font-bold text-rose-400 animate-pulse mx-1">:</div>
		<div class="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 min-w-[70px] shadow-lg border border-rose-100/50">
			<span class="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent block transition-all duration-300">{secondsCount.toString().padStart(2, '0')}</span>
			<span class="text-xs font-semibold text-gray-600 mt-1">Giây</span>
		</div>
	</div>
	
	<!-- Floating Hearts Animation -->
	<div class="absolute inset-0 pointer-events-none">
		<div class="absolute top-4 left-4 text-lg opacity-15 animate-bounce" style="animation-duration: 2s; animation-delay: 0s;">💖</div>
		<div class="absolute top-4 right-4 text-lg opacity-15 animate-bounce" style="animation-duration: 2.5s; animation-delay: 0.5s;">💕</div>
		<div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-lg opacity-15 animate-bounce" style="animation-duration: 3s; animation-delay: 1s;">💗</div>
		<div class="absolute top-1/2 left-2 text-lg opacity-15 animate-pulse" style="animation-duration: 2.2s; animation-delay: 1.5s;">💝</div>
		<div class="absolute top-1/2 right-2 text-lg opacity-15 animate-pulse" style="animation-duration: 2.8s; animation-delay: 0.8s;">💘</div>
	</div>
</div>

