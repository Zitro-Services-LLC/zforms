
import { supabase } from "@/integrations/supabase/client";
import type { Contract, ContractStatus } from "@/types/contract";

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
  
  // Ensure the status values conform to the ContractStatus type
  const typedContracts: Contract[] = data.map(contract => ({
    ...contract,
    status: contract.status.toLowerCase() as ContractStatus
  }));
  
  return typedContracts;
}

export async function getContractById(contractId: string, userId: string | undefined): Promise<Contract | null> {
  if (!contractId || !userId) {
    console.log('No contract ID or user ID provided to getContractById');
    return null;
  }
  
  console.log(`Fetching contract ID ${contractId} for user ${userId}`);
  
  const { data, error } = await supabase
    .from('contracts')
    .select(`
      *,
      customer:customers(
        id,
        first_name,
        last_name,
        email,
        phone,
        billing_address,
        property_address
      )
    `)
    .eq('id', contractId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching contract details:', error);
    throw error;
  }

  if (!data) {
    console.log(`No contract found with ID ${contractId}`);
    return null;
  }

  console.log('Fetched contract details:', data);
  
  // Ensure the status value conforms to the ContractStatus type
  const typedContract: Contract = {
    ...data,
    status: data.status.toLowerCase() as ContractStatus
  };
  
  return typedContract;
}
