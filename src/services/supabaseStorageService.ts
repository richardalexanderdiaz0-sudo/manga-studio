/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from '../supabase';

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * @param file The file to upload.
 * @param path The path in storage (e.g., 'covers/my-manga.jpg').
 * @param onProgress Optional callback for upload progress (0 to 100).
 * @returns A promise that resolves to the public URL.
 */
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Extract bucket and file path
  // Assuming path is like 'covers/filename.jpg'
  const bucket = 'manga-studio'; // You should create this bucket in Supabase
  
  console.log('Starting upload to Supabase bucket:', bucket, 'path:', path);

  // Supabase doesn't have a built-in progress callback for upload() yet
  // but we can simulate it or just let it be.
  // For now, we'll just do the upload.
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Supabase upload failed:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  if (onProgress) onProgress(100);
  
  return publicUrl;
}
