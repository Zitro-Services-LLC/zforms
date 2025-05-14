
import { supabase } from "@/integrations/supabase/client";
import type { Contract, ContractStatus } from "@/types/contract";

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
