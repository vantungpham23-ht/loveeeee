<script lang="ts">
	import { supabase } from '$lib/supabase/client';
	import { goto } from '$app/navigation';
	
	let email = '';
	let password = '';
	let loading = false;
	let error = '';
	let message = '';
	
	async function handleLogin() {
		if (!email.trim() || !password.trim()) {
			error = 'Please enter both email and password';
			return;
		}
		
		loading = true;
		error = '';
		message = '';
		
		try {
			const { data, error: authError } = await supabase.auth.signInWithPassword({
				email: email.trim(),
				password: password.trim()
			});
			
			if (authError) {
				error = authError.message;
			} else {
				message = 'Login successful! Redirecting...';
				setTimeout(() => {
					goto('/');
				}, 1000);
			}
		} catch (err) {
			error = 'Login failed. Please check your credentials.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login - Love Timeline</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4">
	<div class="max-w-md w-full">
		<div class="text-center mb-8">
			<div class="text-6xl mb-4">💖</div>
			<h1 class="text-3xl font-bold text-pink-600 mb-2">Love Timeline</h1>
			<p class="text-gray-600">Sign in to your account</p>
		</div>
		
		<div class="bg-white rounded-3xl shadow-lg p-8">
			<form on:submit|preventDefault={handleLogin} class="space-y-6">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
					<input
						bind:value={email}
						type="email"
						placeholder="Enter your email"
						required
						class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200"
					/>
				</div>
				
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
					<input
						bind:value={password}
						type="password"
						placeholder="Enter your password"
						required
						class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200"
					/>
				</div>
				
				<button
					type="submit"
					disabled={loading}
					class="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
				>
					{loading ? 'Signing in...' : 'Sign In'}
				</button>
			</form>
			
			{#if error}
				<div class="mt-6 p-3 bg-red-50 border border-red-200 rounded-2xl">
					<p class="text-red-700 text-sm">⚠️ {error}</p>
				</div>
			{/if}
			
			{#if message}
				<div class="mt-6 p-3 bg-green-50 border border-green-200 rounded-2xl">
					<p class="text-green-700 text-sm">✅ {message}</p>
				</div>
			{/if}
		</div>
		
		<div class="text-center mt-6 text-sm text-gray-500">
			<p>Don't have an account? Create one in Supabase Dashboard</p>
		</div>
	</div>
</div>