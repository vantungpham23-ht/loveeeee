import { supabaseAdmin } from '$lib/supabase/server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		console.log('Upload API called');
		const form = await request.formData();
		const file = form.get('file') as File;
		const album = form.get('album_id') as string;
		const caption = form.get('caption') as string | null;

		console.log('Upload data:', { 
			fileName: file?.name, 
			fileSize: file?.size, 
			fileType: file?.type,
			albumId: album,
			caption 
		});

		if (!file || !album) {
			console.error('Missing file or album_id');
			return new Response('Missing file or album_id', { status: 400 });
		}

		// Check if album exists first
		const { data: albumData, error: albumError } = await supabaseAdmin
			.from('albums')
			.select('couple_id')
			.eq('id', album)
			.single();

		if (albumError) {
			console.error('Album not found:', albumError);
			return new Response(`Album not found: ${albumError.message}`, { status: 404 });
		}

		console.log('Album found:', albumData);

		const ext = file.type.split('/')[1] || 'jpg';
		const path = `albums/${album}/${Date.now()}.${ext}`;
		
		console.log('Uploading to storage:', { path, contentType: file.type });
		
		// Try to upload to storage
		try {
			const { error: uploadError } = await supabaseAdmin
				.storage
				.from('memories')
				.upload(path, file, { contentType: file.type });

			if (uploadError) {
				console.error('Storage upload error:', uploadError);
				return new Response(`Storage error: ${uploadError.message}`, { status: 500 });
			}

			console.log('Storage upload successful');
		} catch (storageError) {
			console.error('Storage upload exception:', storageError);
			return new Response(`Storage exception: ${storageError}`, { status: 500 });
		}

		// Insert memory record
		const { error: insertError } = await supabaseAdmin
			.from('memories')
			.insert({
				album_id: album,
				couple_id: albumData.couple_id,
				media_url: path,
				caption
			});

		if (insertError) {
			console.error('Insert error:', insertError);
			return new Response(insertError.message, { status: 500 });
		}

		console.log('Memory inserted successfully');
		return json({ path });
	} catch (error) {
		console.error('API error:', error);
		return new Response('Internal server error', { status: 500 });
	}
};
