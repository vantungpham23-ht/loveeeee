import { supabaseAdmin } from '$lib/supabase/server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		console.log('Avatar upload API called');
		const form = await request.formData();
		const file = form.get('file') as File;
		const type = form.get('type') as string;

		console.log('Avatar upload data:', { 
			fileName: file?.name, 
			fileSize: file?.size, 
			fileType: file?.type,
			type 
		});

		if (!file) {
			console.error('Missing file');
			return new Response('Missing file', { status: 400 });
		}

		const ext = file.type.split('/')[1] || 'jpg';
		const path = `avatars/${type}_${Date.now()}.${ext}`;
		
		console.log('Uploading avatar to storage:', { path, contentType: file.type });
		
		// Use admin client to bypass RLS
		const { error: uploadError } = await supabaseAdmin
			.storage
			.from('memories')
			.upload(path, file, { contentType: file.type });

		if (uploadError) {
			console.error('Avatar upload error:', uploadError);
			return new Response(`Upload failed: ${uploadError.message}`, { status: 500 });
		}

		console.log('Avatar upload successful');

		// Get public URL
		const { data } = supabaseAdmin.storage
			.from('memories')
			.getPublicUrl(path);

		console.log('Avatar public URL:', data.publicUrl);
		return json({ url: data.publicUrl });
	} catch (error) {
		console.error('Avatar API error:', error);
		return new Response('Internal server error', { status: 500 });
	}
};
