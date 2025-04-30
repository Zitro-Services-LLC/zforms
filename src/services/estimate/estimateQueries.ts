
import { supabase } from '@/integrations/supabase/client'
import type { EstimateWithCustomer } from './types'
import type { LineItem } from '@/types/estimate'

// Get a single estimate by ID with joined customer info
export async function getEstimateById(id: string): Promise<EstimateWithCustomer> {
  const { data, error } = await supabase
    .from('estimates')
    .select(`
      *,
      customer:customers(*),
      contractor:contractors(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error("getEstimateById error:", error);
    throw error;
  }

  return data as EstimateWithCustomer;
}

// Get all estimate line items for a specific estimate
export async function getEstimateItems(estimateId: string): Promise<LineItem[]> {
  const { data, error } = await supabase
    .from('estimate_items')
    .select('*')
    .eq('estimate_id', estimateId);

  if (error) {
    console.error("getEstimateItems error:", error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    description: item.description,
    quantity: Number(item.quantity),
    rate: Number(item.rate),
    amount: Number(item.amount)
  }));
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
