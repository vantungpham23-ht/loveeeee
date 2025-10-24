<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import LoveTimer from '../components/LoveTimer.svelte';
	import { supabase } from '$lib/supabase/client';
	import { getCoupleStatus } from '$lib/couple';
	
	dayjs.extend(relativeTime);
	
	let coupleInfo: any = {};
	let albums: any[] = [];
	let loading = true;
	let authLoading = true;
	let user: any = null;
	let coupleStatus: any = null;
	
	onMount(async () => {
		// Check authentication first
		await checkAuthentication();
		
		// Only proceed if user is authenticated
		if (!user) {
			return;
		}
		
		// Load couple info from database
		if (coupleStatus?.couple) {
			coupleInfo = {
				partner1: coupleStatus.couple.partner1_name || 'User 1',
				partner2: coupleStatus.couple.partner2_name || 'User 2', 
				startDate: coupleStatus.couple.start_date || '',
				avatar1: coupleStatus.couple.avatar1 || '',
				avatar2: coupleStatus.couple.avatar2 || ''
			};
		}
		
		// Clear localStorage albums to ensure clean state
		localStorage.removeItem('uploadedAlbums');
		
		// Load albums from Supabase
		loadAlbumsFromSupabase();
		
		// Set up real-time subscription for couple albums and memories
		if (coupleStatus?.couple?.id) {
			const channel = supabase
				.channel('timeline_changes')
				.on('postgres_changes', 
					{ 
						event: '*', 
						schema: 'public', 
						table: 'albums',
						filter: `couple_id=eq.${coupleStatus.couple.id}`
					},
					() => {
						console.log('Albums changed, reloading timeline...');
						loadAlbumsFromSupabase();
					}
				)
				.on('postgres_changes', 
					{ 
						event: '*', 
						schema: 'public', 
						table: 'memories',
						filter: `couple_id=eq.${coupleStatus.couple.id}`
					},
					() => {
						console.log('Memories changed, reloading timeline...');
						loadAlbumsFromSupabase();
					}
				)
				.subscribe();
		}
		
		// Listen for auth state changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_OUT' || !session) {
				// Reset all state when user logs out
				user = null;
				coupleStatus = null;
				coupleInfo = {};
				albums = [];
				loading = true;
				redirectToLogin();
			} else if (event === 'SIGNED_IN' && session) {
				user = session.user;
				console.log('User signed in:', user.email);
				// Refresh couple status when user signs in
				getCoupleStatus().then(status => {
					coupleStatus = status;
					console.log('Couple status refreshed:', status);
				});
			}
		});
		
		// Cleanup subscriptions on component destroy
		return () => {
			if (coupleStatus?.couple?.id) {
				supabase.removeChannel(channel);
			}
			subscription.unsubscribe();
		};
	});
	
	async function checkAuthentication() {
		try {
			authLoading = true;
			const { data: { session }, error } = await supabase.auth.getSession();
			
			if (error) {
				console.error('Auth error:', error);
				redirectToLogin();
				return;
			}
			
			if (!session || !session.user) {
				redirectToLogin();
				return;
			}
			
			user = session.user;
			console.log('User authenticated:', user.email);
			
			// Check couple status
			coupleStatus = await getCoupleStatus();
			
			// If no couple or couple is pending, redirect to couple setup
			if (!coupleStatus?.hasCouple || coupleStatus?.isPending) {
				goto('/couple');
				return;
			}
			
			// If couple is not active, redirect to couple setup
			if (!coupleStatus?.isActive) {
				goto('/couple');
				return;
			}
			
		} catch (err) {
			console.error('Authentication check failed:', err);
			redirectToLogin();
		} finally {
			authLoading = false;
		}
	}
	
	function redirectToLogin() {
		goto('/auth');
	}
	
	async function loadAlbumsFromSupabase() {
		try {
			loading = true;
			
			console.log('Loading albums from Supabase...');
			
			// Only load albums if we have an active couple
			if (!coupleStatus?.isActive || !coupleStatus?.couple?.id) {
				console.log('No active couple, skipping album load');
				albums = [];
				return;
			}
			
			// Get albums filtered by couple_id
			const { data: albumsData, error: albumsError } = await supabase
				.from('albums')
				.select('*')
				.eq('couple_id', coupleStatus.couple.id)
				.order('created_at', { ascending: false });
			
			console.log('Supabase albums response:', { albumsData, albumsError });
			
			if (albumsError) {
				console.error('Error loading albums:', albumsError);
				albums = [];
				return;
			}
			
			// Load latest image for each album
			const albumsWithImages = await Promise.all(
				(albumsData || []).map(async (album) => {
					// Get latest memory for this album (without .single() to avoid 406 error)
					const { data: memories } = await supabase
						.from('memories')
						.select('media_url, created_at')
						.eq('album_id', album.id)
						.order('created_at', { ascending: false })
						.limit(1);
					
					const latestMemory = memories?.[0] || null;
					
					// Get proper image URL from Supabase Storage
					let imageUrl = null;
					if (latestMemory?.media_url) {
						const { data: imageData } = supabase
							.storage
							.from('memories')
							.getPublicUrl(latestMemory.media_url);
						imageUrl = imageData.publicUrl;
						console.log(`Album ${album.title} - Latest image: ${imageUrl}`);
					}
					
					return {
						...album,
						cover_url: imageUrl,
						latest_image_date: latestMemory?.created_at || null
					};
				})
			);
			
			albums = albumsWithImages;
			console.log('Albums after processing:', albums);
			
		} catch (error) {
			console.error('Error loading albums:', error);
			albums = [];
		} finally {
			loading = false;
		}
	}
	
	function loadFromLocalStorage() {
		const savedAlbums = localStorage.getItem('uploadedAlbums');
		if (savedAlbums) {
			const albums = JSON.parse(savedAlbums);
			// Filter out broken blob URLs
			const validAlbums = albums.filter((album: any) => {
				if (!album.media_url) return true;
				// Keep base64 data URLs and external URLs, remove blob URLs
				return album.media_url.startsWith('data:') || album.media_url.startsWith('http');
			});
			
			memories = validAlbums.map((album: any, index: number) => ({
				id: album.id || index,
				media_url: album.media_url || null,
				caption: album.caption || '',
				created_at: album.created_at || new Date().toISOString(),
				albums: { title: album.albums?.title || 'New Album' }
			}));
			
			// Update localStorage with cleaned data
			if (validAlbums.length !== albums.length) {
				localStorage.setItem('uploadedAlbums', JSON.stringify(validAlbums));
			}
		} else {
			// Fallback to mock data
			memories = [
				{
					id: 1,
					media_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400',
					caption: 'Our first date',
					created_at: '2024-01-15',
					albums: { title: 'First Date' }
				},
				{
					id: 2,
					media_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
					caption: 'Valentine\'s Day',
					created_at: '2024-02-14',
					albums: { title: 'Valentine\'s' }
				},
				{
					id: 3,
					media_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
					caption: 'Summer vacation',
					created_at: '2024-07-20',
					albums: { title: 'Summer Trip' }
				}
			];
		}
	}
	
	// Function to refresh timeline
	async function refreshTimeline() {
		await loadAlbumsFromSupabase();
	}
	
	// Expose refresh function globally
	if (typeof window !== 'undefined') {
		(window as any).refreshTimeline = refreshTimeline;
	}
	
	$: loveDuration = coupleInfo.startDate ? dayjs().diff(dayjs(coupleInfo.startDate), 'day') : 0;
	$: loveDurationText = coupleInfo.startDate ? dayjs(coupleInfo.startDate).fromNow() : '';
