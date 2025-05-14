
import { supabase } from "@/integrations/supabase/client";
import type { Contract } from "@/types/contract";

export async function getContracts(userId: string | undefined): Promise<Contract[]> {
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
        email,
        phone,
        billing_address,
        property_address
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }

  console.log('Fetched contracts:', data);
  
  // Ensure the status values conform to the ContractStatus type
  const typedContracts: Contract[] = data.map(contract => ({
    ...contract,
    status: contract.status.toLowerCase() as any
  }));
  
  return typedContracts;
}
