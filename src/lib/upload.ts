import { supabase } from './supabase/client';

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
		throw new Error('Upload failed');
	}

	return response.json();
}

export async function getAlbums() {
	const { data, error } = await supabase
		.from('albums')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data;
}

export async function getMemories(albumId: string) {
	const { data, error } = await supabase
		.from('memories')
		.select('*')
		.eq('album_id', albumId)
		.order('created_at', { ascending: false });

	if (error) throw error;
	return data;
}

export async function createAlbum(title: string, description?: string) {
	const { data, error } = await supabase
		.from('albums')
		.insert({ title, description })
		.select()
		.single();

	if (error) throw error;
	return data;
}
