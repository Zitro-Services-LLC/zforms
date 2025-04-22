
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { LineItem } from "@/types/estimate";

// Strongly-typed joined estimate + customer row
export type EstimateWithCustomer = Database['public']['Tables']['estimates']['Row'] & {
  customer: Database['public']['Tables']['customers']['Row'] | null
};

// Get all estimates for the user, with joined customer info
export async function getEstimates(userId?: string): Promise<EstimateWithCustomer[]> {
  console.log("Fetching estimates for user:", userId);
  
  // Use the correct typing for Supabase queries
  const query = supabase
    .from('estimates')
    .select(`
      *,
      customer:customers (
        id,
        first_name,
        last_name,
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (userId) {
    query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getEstimates error:", error);
    throw error;
  }
  console.log("getEstimates data:", data);
  return data as EstimateWithCustomer[] || [];
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
  status: "draft" | "submitted"
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
      status: estimateData.status
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Insert items
  const estimate_id = newEstimate.id;
  const itemsToInsert = items.map(item => ({
    estimate_id,
    description: item.description,
    quantity: item.quantity,
    rate: item.rate,
    amount: item.amount
  }));

  const { error: itemsError } = await supabase
    .from('estimate_items')
    .insert(itemsToInsert);

  if (itemsError) {
    throw itemsError;
  }

  return newEstimate;
}
