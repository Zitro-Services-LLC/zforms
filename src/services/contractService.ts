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

export async function createContractRevision(
  contractId: string,
  userId: string,
  comments: string
): Promise<void> {
  const { error } = await supabase
    .from('contract_revisions')
    .insert({
      contract_id: contractId,
      user_id: userId,
      revision_type: 'revision_requested',
      comments
    });

  if (error) {
    console.error('Error creating contract revision:', error);
    throw error;
  }
}

export async function updateContractStatus(
  contractId: string,
  status: ContractStatus
): Promise<void> {
  const { error } = await supabase
    .from('contracts')
    .update({ status })
    .eq('id', contractId);

  if (error) {
    console.error('Error updating contract status:', error);
    throw error;
  }
}

export async function deleteContract(contractId: string): Promise<void> {
  // Delete contract revisions
  const { error: revisionsError } = await supabase
    .from('contract_revisions')
    .delete()
    .eq('contract_id', contractId);
    
  if (revisionsError) {
    console.error('Error deleting contract revisions:', revisionsError);
    throw revisionsError;
  }
  
  // Delete the contract itself
  const { error } = await supabase
    .from('contracts')
    .delete()
    .eq('id', contractId);
    
  if (error) {
    console.error('Error deleting contract:', error);
    throw error;
  }
}
