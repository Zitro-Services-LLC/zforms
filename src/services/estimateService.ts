
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import type { LineItem } from '@/types/estimate'
import type { EstimateActivity, EstimateImage } from '@/types/database.d'

// Strongly-typed joined estimate + customer row
export type EstimateWithCustomer = Database['public']['Tables']['estimates']['Row'] & {
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
    profile_image_url?: string | null;
    billing_address?: string | null;
    property_address?: string | null;
    same_as_billing?: boolean | null;
    created_at?: string | null;
    updated_at?: string | null;
    user_id?: string;
  } | null
}

// Get all estimates for the user, with joined customer info
export async function getEstimates(userId?: string): Promise<EstimateWithCustomer[]> {
  console.log("Fetching estimates for user:", userId)
  let query = supabase
    .from('estimates')
    .select(`
      *,
      customer:customers(
        id,
        first_name,
        last_name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query
  if (error) {
    console.error("getEstimates error:", error)
    throw error
  }
  console.log("getEstimates data:", data)
  return data as EstimateWithCustomer[]
}

// Create a new estimate and add items
export async function createEstimate(estimateData: {
  customer_id: string,
  user_id: string,
  title: string,
  date: string,
  subtotal: number,
  tax_rate: number,
  tax_amount: number,
  total: number,
  notes?: string,
  status: "draft" | "submitted",
  job_number?: string,
  job_description?: string,
}, items: LineItem[]) {
  // Insert main estimate record
  const { data: newEstimate, error } = await supabase
    .from('estimates')
    .insert([{
      customer_id: estimateData.customer_id,
      user_id: estimateData.user_id,
      title: estimateData.title,
      date: estimateData.date,
      subtotal: estimateData.subtotal,
      tax_rate: estimateData.tax_rate,
      tax_amount: estimateData.tax_amount,
      total: estimateData.total,
      notes: estimateData.notes || "",
      status: estimateData.status,
      job_number: estimateData.job_number || null,
      job_description: estimateData.job_description || null,
      last_modified_by: estimateData.user_id
    }])
    .select()
    .single()

  if (error) {
    throw error
  }

  // Insert items
  const estimate_id = newEstimate.id
  const itemsToInsert = items.map(item => ({
    estimate_id,
    description: item.description,
    quantity: item.quantity,
    rate: item.rate,
    amount: item.amount
  }))

  const { error: itemsError } = await supabase
    .from('estimate_items')
    .insert(itemsToInsert)

  if (itemsError) {
    throw itemsError
  }

  // Track activity
  await trackEstimateActivity(estimate_id, estimateData.user_id, 'created', {
    status: estimateData.status
  })

  return newEstimate
}

// Track estimate activity
export async function trackEstimateActivity(
  estimateId: string,
  userId: string,
  actionType: EstimateActivity['action_type'],
  details?: any
): Promise<void> {
  try {
    // Using type assertion to work around TypeScript errors until Supabase types are updated
    await supabase
      .from('estimate_activities' as any)
      .insert({
        estimate_id: estimateId,
        user_id: userId,
        action_type: actionType,
        action_details: details || {}
      } as any)
  } catch (error) {
    console.error("Error tracking estimate activity:", error)
    // Don't throw here, as this is a non-critical operation
  }
}

// Get estimate activity history
export async function getEstimateActivities(estimateId: string): Promise<EstimateActivity[]> {
  const { data, error } = await supabase
    .from('estimate_activities' as any)
    .select('*')
    .eq('estimate_id', estimateId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching estimate activities:", error)
    throw error
  }

  return data as unknown as EstimateActivity[]
}

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
  
  // Get file URL
  const storagePath = uploadData.path;
  
  // Insert image record using type assertion
  const { data: imageRecord, error: recordError } = await supabase
    .from('estimate_images' as any)
    .insert({
      estimate_id: estimateId,
      storage_path: storagePath,
      file_name: fileName,
      size: file.size,
      content_type: file.type,
      caption: caption || null
    } as any)
    .select()
    .single();
  
  if (recordError) {
    console.error("Error creating image record:", recordError);
    // Try to clean up the uploaded file
    await supabase.storage.from('estimate_images').remove([storagePath]);
    throw recordError;
  }
  
  return imageRecord as unknown as EstimateImage;
}

// Get all images for an estimate
export async function getEstimateImages(estimateId: string): Promise<EstimateImage[]> {
  const { data, error } = await supabase
    .from('estimate_images' as any)
    .select('*')
    .eq('estimate_id', estimateId)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error("Error fetching estimate images:", error);
    throw error;
  }
  
  return data as unknown as EstimateImage[];
}

// Get image URL
export function getEstimateImageUrl(imagePath: string): string {
  return supabase.storage.from('estimate_images').getPublicUrl(imagePath).data.publicUrl;
}

// Delete an estimate image
export async function deleteEstimateImage(imageId: string): Promise<void> {
  // Get the image record first to get the storage path
  const { data: image, error: fetchError } = await supabase
    .from('estimate_images' as any)
    .select('storage_path')
    .eq('id', imageId)
    .single();
  
  if (fetchError) {
    console.error("Error fetching image:", fetchError);
    throw fetchError;
  }
  
  // Add type assertion to help TypeScript understand that image has storage_path
  const storagePath = (image as { storage_path: string }).storage_path;
  
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
    .from('estimate_images' as any)
    .delete()
    .eq('id', imageId);
  
  if (deleteError) {
    console.error("Error deleting image record:", deleteError);
    throw deleteError;
  }
}

// Update estimate view status
export async function trackEstimateView(
  estimateId: string,
  userId: string
): Promise<void> {
  // Update last viewed timestamp using type assertion for new fields
  const { error } = await supabase
    .from('estimates')
    .update({
      last_viewed_at: new Date().toISOString(),
      last_viewed_by: userId
    } as any)
    .eq('id', estimateId);
  
  if (error) {
    console.error("Error updating estimate view status:", error);
    // Don't throw here, as this is a non-critical operation
  }
  
  // Track activity
  await trackEstimateActivity(estimateId, userId, 'viewed');
}
