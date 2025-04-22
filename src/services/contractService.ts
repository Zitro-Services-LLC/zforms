
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export async function getContracts(userId: string | undefined) {
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from('contracts')
    .select(`
      *,
      customer:customers(
        first_name,
        last_name,
        email
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }

  return data;
}
