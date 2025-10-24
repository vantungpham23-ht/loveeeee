import { supabaseAdmin } from '$lib/supabase/server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const form = await request.formData();
		const file = form.get('file') as File;
		const type = form.get('type') as string;

		if (!file) {
			return new Response('Missing file', { status: 400 });
		}

		const ext = file.type.split('/')[1] || 'jpg';
		const path = `avatars/${type}_${Date.now()}.${ext}`;
		
		// Use admin client to bypass RLS
		const { error: uploadError } = await supabaseAdmin
			.storage
			.from('memories')
			.upload(path, file, { contentType: file.type });

		if (uploadError) {
			console.error('Upload error:', uploadError);
			return new Response(uploadError.message, { status: 500 });
		}

		// Get public URL
		const { data } = supabaseAdmin.storage
			.from('memories')
			.getPublicUrl(path);

		return json({ url: data.publicUrl });
	} catch (error) {
		console.error('API error:', error);
		return new Response('Internal server error', { status: 500 });
	}
};
