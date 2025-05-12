
import { supabase } from '@/integrations/supabase/client'

// Delete invoice and related data
export async function deleteInvoice(invoiceId: string): Promise<void> {
  // Delete related items
  const { error: itemsError } = await supabase
    .from('invoice_items')
    .delete()
    .eq('invoice_id', invoiceId);
    
  if (itemsError) {
    console.error("Error deleting invoice items:", itemsError);
    throw itemsError;
  }
  
  // Delete related payments
  const { error: paymentsError } = await supabase
    .from('invoice_payments')
    .delete()
    .eq('invoice_id', invoiceId);
    
  if (paymentsError) {
    console.error("Error deleting invoice payments:", paymentsError);
    throw paymentsError;
  }
  
  // Delete the invoice itself
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', invoiceId);
    
  if (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
}
