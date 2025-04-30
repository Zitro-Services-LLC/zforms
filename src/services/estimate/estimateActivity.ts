
import { supabase } from '@/integrations/supabase/client'
import type { EstimateActivity } from '@/types/database.d'

// Track estimate activity
export async function trackEstimateActivity(
  estimateId: string,
  userId: string,
  actionType: EstimateActivity['action_type'],
  details?: any
): Promise<void> {
  try {
    await supabase
      .from('estimate_activities')
      .insert({
        estimate_id: estimateId,
        user_id: userId,
        action_type: actionType,
        action_details: details || {}
      })
  } catch (error) {
    console.error("Error tracking estimate activity:", error)
    // Don't throw here, as this is a non-critical operation
  }
}

// Get estimate activity history
export async function getEstimateActivities(estimateId: string): Promise<EstimateActivity[]> {
  const { data, error } = await supabase
    .from('estimate_activities')
    .select('*')
    .eq('estimate_id', estimateId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching estimate activities:", error)
    throw error
  }

  return data as EstimateActivity[]
}
