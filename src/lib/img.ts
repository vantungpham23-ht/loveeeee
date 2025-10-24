import { supabase } from './supabase/client';

export function img(path: string, width = 720, quality = 70) {
	return supabase.storage.from('memories').getPublicUrl(path, {
		transform: { width, quality }
	}).data.publicUrl;
}