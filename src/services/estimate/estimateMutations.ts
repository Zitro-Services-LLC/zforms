import { supabase } from '@/integrations/supabase/client'
import type { LineItem } from '@/types/estimate'
import { trackEstimateActivity } from './estimateActivity'
import type { CreateEstimateData } from './types'

// Create a new estimate and add items
export async function createEstimate(estimateData: CreateEstimateData, items: LineItem[]) {
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

// Update estimate view status
export async function trackEstimateView(
  estimateId: string,
  userId: string
): Promise<void> {
  // Update last viewed timestamp
  const { error } = await supabase
    .from('estimates')
    .update({
      last_viewed_at: new Date().toISOString(),
      last_viewed_by: userId
    })
    .eq('id', estimateId);
  
  if (error) {
    console.error("Error updating estimate view status:", error);
    // Don't throw here, as this is a non-critical operation
  }
  
  // Track activity
  await trackEstimateActivity(estimateId, userId, 'viewed');
}

// Delete estimate and related items
export async function deleteEstimate(estimateId: string): Promise<void> {
  // Start by deleting related records in child tables
  const { error: itemsError } = await supabase
    .from('estimate_items')
    .delete()
    .eq('estimate_id', estimateId);
    
  if (itemsError) {
    console.error("Error deleting estimate items:", itemsError);
    throw itemsError;
  }
  
  // Delete estimate activities
  const { error: activitiesError } = await supabase
    .from('estimate_activities')
    .delete()
    .eq('estimate_id', estimateId);
    
  if (activitiesError) {
    console.error("Error deleting estimate activities:", activitiesError);
    throw activitiesError;
  }
  
  // Delete estimate images
  const { error: imagesError } = await supabase
    .from('estimate_images')
    .delete()
    .eq('estimate_id', estimateId);
    
  if (imagesError) {
    console.error("Error deleting estimate images:", imagesError);
    throw imagesError;
  }
  
  // Finally delete the estimate itself
  const { error } = await supabase
    .from('estimates')
    .delete()
    .eq('id', estimateId);
    
  if (error) {
    console.error("Error deleting estimate:", error);
    throw error;
  }
}
