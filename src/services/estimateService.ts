import { supabase } from "@/integrations/supabase/client";
import type { LineItem } from "@/types/estimate";

// Get all estimates for the user
export async function getEstimates() {
  try {
    console.log("Fetching estimates...");
    const { data, error } = await supabase
      .from('estimates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Failed to fetch estimates:", error);
      throw error;
    }

    console.log("Estimates fetched:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Error in getEstimates:", error);
    throw error;
  }
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