</script>

<svelte:head>
	<title>Dòng Thời Gian Tình Yêu - Trang Chủ</title>
	<meta name="description" content="Lưu giữ những khoảnh khắc đẹp nhất của tình yêu" />
</svelte:head>

{#if authLoading}
	<!-- Authentication Loading State -->
	<div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 flex items-center justify-center">
		<div class="text-center">
			<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500 mx-auto mb-6"></div>
			<h2 class="text-2xl font-bold text-gray-700 mb-2">Đang kiểm tra đăng nhập...</h2>
			<p class="text-gray-600">Vui lòng chờ trong giây lát</p>
		</div>
	</div>
{:else if !user}
	<!-- Redirect to login - this should not be visible as redirect happens immediately -->
	<div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 flex items-center justify-center">
		<div class="text-center">
			<div class="text-6xl mb-6">🔒</div>
			<h2 class="text-2xl font-bold text-gray-700 mb-2">Chưa đăng nhập</h2>
			<p class="text-gray-600 mb-6">Đang chuyển hướng đến trang đăng nhập...</p>
			<a href="/auth" class="inline-block bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
				Đăng Nhập Ngay 💕
			</a>
		</div>
	</div>
{:else}
	<!-- Main App Content - Only shown when authenticated -->
<div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 pb-24 relative overflow-hidden">
	<!-- Floating Hearts Animation -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-16 left-8 text-5xl opacity-10 animate-pulse">💖</div>
		<div class="absolute top-32 right-12 text-4xl opacity-15 animate-bounce">💕</div>
		<div class="absolute bottom-20 left-16 text-6xl opacity-8 animate-pulse">💝</div>
		<div class="absolute bottom-32 right-8 text-3xl opacity-12 animate-bounce">💗</div>
		<div class="absolute top-1/2 left-4 text-4xl opacity-10 animate-pulse">🌸</div>
		<div class="absolute top-1/3 right-6 text-3xl opacity-15 animate-bounce">🌺</div>
	</div>
	
	<!-- Hero Section -->
	<div class="relative z-10">
		
		<div class="relative container mx-auto px-4 py-16">
			<!-- Couple Info -->
			{#if coupleInfo.partner1 && coupleInfo.partner2}
				<div class="text-center mb-12">
					<!-- Avatar Section with Enhanced Design -->
					<div class="flex justify-center items-center mb-8 relative">
						<!-- Left Avatar with Glow Effect -->
						<div class="relative group">
							{#if coupleInfo.avatar1}
								<img src={coupleInfo.avatar1} alt={coupleInfo.partner1} class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-300" />
							{:else}
								<div class="w-20 h-20 rounded-full bg-gradient-to-br from-rose-200 to-pink-300 flex items-center justify-center text-3xl border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-300">👤</div>
							{/if}
							<div class="absolute -inset-2 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm"></div>
						</div>
						
						<!-- Heart Connection with Animation -->
						<div class="mx-6 text-5xl animate-pulse hover:animate-bounce cursor-pointer">💕</div>
						
						<!-- Right Avatar with Glow Effect -->
						<div class="relative group">
							{#if coupleInfo.avatar2}
								<img src={coupleInfo.avatar2} alt={coupleInfo.partner2} class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-300" />
							{:else}
								<div class="w-20 h-20 rounded-full bg-gradient-to-br from-purple-200 to-fuchsia-300 flex items-center justify-center text-3xl border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-300">👤</div>
							{/if}
							<div class="absolute -inset-2 bg-gradient-to-r from-purple-400 to-fuchsia-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm"></div>
						</div>
					</div>
					
					<!-- Names with Beautiful Typography -->
					<h1 class="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-4 tracking-wide">
						{coupleInfo.partner1} & {coupleInfo.partner2}
					</h1>
					
					<!-- Love Timer with Real-time Counter -->
					{#if coupleInfo.startDate}
						<LoveTimer startDate={coupleInfo.startDate} />
					{:else}
						<!-- Demo Timer for testing -->
						<LoveTimer startDate="2024-01-01" />
					{/if}
				</div>
			{:else}
				<div class="text-center mb-12">
					<div class="text-8xl mb-6 animate-pulse">💖</div>
					<h1 class="text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-4 tracking-wide">
						Dòng Thời Gian Tình Yêu
					</h1>
					<p class="text-gray-700 text-xl mb-8 font-medium">Lưu giữ những khoảnh khắc đẹp nhất của tình yêu</p>
					
					<!-- Demo Love Timer -->
					<div class="mb-8">
						<LoveTimer startDate="2024-01-01" />
					</div>
					
					<a href="/settings" class="inline-block bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-4 rounded-3xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
						Thiết Lập Hồ Sơ 💕
					</a>
				</div>
			{/if}
		</div>
	</div>
	
	<!-- Love Timeline -->
	<div class="container mx-auto px-4 mb-8 -mt-8">
		<div class="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 relative overflow-hidden">
			<!-- Background Pattern -->
			<div class="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50"></div>
			
			<!-- Header with Beautiful Typography -->
			<div class="relative z-10 text-center mb-6">
				<h2 class="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-3 flex items-center justify-center">
					<span class="mr-3 text-4xl animate-pulse">💕</span>
					Dòng Thời Gian Tình Yêu
					<span class="ml-3 text-4xl animate-pulse">💕</span>
				</h2>
				<p class="text-gray-600 text-lg font-medium">Những khoảnh khắc đáng nhớ của chúng ta</p>
			</div>
			
			{#if loading}
				<div class="text-center py-16 relative z-10">
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
					<h3 class="text-xl font-bold text-gray-700 mb-2">Đang tải kỷ niệm...</h3>
					<p class="text-gray-600">Vui lòng chờ trong giây lát</p>
				</div>
			{:else if albums.length > 0}
				<div class="relative z-10">
					<!-- Timeline Line Hidden -->
					
					<div class="space-y-10">
						{#each albums.slice(0, 8) as album, index}
							<div class="relative flex items-start {index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} group">
								<!-- Enhanced Timeline Dot -->
								<div class="relative z-20 flex-shrink-0 w-20 h-20 bg-gradient-to-br from-white to-rose-50 rounded-full border-4 border-rose-300 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
									{#if album.cover_url}
										<img
											src={album.cover_url}
											alt={album.title}
											class="w-14 h-14 object-cover rounded-full"
											on:error={(e) => {
												console.log('Album cover failed to load:', album.cover_url);
												const target = e.target;
												if (target instanceof HTMLImageElement) {
													target.style.display = 'none';
													const nextElement = target.nextElementSibling;
													if (nextElement instanceof HTMLElement) {
														nextElement.style.display = 'block';
													}
												}
											}}
										/>
										<span class="text-2xl hidden">📚</span>
									{:else}
										<span class="text-2xl">📚</span>
									{/if}
									<!-- Glow Effect -->
									<div class="absolute -inset-2 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
								</div>
								
								<!-- Enhanced Album Card -->
								<div class="flex-1 mx-8 {index % 2 === 0 ? 'ml-0' : 'mr-0'} group">
									<div class="bg-gradient-to-br from-rose-50/80 to-pink-50/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-rose-100/50 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
										<!-- Card Background Pattern -->
										<div class="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
										<div class="relative z-10">
											<div class="text-center">
												<h3 class="font-bold text-gray-800 text-lg mb-2">{album.title}</h3>
												{#if album.description}
													<p class="text-gray-600 text-sm mb-3">{album.description}</p>
												{/if}
												<span class="text-xs text-gray-500 bg-white/60 px-3 py-1 rounded-full font-medium">
													{dayjs(album.created_at).format('DD/MM/YYYY')}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
					
					{#if albums.length > 8}
						<div class="text-center mt-10">
							<a href="/albums" class="inline-block bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
								Xem Tất Cả Albums ({albums.length})
							</a>
						</div>
					{/if}
				</div>
			{:else}
				<div class="text-center py-16 relative z-10">
					<div class="text-8xl mb-6 animate-bounce">📸</div>
					<h3 class="text-2xl font-bold text-gray-700 mb-4">Chưa có kỷ niệm nào</h3>
					<p class="text-gray-600 mb-8 text-lg font-medium">Hãy bắt đầu tạo ra những kỷ niệm đẹp cùng nhau!</p>
					<div class="flex justify-center space-x-4">
						<a href="/upload" class="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
							Tải Lên Kỷ Niệm 📸
						</a>
						<a href="/albums" class="px-6 py-3 bg-white border-2 border-rose-300 text-rose-600 rounded-xl hover:bg-rose-50 transition-all duration-300 font-medium text-base shadow-lg hover:shadow-xl transform hover:scale-105">
							Tạo Album Mới 📚
						</a>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
{/if}