
import { supabase } from '@/integrations/supabase/client'
import type { EstimateImage } from '@/types/database.d'

// Upload an image for an estimate
export async function uploadEstimateImage(
  estimateId: string, 
  file: File, 
  caption?: string
): Promise<EstimateImage> {
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  const filePath = `${estimateId}/${fileName}`;
  
  // Upload file to storage
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('estimate_images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    throw uploadError;
  }
  
  // Get file URL - Add proper null check and type casting
  const storagePath = uploadData?.path;
  
  if (!storagePath) {
    throw new Error("Failed to get storage path after upload");
  }
  
  // Insert image record
  const { data: imageRecord, error: recordError } = await supabase
    .from('estimate_images')
    .insert({
      estimate_id: estimateId,
      storage_path: storagePath,
      file_name: fileName,
      size: file.size,
      content_type: file.type,
      caption: caption || null
    })
    .select()
    .single();
  
  if (recordError) {
    console.error("Error creating image record:", recordError);
    // Try to clean up the uploaded file
    await supabase.storage.from('estimate_images').remove([storagePath]);
    throw recordError;
  }
  
  return imageRecord as EstimateImage;
}

// Get all images for an estimate
export async function getEstimateImages(estimateId: string): Promise<EstimateImage[]> {
  const { data, error } = await supabase
    .from('estimate_images')
    .select('*')
    .eq('estimate_id', estimateId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error("Error fetching estimate images:", error);
    throw error;
  }
  
  return data as EstimateImage[];
}

// Get image URL
export function getEstimateImageUrl(imagePath: string): string {
  // Fixed: Only proceed if imagePath is a valid string
  if (!imagePath || typeof imagePath !== 'string') {
    console.error("Invalid image path:", imagePath);
    return '';
  }
  
  // Get the public URL safely
  const result = supabase.storage.from('estimate_images').getPublicUrl(imagePath);
  
  // Make sure we have a valid result with publicUrl
  if (result && result.data && result.data.publicUrl) {
    return result.data.publicUrl;
  }
  
  return '';
}

// Delete an estimate image
export async function deleteEstimateImage(imageId: string): Promise<void> {
  // Get the image record first to get the storage path
  const { data: image, error: fetchError } = await supabase
    .from('estimate_images')
    .select('storage_path')
    .eq('id', imageId)
    .single();
  
  if (fetchError) {
    console.error("Error fetching image:", fetchError);
    throw fetchError;
  }
  
  // Use a proper type guard to ensure we have storage_path
  if (!image || !image.storage_path) {
    throw new Error("Could not find storage path for image");
  }
  
  const storagePath = image.storage_path as string;
  
  // Remove from storage
  const { error: storageError } = await supabase
    .storage
    .from('estimate_images')
    .remove([storagePath]);
  
  if (storageError) {
    console.error("Error removing image from storage:", storageError);
    throw storageError;
  }
  
  // Delete the record
  const { error: deleteError } = await supabase
    .from('estimate_images')
    .delete()
    .eq('id', imageId);
  
  if (deleteError) {
    console.error("Error deleting image record:", deleteError);
    throw deleteError;
  }
}
