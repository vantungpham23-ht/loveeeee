import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';

export function createSupabaseServerClient(event: RequestEvent) {
	return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => event.cookies.set(name, value, options));
			}
		}
	});
}

// Admin client for server-side operations that bypass RLS
export const supabaseAdmin = createServerClient(
	PUBLIC_SUPABASE_URL, 
	SUPABASE_SERVICE_ROLE_KEY, 
	{
		cookies: {
			getAll() {
				return [];
			},
			setAll() {
				// No-op for admin client
			}
		}
	}
);