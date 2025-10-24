import { supabase } from './supabase/client';
import { getCoupleStatus } from './couple';

export async function uploadFile(file: File, albumId: string, caption?: string) {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('album_id', albumId);
	if (caption) {
		formData.append('caption', caption);
	}

	const response = await fetch('/api/upload', {
		method: 'POST',
		body: formData
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('Upload failed:', {
			status: response.status,
			statusText: response.statusText,
			error: errorText
		});
		throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
	}

	return response.json();
}

export async function getAlbums() {
	const coupleStatus = await getCoupleStatus();
	
	if (!coupleStatus?.isActive || !coupleStatus?.couple?.id) {
		return [];
	}
	
	const { data, error } = await supabase
		.from('albums')
		.select('*')
		.eq('couple_id', coupleStatus.couple.id)
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data;
}

export async function getMemories(albumId: string) {
	const coupleStatus = await getCoupleStatus();
	
	if (!coupleStatus?.isActive || !coupleStatus?.couple?.id) {
		return [];
	}
	
	const { data, error } = await supabase
		.from('memories')
		.select('*')
		.eq('album_id', albumId)
		.eq('couple_id', coupleStatus.couple.id)
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data;
}

export async function createAlbum(title: string, description?: string) {
	const coupleStatus = await getCoupleStatus();
	
	if (!coupleStatus?.isActive || !coupleStatus?.couple?.id) {
		throw new Error('No active couple');
	}
	
	const { data, error } = await supabase
		.from('albums')
		.insert({ 
			title, 
			description,
			couple_id: coupleStatus.couple.id
		})
		.select()
		.single();

	if (error) throw error;
	return data;
}
