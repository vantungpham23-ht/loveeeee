<script lang="ts">
	import { supabase } from '$lib/supabase/client';
	
	let coupleInfo = {
		partner1: '',
		partner2: '',
		startDate: '',
		avatar1: '',
		avatar2: ''
	};
	let avatar1Preview = '';
	let avatar2Preview = '';
	let saving = false;
	let uploading = false;
	
	// Load from localStorage on mount
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem('coupleInfo');
		if (saved) {
			coupleInfo = { ...coupleInfo, ...JSON.parse(saved) };
			avatar1Preview = coupleInfo.avatar1;
			avatar2Preview = coupleInfo.avatar2;
		}
	}
	
	async function handleAvatar1Select(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			uploading = true;
			// Upload via API endpoint to bypass RLS
			try {
				const formData = new FormData();
				formData.append('file', file);
				formData.append('type', 'avatar1');
				
				const response = await fetch('/api/upload-avatar', {
					method: 'POST',
					body: formData
				});
				
				if (!response.ok) {
					throw new Error('Upload failed');
				}
				
				const { url } = await response.json();
				avatar1Preview = url;
				coupleInfo.avatar1 = url;
			} catch (error) {
				console.error('Avatar upload error:', error);
				alert('Failed to upload avatar. Please try again.');
			} finally {
				uploading = false;
			}
		}
	}
	
	async function handleAvatar2Select(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			uploading = true;
			// Upload via API endpoint to bypass RLS
			try {
				const formData = new FormData();
				formData.append('file', file);
				formData.append('type', 'avatar2');
				
				const response = await fetch('/api/upload-avatar', {
					method: 'POST',
					body: formData
				});
				
				if (!response.ok) {
					throw new Error('Upload failed');
				}
				
				const { url } = await response.json();
				avatar2Preview = url;
				coupleInfo.avatar2 = url;
			} catch (error) {
				console.error('Avatar upload error:', error);
				alert('Failed to upload avatar. Please try again.');
			} finally {
				uploading = false;
			}
		}
	}
	
	function saveCoupleInfo() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('coupleInfo', JSON.stringify(coupleInfo));
		}
		saving = true;
		setTimeout(() => {
			saving = false;
			alert('Settings saved successfully!');
		}, 1000);
	}
	
	function handleLogout() {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('coupleInfo');
		}
		window.location.href = '/auth';
	}
</script>

