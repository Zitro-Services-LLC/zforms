
import { supabase } from '@/integrations/supabase/client'
import { InvoiceFormData, PaymentFormData } from './types';

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

// Create new invoice
export async function createInvoice(data: InvoiceFormData): Promise<any> {
  // Calculate tax amount from rate
  const subtotal = data.items.reduce((sum, item) => sum + Number(item.amount), 0);
  const taxAmount = data.tax_rate ? subtotal * (Number(data.tax_rate) / 100) : 0;
  const total = subtotal + taxAmount;

  // Create the invoice
  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      user_id: data.user_id,
      customer_id: data.customer_id,
      contract_id: data.contract_id,
      invoice_number: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      issue_date: data.issue_date,
      due_date: data.due_date,
      subtotal,
      tax_rate: data.tax_rate,
      tax_amount: taxAmount,
      total,
      notes: data.notes,
      status: 'draft'
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }

  // Create line items
  const lineItems = data.items.map(item => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity,
    rate: item.rate,
    amount: item.amount
  }));

  const { error: itemsError } = await supabase
    .from('invoice_items')
    .insert(lineItems);

  if (itemsError) {
    console.error("Error creating invoice items:", itemsError);
    throw itemsError;
  }

  return invoice;
}

// Update existing invoice
export async function updateInvoice(id: string, data: Partial<InvoiceFormData>): Promise<any> {
  // Calculate updated values if items provided
  let updateData: any = { ...data };
  
  if (data.items) {
    const subtotal = data.items.reduce((sum, item) => sum + Number(item.amount), 0);
    const taxAmount = data.tax_rate ? subtotal * (Number(data.tax_rate) / 100) : 0;
    const total = subtotal + taxAmount;
    
    updateData = {
      ...updateData,
      subtotal,
      tax_amount: taxAmount,
      total
    };
    
    // Update line items
    // First delete existing items
    const { error: deleteError } = await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', id);
      
    if (deleteError) {
      console.error("Error deleting existing invoice items:", deleteError);
      throw deleteError;
    }
    
    // Then create new items
    const lineItems = data.items.map(item => ({
      invoice_id: id,
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount
    }));
    
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(lineItems);
      
    if (itemsError) {
      console.error("Error updating invoice items:", itemsError);
      throw itemsError;
    }
  }
  
  // Update the invoice record
  const { data: invoice, error } = await supabase
    .from('invoices')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
  
  return invoice;
}

// Submit invoice to customer
export async function submitInvoice(id: string): Promise<any> {
  const { data, error } = await supabase
    .from('invoices')
    .update({
      status: 'submitted'
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error("Error submitting invoice:", error);
    throw error;
  }
  
  return data;
}

// Mark invoice as paid
export async function markInvoicePaid(id: string): Promise<any> {
  // Get the invoice first to get the total amount
  const { data: invoice, error: getError } = await supabase
    .from('invoices')
    .select('total, amount_paid')
    .eq('id', id)
    .single();
    
  if (getError) {
    console.error("Error getting invoice for payment:", getError);
    throw getError;
  }
  
  // Update the invoice
  const { data, error } = await supabase
    .from('invoices')
    .update({
      status: 'paid',
      amount_paid: invoice.total,
      balance_due: 0
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error("Error marking invoice as paid:", error);
    throw error;
  }
  
  return data;
}

// Record a payment for an invoice
export async function recordPayment(data: PaymentFormData): Promise<any> {
  // Create the payment record
  const { error: paymentError } = await supabase
    .from('invoice_payments')
    .insert({
      invoice_id: data.invoice_id,
      amount: data.amount,
      payment_method: data.payment_method,
      payment_date: data.payment_date,
      transaction_id: data.transaction_id,
      notes: data.notes
    });
    
  if (paymentError) {
    console.error("Error recording payment:", paymentError);
    throw paymentError;
  }
  
  // Get current invoice data
  const { data: invoice, error: getError } = await supabase
    .from('invoices')
    .select('total, amount_paid')
    .eq('id', data.invoice_id)
    .single();
    
  if (getError) {
    console.error("Error getting invoice for payment update:", getError);
    throw getError;
  }
  
  // Calculate new values
  const newAmountPaid = (invoice.amount_paid || 0) + Number(data.amount);
  const newBalanceDue = invoice.total - newAmountPaid;
  const newStatus = newBalanceDue <= 0 ? 'paid' : 'submitted';
  
  // Update invoice with new payment info
  const { data: updatedInvoice, error } = await supabase
    .from('invoices')
    .update({
      amount_paid: newAmountPaid,
      balance_due: newBalanceDue,
      status: newStatus
    })
    .eq('id', data.invoice_id)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating invoice payment totals:", error);
    throw error;
  }
  
  return updatedInvoice;
}
