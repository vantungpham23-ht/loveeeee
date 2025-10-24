import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => event.cookies.set(name, value, options));
			}
		}
	});

	// Handle auth callback
	if (event.url.pathname === '/auth/callback') {
		const code = event.url.searchParams.get('code');
		if (code) {
			await supabase.auth.exchangeCodeForSession(code);
		}
	}

	// Refreshing the auth token
	const {
		data: { session }
	} = await supabase.auth.getSession();

	event.locals.supabase = supabase;
	event.locals.session = session;

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
