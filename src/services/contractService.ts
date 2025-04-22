
import { supabase } from "@/integrations/supabase/client";

export async function getContracts(userId: string | undefined) {
  if (!userId) {
    console.log('No user ID provided to getContracts');
    return [];
  }
  
  console.log('Fetching contracts for user:', userId);
  
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

  console.log('Fetched contracts:', data);
  return data;
}