<svelte:head>
	<title>Cài Đặt - Dòng Thời Gian Tình Yêu</title>
	<meta name="description" content="Thiết lập thông tin cá nhân và cặp đôi" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 pb-24 relative overflow-hidden">
	<!-- Background Decoration -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-20 left-8 text-5xl opacity-10 animate-pulse">💖</div>
		<div class="absolute top-40 right-12 text-4xl opacity-15 animate-bounce">💕</div>
		<div class="absolute bottom-32 left-16 text-6xl opacity-8 animate-pulse">💝</div>
		<div class="absolute bottom-20 right-8 text-3xl opacity-12 animate-bounce">💗</div>
	</div>

	<div class="container mx-auto px-4 py-12 relative z-10">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-4 tracking-wide">
				⚙️ Cài Đặt
			</h1>
			<p class="text-gray-700 text-xl font-medium">Thiết lập thông tin cá nhân và cặp đôi</p>
		</div>

		<div class="max-w-4xl mx-auto space-y-8">
			<!-- User Info -->
			<div class="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 relative overflow-hidden">
				<div class="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50"></div>
				<div class="relative z-10">
					<h2 class="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center">
						<span class="mr-3 text-3xl">👤</span>
						Thông Tin Người Dùng
					</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-rose-100/50">
							<label class="block text-sm font-semibold text-gray-700 mb-2">📧 Email</label>
							<p class="text-gray-600 font-medium">baolytungpham@gmail.com</p>
						</div>
						<div class="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-rose-100/50">
							<label class="block text-sm font-semibold text-gray-700 mb-2">📅 Thành viên từ</label>
							<p class="text-gray-600 font-medium">24/10/2025</p>
						</div>
					</div>
				</div>
			</div>
		
		<!-- Couple Information -->
		<div class="card">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">💕 Thông Tin Cặp Đôi</h2>
			<div class="space-y-4">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Tên Người Thứ Nhất</label>
						<input
							bind:value={coupleInfo.partner1}
							placeholder="Tên của bạn"
							type="text"
							class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Tên Người Thứ Hai</label>
						<input
							bind:value={coupleInfo.partner2}
							placeholder="Tên người yêu"
							type="text"
							class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200"
						/>
					</div>
				</div>
				
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Ngày Bắt Đầu</label>
					<input
						bind:value={coupleInfo.startDate}
						type="date"
						class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200"
					/>
				</div>
				
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Ảnh Của Bạn</label>
						<div class="space-y-3">
							{#if avatar1Preview}
								<div class="flex items-center space-x-3">
									<img src={avatar1Preview} alt="Ảnh của bạn" class="w-16 h-16 rounded-full object-cover border-2 border-pink-200" />
									<div>
										<p class="text-sm text-gray-600">Ảnh đã tải lên</p>
										<button
											on:click={() => {
												avatar1Preview = '';
												coupleInfo.avatar1 = '';
											}}
											class="text-xs text-red-600 hover:text-red-700"
										>
											Xóa
										</button>
									</div>
								</div>
							{:else}
								<div class="text-center p-4 border-2 border-dashed border-gray-200 rounded-2xl">
									<div class="text-2xl mb-2">📷</div>
									<p class="text-sm text-gray-600 mb-2">Tải lên ảnh của bạn</p>
									<input
										type="file"
										accept="image/*"
										on:change={handleAvatar1Select}
										class="hidden"
										id="avatar1-input"
									/>
									<label for="avatar1-input" class="inline-block bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer text-sm disabled:opacity-50">
										{uploading ? 'Đang tải...' : 'Chọn Ảnh'}
									</label>
								</div>
							{/if}
						</div>
					</div>
					
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Ảnh Người Yêu</label>
						<div class="space-y-3">
							{#if avatar2Preview}
								<div class="flex items-center space-x-3">
									<img src={avatar2Preview} alt="Ảnh người yêu" class="w-16 h-16 rounded-full object-cover border-2 border-purple-200" />
									<div>
										<p class="text-sm text-gray-600">Ảnh đã tải lên</p>
										<button
											on:click={() => {
												avatar2Preview = '';
												coupleInfo.avatar2 = '';
											}}
											class="text-xs text-red-600 hover:text-red-700"
										>
											Xóa
										</button>
									</div>
								</div>
							{:else}
								<div class="text-center p-4 border-2 border-dashed border-gray-200 rounded-2xl">
									<div class="text-2xl mb-2">📷</div>
									<p class="text-sm text-gray-600 mb-2">Tải lên ảnh người yêu</p>
									<input
										type="file"
										accept="image/*"
										on:change={handleAvatar2Select}
										class="hidden"
										id="avatar2-input"
									/>
									<label for="avatar2-input" class="inline-block bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer text-sm disabled:opacity-50">
										{uploading ? 'Đang tải...' : 'Chọn Ảnh'}
									</label>
								</div>
							{/if}
						</div>
					</div>
				</div>
				
				<button
					on:click={saveCoupleInfo}
					disabled={saving}
					class="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
				>
					{saving ? 'Đang lưu...' : 'Lưu Thông Tin'}
				</button>
			</div>
		</div>
		
			<!-- Logout -->
			<div class="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 relative overflow-hidden">
				<div class="absolute inset-0 bg-gradient-to-br from-red-50/50 to-pink-50/50"></div>
				<div class="relative z-10">
					<button
						on:click={handleLogout}
						class="w-full px-6 py-4 border-2 border-red-300 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100 rounded-2xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
					>
						🚪 Đăng Xuất
					</button>
				</div>
			</div>
		</div>
	</div>
</div>